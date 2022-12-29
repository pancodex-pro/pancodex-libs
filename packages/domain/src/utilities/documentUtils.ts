import forOwn from 'lodash/forOwn';
import {
    Document_Bean,
    DocumentContent_Bean,
    LocaleType,
    ContentStatus,
    DocumentRecord_Bean,
    DocumentContent_Base
} from '../types';

// function getChildrenIdsAsArrayOfStrings(data: Array<DocumentGraph_Record>, acc: Array<string> = []) {
//     if (data && data.length > 0) {
//         data.forEach((item: DocumentGraph_Record) => {
//             acc.push(item.document_id.toString());
//             if (item.children && item.children.length > 0) {
//                 acc = acc.concat(getChildrenIdsAsArrayOfStrings(item.children, acc));
//             }
//         });
//     }
//     return acc;
// }
//
// export function getIdsAsArrayOfStrings(data: Array<DocumentGraph_Record>) {
//     return getChildrenIdsAsArrayOfStrings(data);
// }

export function getDocumentContentErrorsCount(documentContent?: DocumentContent_Bean): number {
    let result: number = 0;
    if (documentContent) {
        const keys: Array<string> = Object.keys(documentContent.statusMap);
        keys.forEach(keyItem => {
            result += documentContent.statusMap[keyItem]?.errorsCount ?? 0;
        });
    }
    return result;
}

export function getDocumentErrorsCount(document?: Document_Bean) {
    let result = 0;
    if (document) {
        if (document.contents) {
            const localeKeys: Array<LocaleType> = Object.keys(document.contents) as Array<LocaleType>;
            localeKeys.forEach(locale => {
                result += getDocumentContentErrorsCount(document.contents[locale]);
            });
        }
    }
    return result;
}

export function getDocumentContentErrorsCountByField(documentContent?: DocumentContent_Bean, fieldName?: string): number {
    let resultCount = 0;
    if (documentContent && fieldName) {
        const contentDataStatusMap = documentContent.statusMap;
        forOwn(contentDataStatusMap, (status: ContentStatus, key: string) => {
            if (key.startsWith(fieldName)) {
                resultCount += status.errorsCount || 0;
            }
        });
    }
    return resultCount;
}

export function getDocumentErrorsCountByField(document?: Document_Bean, fieldName?: string): number {
    let resultCount = 0;
    if (document && fieldName) {
        if (document.contents) {
            const localeKeys: Array<LocaleType> = Object.keys(document.contents) as Array<LocaleType>;
            localeKeys.forEach(locale => {
                resultCount += getDocumentContentErrorsCountByField(document.contents[locale], fieldName);
            });
        }
    }
    return resultCount;
}

// export function getDocumentTitlesErrorsCount(document?: Document_Bean): number {
//     let result: number = 0;
//     if (document) {
//         if (document.contents) {
//             const localeKeys: Array<LocaleType> = Object.keys(document.contents) as Array<LocaleType>;
//             localeKeys.forEach(locale => {
//                 result += getDocumentContentTitlesErrorsCount(document.contents[locale]);
//             });
//         }
//     }
//     return result;
// }
//
// export function getDocumentContentTitlesErrorsCount(documentContent?: DocumentContent_Bean): number {
//     if (documentContent) {
//         return get(documentContent, 'titleStatus.errorsCount', 0) + get(documentContent, 'slugStatus.errorsCount', 0);
//     }
//     return 0;
// }
//
// export function makeDocumentRecordFromDocumentGraphRecord(source: DocumentGraph_Record): Document_Record {
//     const result = cloneDeep(source);
//     delete result.children;
//     return result;
// }
//
// export function makeDocumentCompositionRecordFromDocumentRecord(source: Document_Record): DocumentComposition_Record {
//     return {
//         ...source,
//         composition_id: -1,
//         composition_recordStatus: -1,
//         compositionType_id: -1,
//         compositionType_name: '',
//         composition_dateUpdated: -1,
//         composition_indexNumber: -1,
//     };
// }

export function traverseDocumentContents(document: Document_Bean | DocumentRecord_Bean, visitor: (content?: DocumentContent_Base) => void) {
    if (document && document.contents) {
        const localeKeys: Array<LocaleType> = Object.keys(document.contents) as Array<LocaleType>;
        localeKeys.forEach(locale => {
            visitor(document.contents[locale]);
        });
    }
}

export function traverseDocumentContentsByLocale(document: Document_Bean | DocumentRecord_Bean, locale: LocaleType, visitor: (content?: DocumentContent_Base) => void) {
    if (document && document.contents) {
        visitor(document.contents[locale]);
    }
}
