import {
    Document_Bean,
    DocumentContent_Bean,
    DocumentProfile_Index,
    DocumentProfile_Item,
    SiteMap_Bean
} from '@pancodex/domain-lib';
import {DocumentDataFetchingStatus, ReadDataFromFileFunc} from './types';

export async function fetchDocumentDataById(readDataFunc: ReadDataFromFileFunc, siteMap: SiteMap_Bean, documentId: string, locale?: string): Promise<DocumentDataFetchingStatus> {
    let result: DocumentDataFetchingStatus = {};
    try {
        let document: Document_Bean = await readDataFunc<Document_Bean>(`data/documents/${documentId}.json`);
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
    } catch (e: any) {
        result = {
            error: e.message,
            isError: true,
            isNotFound: true
        }
    }
    return result;
}
