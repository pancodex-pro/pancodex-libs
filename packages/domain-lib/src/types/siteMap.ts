import {LocaleType, DocumentRecord_Bean, DocumentContent_Base} from './document';

export type SiteMap_Bean = {
    defaultLocale: LocaleType;
    root: DocumentRecord_Bean;
};

export type SiteMap_IndexBean = {
    node: DocumentRecord_Bean;
    nodePathItems: Array<DocumentRecord_Bean>;
    nodePath: string;
    nodePathIndex: Record<string, boolean>;
    content?: DocumentContent_Base;
};

export type SiteMap_Index = Record<string, SiteMap_IndexBean>;
