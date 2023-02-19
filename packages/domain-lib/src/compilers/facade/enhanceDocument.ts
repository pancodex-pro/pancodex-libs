import {nanoid} from 'nanoid';
import {Document_Bean, DocumentContent_Bean, DocumentContentBlock} from '../../types/document';
import {
    iterateDocumentContents,
    iterateDocumentContentAreaBlocks,
    iterateDocumentContentAreaBlockComponents,
    iterateDocumentContentAreaBlockComponentInstances, iterateDocumentContentAreaBlockComponentFields
} from '../../utilities';

function setBlocks(blocks: Array<DocumentContentBlock>) {
    iterateDocumentContentAreaBlocks(blocks, '', (block, blockPathPrefix) => {
        const {components} = block;
        if (!block.id) {
            block.id = nanoid();
        }
        iterateDocumentContentAreaBlockComponents(components, blockPathPrefix, (component, componentPathPrefix) => {
            const {instances} = component;
            iterateDocumentContentAreaBlockComponentInstances(instances, componentPathPrefix, (instance, instancePathPrefix) => {
                if (!instance.id) {
                    instance.id = nanoid();
                }
            });
        });
    });
}

function setMissingParts(documentContent?: DocumentContent_Bean): void {
    if (documentContent) {
        if (!documentContent.bodyBlocks) {
            documentContent.bodyBlocks = [];
        } else {
            setBlocks(documentContent.bodyBlocks);
        }
        if (!documentContent.metaBlocks) {
            documentContent.metaBlocks = [];
        } else {
            setBlocks(documentContent.metaBlocks);
        }
        if (!documentContent.statusMap) {
            documentContent.statusMap = {};
        }
        if (!documentContent.profileId) {
            documentContent.profileId = 'someId';
        }
        if (!documentContent.tags) {
            documentContent.tags = {};
        }
    }
}

export function enhanceDocument(document: Document_Bean): Document_Bean {
    if (document) {
        // fix the incompatibilities from the previous versions
        if ((document as any).profileId) {
            delete (document as any).profileId
        }
        iterateDocumentContents(document, setMissingParts);
    }
    return document;
}
