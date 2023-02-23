import isString from 'lodash/isString';
import express from 'express';
import cors from 'cors';
import http from 'http';
import socketIO from 'socket.io';
import {formatISO} from 'date-fns';
import * as rollupUmdApi from './rollup-umd-api';
import * as rollupLibApi from './rollup-lib-api';
import {readAllFilesInDir} from './fileUtils';
import {getBranch, createTree, createCommit, waitForBranchUpdatedWithCommit, getBranchTree} from './githubUtils';
import {GitTreeItem} from '../types';

const clientSockets: any = {};

function notifyClients(messageCode: string) {
    const clientSocketsIds = Object.keys(clientSockets);
    if (clientSocketsIds && clientSocketsIds.length > 0) {
        let clientSocket;
        clientSocketsIds.forEach(clientSocketId => {
            clientSocket = clientSockets[clientSocketId];
            if (clientSocket) {
                clientSocket.emit(messageCode, '');
            }
        });
    }
}

const timeBundlingMessage = 'Bundle is built in';

export function runServer(options: {distDirPath: string, libDirPath: string}) {
    if (!options) {
        throw Error('The dist and lib dirs paths are not specified in the options argument.');
    }
    const {distDirPath, libDirPath} = options;
    if (!distDirPath || !libDirPath) {
        throw Error('The dist and lib dirs paths are not specified in the options argument.');
    }
    rollupUmdApi.watch((code, error) => {
        if (code === 'START') {
            console.log('Watcher is started');
        } else if (code === 'BUNDLE_START') {
            notifyClients('bundling_started');
            console.time(timeBundlingMessage);
        } else if (code === 'BUNDLE_END') {
            console.log('Bundling finished');
        } else if (code === 'END') {
            console.log('Bundling finished all');
            console.timeEnd(timeBundlingMessage);
            notifyClients('bundling_finished');
        } else if (code === 'ERROR') {
            console.log('Bundling finished with error: ', error);
        }
    });

    process.on('exit', function () {
        // watcher.stopWatchingFiles();
        rollupUmdApi.shutdown();
    });


    const port: number = 7373;
    const socketPort: number = 7474;

    const app = express();

    const httpServer = http.createServer(app);
    const io = new socketIO.Server(httpServer, {
        cors: {
            origin: '*'
        }
    });

    io.on("connection", (socket) => {
        console.log("Connected to the client");
        clientSockets[socket.id] = socket;
        socket.conn.on("close", (reason) => {
            // called when the underlying connection is closed
            console.log("Client is disconnected: ", reason);
            delete clientSockets[socket.id];
        });
        socket.emit("hello", "Pancodex theme SDK server is connected.");
        socket.on('upload_skin', (message) => {
            const {
                ownerLogin,
                installationToken,
                repoName,
                workingBranch,
                userName,
                email
            } = message;
            console.log('Building theme library...', message);
            rollupLibApi.build()
                .then(() => {
                    return getBranch(ownerLogin, installationToken, repoName, workingBranch, true);
                })
                .then((branchData) => {
                    return getBranchTree(ownerLogin, installationToken, repoName, branchData.commit.sha, true)
                        .then((branchTreeData) => {
                            const libFilesIndex: Record<string, boolean> = {};
                            branchTreeData.tree.forEach((branchTreeItem: GitTreeItem) => {
                                if (branchTreeItem.path.startsWith('src/theme') && branchTreeItem.type === 'blob') {
                                    libFilesIndex[branchTreeItem.path] = true;
                                }
                            });
                            return libFilesIndex;
                        });
                })
                .then((libFilesIndex) => {
                    const newTreeItems: Array<GitTreeItem> = [];
                    const libFiles = readAllFilesInDir(libDirPath);
                    if (libFiles && libFiles.length > 0) {
                        let newLibFilePath;
                        const libDirPathPrefix = `${libDirPath}/`;
                        libFiles.forEach(fileItem => {
                            newLibFilePath = `src/theme/${fileItem.filePath.replace(libDirPathPrefix, '')}`;
                            delete libFilesIndex[newLibFilePath];
                            newTreeItems.push({
                                path: newLibFilePath,
                                mode: '100644',
                                type: 'blob',
                                content: fileItem.fileData
                            });
                        });
                    }
                    Object.keys(libFilesIndex).forEach(libFileKey => {
                        newTreeItems.push({
                            path: libFileKey,
                            mode: '100644',
                            type: 'blob',
                            sha: null
                        });
                    });
                    const distFiles = readAllFilesInDir(distDirPath);
                    if (distFiles && distFiles.length > 0) {
                        distFiles.forEach(fileItem => {
                            newTreeItems.push({
                                path: `pancodex/${fileItem.fileName}`,
                                mode: '100644',
                                type: 'blob',
                                content: fileItem.fileData
                            });
                        });
                    }
                    return getBranch(ownerLogin, installationToken, repoName, workingBranch)
                        .then((branchData) => {
                            return createTree(ownerLogin, installationToken, repoName, branchData.commit.sha, newTreeItems)
                                .then((newTree) => {
                                    return createCommit(
                                        ownerLogin,
                                        installationToken,
                                        repoName,
                                        workingBranch,
                                        branchData.commit.sha,
                                        newTree.sha,
                                        {
                                            name: userName,
                                            email,
                                            date: formatISO(Date.now())
                                        },
                                        'Update theme preview library'
                                    );
                                }).then((newCommit) => {
                                    return waitForBranchUpdatedWithCommit(ownerLogin, installationToken, repoName, workingBranch, newCommit.sha);
                                });
                        })
                        .then(() => {
                            socket.emit('skin_uploading_success', 'OK');
                        });
                })
                .catch(error => {
                    if (isString(error)) {
                        socket.emit('skin_uploading_error', error);
                        console.error(`ERROR: ${error}`);
                    } else if (error.message) {
                        socket.emit('skin_uploading_error', error.message);
                        console.error(`ERROR: ${error.message}`);
                    } else {
                        socket.emit('skin_uploading_error', JSON.stringify(error));
                        console.error(`ERROR: ${JSON.stringify(error)}`);
                    }
                });
        });
    });

    io.on('disconnect', (socket) => {

    });

    io.engine.on("connection_error", (err: any) => {
        console.log(err.req);      // the request object
        console.log(err.code);     // the error code, for example 1
        console.log(err.message);  // the error message, for example "Session ID unknown"
        console.log(err.context);  // some additional error context
    });

    app.set('etag', false);
    app.use((req, res, next) => {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        next();
    });
    app.use(cors({
        origin: '*'
    }));
    app.use('/dist', express.static(distDirPath));

    httpServer.listen(socketPort);

    app.listen(port, () => {
        console.info('Pancodex theme SDK server started on port: ' + port);
        console.info('Socket port: ' + socketPort);
    });
}
