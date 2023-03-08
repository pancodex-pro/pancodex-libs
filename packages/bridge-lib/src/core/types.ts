import type {
    Image,
    HeaderText,
    ParagraphText,
    Link,
    StringValue,
    AnyFieldType,
    AnyField,
    DocumentContent_Bean,
    DocumentProfile_Item,
    SiteMap_Bean,
    DocumentContentDataFieldType,
    DocumentsList
} from '@pancodex/domain-lib';

export type {
    Image,
    HeaderText,
    ParagraphText,
    Link,
    StringValue,
    DocumentsList,
    AnyFieldType,
    AnyField,
};

export type DataFieldValue = {
    type: DocumentContentDataFieldType,
    value: string;
};

export type PageContent = Omit<DocumentContent_Bean, 'isCustomSlug' | 'profileId' | 'statusMap'>;
export type PageProfile = DocumentProfile_Item;

export type PageData = {
    name?: string;
    profile?: PageProfile;
    content?: PageContent;
    locale?: string;
    pageDataListByParentId?: Record<string, Array<PageData> | null>;
    pageDataById?: Record<string, PageData | null>;
};

export type PagePathParams = {
    route_path: Array<string>;
};

export type PagePathData = {
    params: PagePathParams;
    locale?: string;
};

export type DocumentContext = {
    locale: string;
    siteMap: SiteMap_Bean;
    documentClass: string;
    documentId: string;
    documentContent: DocumentContent_Bean;
    documentProfile: DocumentProfile_Item;
};

export type SiteMapDataContext_Proxy = {
    siteMap: SiteMap_Bean;
};
