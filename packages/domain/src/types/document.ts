import {ContentData} from './contentData';

export type LocaleType = string; // todo: add all other locales except orcs' locale
export type DocumentType = 'site' | 'main_page' | 'root_page' | 'page';

export type ContentStatus = {
    errorMessage?: string;
    visibility?: undefined | 'visible' | 'hidden';
    errorsCount?: number;
}

export type DocumentContentStatusMap = Record<string, ContentStatus>;

export type DocumentContent_Base = {
    title: string;
    thumbnailImageSrc?: string; // for Twitter card: 300x157, for Facebook: 400x209
    coverImageSrc?: string; // for Twitter card: 4096x4096, for Facebook: 1200x627
    iconSrc?: string;
    description?: string;
    tags: Record<string, number>;
    profileId: string;
    slug: string;
};

export type DocumentContent_Bean = DocumentContent_Base & {
    dateUpdated: number;
    contentData: ContentData;
    statusMap: DocumentContentStatusMap;
    isCustomSlug?: boolean;
};

export type Document_Base = {
    id: string; // file name
    type: DocumentType;
};

export type Document_Bean = Document_Base & {
    isDeleted?: boolean;
    isSlugLocalized?: boolean;
    contents: Record<LocaleType, DocumentContent_Bean>;
}

export type DocumentRecord_Bean = Document_Base & {
    contents: Partial<Record<LocaleType, DocumentContent_Base>>;
    children: Array<DocumentRecord_Bean>;
};

export type DocumentRecord_TreeItem = DocumentRecord_Bean & {
    level: number;
};

export type DocumentTemplate_Bean = Pick<Document_Bean, 'type'> & {
    contents: Partial<Record<LocaleType, DocumentContent_Base>>;
}
