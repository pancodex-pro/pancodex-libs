import {Image, DocumentContentBlock, DocumentsList} from '@pancodex/domain-lib';
import {PageData, DocumentContext} from './types';
import {imageResolverInstance} from './imageResolver';

async function setupSources(documentContentBlock: DocumentContentBlock): Promise<void> {
    const {components} = documentContentBlock;
    if (components && components.length > 0) {
        for(const component of components) {
            const {instances} = component;
            if (instances && instances.length > 0) {
                for(const instance of instances) {
                    const {props} = instance;
                    if (props && props.length > 0) {
                        for (const prop of props) {
                            const {type, fieldContent} = prop;
                            if (type === 'Image') {
                                (fieldContent as Image).src = await imageResolverInstance((fieldContent as Image).src);
                            }
                        }
                    }
                }
            }
        }
    }
}

export async function createPageData(documentContext: DocumentContext): Promise<PageData> {
    const newPageData: PageData = {};
    if (documentContext) {
        const {documentClass, documentContent, documentProfile, locale} = documentContext;
        if (documentContent.documentAreas && documentContent.documentAreas.length > 0) {
            for (const documentArea of documentContent.documentAreas) {
                if (documentArea.blocks && documentArea.blocks.length > 0) {
                    for (const documentContentBlock of documentArea.blocks) {
                        await setupSources(documentContentBlock);
                        if (documentContentBlock.components && documentContentBlock.components.length > 0) {
                            for (const documentContentBlockComponent of documentContentBlock.components) {
                                if (documentContentBlockComponent.instances && documentContentBlockComponent.instances.length > 0) {
                                    for (const componentInstance of documentContentBlockComponent.instances) {
                                        if (componentInstance.props && componentInstance.props.length > 0) {
                                            for (const instanceProp of componentInstance.props) {
                                                const {type, fieldContent} = instanceProp;
                                                if (type === 'DocumentsList') {
                                                    const {documentsIds, selectionMode} = fieldContent as DocumentsList;
                                                    if (documentsIds && documentsIds.length > 0) {
                                                        if (selectionMode === 'selectChildrenDocuments') {
                                                            for (const parentDocumentId of documentsIds) {
                                                                newPageData.pageDataListByParentId = newPageData.pageDataListByParentId || {};
                                                                newPageData.pageDataListByParentId[parentDocumentId] = null;
                                                            }
                                                        } else if (selectionMode === 'selectDocuments') {
                                                            for (const documentId of documentsIds) {
                                                                newPageData.pageDataById = newPageData.pageDataById || {};
                                                                newPageData.pageDataById[documentId] = null;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        newPageData.content = documentContent;
        newPageData.locale = locale;
        newPageData.profile = documentProfile;
        newPageData.name = documentClass;
    }

    return newPageData;
}