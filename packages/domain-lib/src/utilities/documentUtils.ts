import {
    Document_Bean,
    DocumentContent_Bean,
    LocaleType,
    DocumentRecord_Bean,
    DocumentContent_Base,
} from '../types';

export function getDocumentTitle(document: Document_Bean | DocumentRecord_Bean, locale?: LocaleType): string {
    if (document.type === 'site') {
        return 'Site';
    }
    if (locale) {
        return document.contents[locale]?.title || 'Not Found';
    }
    return 'Not Found';
}

export function iterateDocumentContents(
    document: Document_Bean,
    visitor: (content: DocumentContent_Bean) => void
): void {
    if (document && document.contents) {
        const localeKeys: Array<LocaleType> = Object.keys(document.contents) as Array<LocaleType>;
        localeKeys.forEach(locale => {
            visitor(document.contents[locale]);
        });
    }
}

export function iterateDocumentRecordContents(
    documentRecord: DocumentRecord_Bean,
    visitor: (content?: DocumentContent_Base) => void
): void {
    if (documentRecord && documentRecord.contents) {
        const localeKeys: Array<LocaleType> = Object.keys(documentRecord.contents) as Array<LocaleType>;
        localeKeys.forEach(locale => {
            visitor(documentRecord.contents[locale]);
        });
    }
}

export function iterateDocumentContentsByLocale(
    document: Document_Bean,
    locale: LocaleType,
    visitor: (content?: DocumentContent_Bean) => void
): void {
    if (document && document.contents) {
        visitor(document.contents[locale]);
    }
}

export function iterateDocumentRecordContentsByLocale(
    document: DocumentRecord_Bean,
    locale: LocaleType,
    visitor: (content?: DocumentContent_Base) => void
): void {
    if (document && document.contents) {
        visitor(document.contents[locale]);
    }
}
