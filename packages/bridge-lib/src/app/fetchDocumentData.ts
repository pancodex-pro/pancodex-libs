import {
    DocumentRecord_Bean,
    Document_Bean,
    DocumentContent_Bean,
    DocumentProfile_Index,
    DocumentProfile_Item,
    SiteMap_Bean
} from '@pancodex/domain-lib';
import {DocumentDataFetchingStatus, ReadDataFromFileFunc} from './types';

function findDocument(root: DocumentRecord_Bean, documentSlug: string, locale: string): DocumentRecord_Bean | undefined {
    const foundContent = root.contents[locale];
    if (foundContent && foundContent.slug === documentSlug) {
        return root;
    } else {
        let foundDocument: DocumentRecord_Bean | undefined;
        if (root.children && root.children.length > 0) {
            let childDocument: DocumentRecord_Bean;
            for (childDocument of root.children) {
                foundDocument = findDocument(childDocument, documentSlug, locale);
                if (foundDocument) {
                    break;
                }
            }
        }
        return foundDocument;
    }
}

export async function fetchDocumentData(readDataFunc: ReadDataFromFileFunc, locale?: string, documentSlug?: string): Promise<DocumentDataFetchingStatus> {
    let result: DocumentDataFetchingStatus = {};
    let siteMap: SiteMap_Bean;
    try {
        siteMap = await readDataFunc<SiteMap_Bean>('data/siteMap.json');
        if (!siteMap) {
            throw Error('Site map is not found.');
        }
        let foundDocument: DocumentRecord_Bean | undefined;
        if (documentSlug) {
            foundDocument = findDocument(siteMap.root, documentSlug, locale || siteMap.defaultLocale);
            if (!foundDocument) {
                foundDocument = findDocument(siteMap.root, documentSlug, siteMap.defaultLocale);
            }
        } else {
            foundDocument = siteMap.root.children.find(i => i.type === 'main_page');
        }
        console.log('[fetchPageData] foundDocument by locale: ', documentSlug || 'main_page', locale, foundDocument);
        if (!foundDocument) {
            result.isNotFound = true;
        } else {
            let document: Document_Bean = await readDataFunc<Document_Bean>(`data/documents/${foundDocument.id}.json`);
            if (!document) {
                throw Error('Page file is not found.');
            }
            const documentContent: DocumentContent_Bean | undefined = document.contents[locale || siteMap.defaultLocale] || document.contents[siteMap.defaultLocale];
            if (!documentContent) {
                throw Error('Page content is not found.');
            }
            const documentProfiles: DocumentProfile_Index = await readDataFunc<DocumentProfile_Index>('data/profilesIndex.json');
            if (!documentProfiles) {
                throw Error('Profiles file is not found.');
            }
            let documentProfile: DocumentProfile_Item | undefined = documentProfiles[documentContent.profileId];
            if (!documentProfile) {
                throw Error('Page profile is not found.');
            }
            result.isSuccess = true;
            result.contextProxy = {
                locale: locale || siteMap.defaultLocale,
                siteMap,
                documentClass: document.documentClass,
                documentId: document.id,
                documentContent,
                documentProfile
            };
        }
    } catch (e: any) {
        result = {
            error: e.message,
            isError: true,
            isNotFound: true
        }
    }
    return result;
}
