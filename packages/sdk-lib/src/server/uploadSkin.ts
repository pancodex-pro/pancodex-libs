import {formatISO} from 'date-fns';
import path from 'path';
import * as rollupLibApi from './rollup-lib-api';
import {getBranch, getBranchTree, createTree, createCommit, waitForBranchUpdatedWithCommit} from './githubUtils';
import {GitTreeItem, FileDescription} from '../types';
import {readAllFilesInDir, readFile} from './fileUtils';

interface UploadOptions {
    ownerLogin: string;
    installationToken: string;
    repoName: string;
    workingBranch: string;
    userName: string;
    email: string;
}

export async function uploadSkin(uploadOptions: UploadOptions, libDirPath: string, distDirPath: string, dataDirPath: string) {
    const {ownerLogin, installationToken, repoName, workingBranch, userName, email} = uploadOptions;
    await rollupLibApi.build();
    const branchData = await getBranch(ownerLogin, installationToken, repoName, workingBranch, true);
    const branchTreeData = await getBranchTree(ownerLogin, installationToken, repoName, branchData.commit.sha, true);

    const libFilesIndex: Record<string, boolean> = {};
    const dataDefaultTemplatesFilesIndex: Record<string, boolean> = {};
    branchTreeData.tree.forEach((branchTreeItem: GitTreeItem) => {
        if (branchTreeItem.type === 'blob') {
            if (branchTreeItem.path.startsWith('src/theme')) {
                libFilesIndex[branchTreeItem.path] = true;
            } else if (branchTreeItem.path.startsWith('data/default-templates')) {
                dataDefaultTemplatesFilesIndex[branchTreeItem.path] = true;
            }
        }
    });

    const newTreeItems: Array<GitTreeItem> = [];

    const defaultTemplatesDirPath: string = path.join(dataDirPath, 'default-templates');
    const defaultTemplateFiles = readAllFilesInDir(defaultTemplatesDirPath);
    if (defaultTemplateFiles && defaultTemplateFiles.length > 0) {
        let newDefaultTemplateFilePath;
        const defaultTemplatesDirPathPrefix = `${defaultTemplatesDirPath}/`;
        defaultTemplateFiles.forEach(fileItem => {
            newDefaultTemplateFilePath = `data/default-templates/${fileItem.filePath.replace(defaultTemplatesDirPathPrefix, '')}`;
            delete dataDefaultTemplatesFilesIndex[newDefaultTemplateFilePath];
            newTreeItems.push({
                path: newDefaultTemplateFilePath,
                mode: '100644',
                type: 'blob',
                content: fileItem.fileData
            });
        });
    }
    Object.keys(dataDefaultTemplatesFilesIndex).forEach(defaultTemplateFileKey => {
        newTreeItems.push({
            path: defaultTemplateFileKey,
            mode: '100644',
            type: 'blob',
            sha: null
        });
    });

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

    const documentClassIndexFileDescription: FileDescription = readFile(path.join(dataDirPath, 'documentClassIndex.json'));
    newTreeItems.push({
        path: `data/${documentClassIndexFileDescription.fileName}`,
        mode: '100644',
        type: 'blob',
        content: documentClassIndexFileDescription.fileData
    });

    const stringSelectsIndexFileDescription: FileDescription = readFile(path.join(dataDirPath, 'stringSelectsIndex.json'));
    const textConstantsIndexFileDescription: FileDescription = readFile(path.join(dataDirPath, 'textConstantsIndex.json'));
    newTreeItems.push({
        path: `data/${stringSelectsIndexFileDescription.fileName}`,
        mode: '100644',
        type: 'blob',
        content: stringSelectsIndexFileDescription.fileData
    });
    newTreeItems.push({
        path: `data/${textConstantsIndexFileDescription.fileName}`,
        mode: '100644',
        type: 'blob',
        content: textConstantsIndexFileDescription.fileData
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

    const newTree = await createTree(ownerLogin, installationToken, repoName, branchData.commit.sha, newTreeItems)
    const newCommit = await createCommit(
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
    await waitForBranchUpdatedWithCommit(ownerLogin, installationToken, repoName, workingBranch, newCommit.sha);
}