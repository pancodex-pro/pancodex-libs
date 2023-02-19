import {AnyField, AnyFieldType} from './fields';

export type LocaleType = string; // todo: add all other locales except orcs' locale
export type DocumentType = 'site' | 'main_page' | 'page' | 'search_results_page';

export type ContentStatus = {
    errorMessage?: string;
    visibility?: undefined | 'visible' | 'hidden';
    errorsCount?: number;
}

export type DocumentContentStatusMap = Record<string, ContentStatus>;

export type DocumentContentBlockComponentField = {
    name: string; // unique name
    type: AnyFieldType,
    fieldContent: AnyField;
};

export type DocumentContentBlockComponentInstance = {
    id?: string;
    props: Array<DocumentContentBlockComponentField>;
};

export type DocumentContentBlockComponent = {
    name: string; // unique name
    isArray?: boolean;
    instances: Array<DocumentContentBlockComponentInstance>;
};

export type DocumentContentBlock = {
    id?: string;
    name: string; // unique name
    components: Array<DocumentContentBlockComponent>;
};

export type DocumentContent_Base = {
    // required fields for system
    title: string;
    slug: string; // MUST be unique through all documents in the site map, used as ID for all dynamic or static data
    profileId: string;
    tags: Record<string, number>;
    dateUpdated?: number;
    isCustomSlug?: boolean;
};

export type DocumentContent_Bean = DocumentContent_Base & {
    metaBlocks: Array<DocumentContentBlock>;
    bodyBlocks: Array<DocumentContentBlock>;
    statusMap: DocumentContentStatusMap;
};

export type DocumentContentAreaName = 'metaBlocks' | 'bodyBlocks'

export type Document_Base = {
    id: string; // file name
    type: DocumentType;
    documentClass: string; // a DocumentClass class name by which the page editor's UI is built
};

export type Document_Bean = Document_Base & {
    isDeleted?: boolean;
    contents: Record<LocaleType, DocumentContent_Bean>;
}

export type DocumentRecord_Bean = Document_Base & {
    contents: Partial<Record<LocaleType, DocumentContent_Base>>;
    children: Array<DocumentRecord_Bean>;
};

export type DocumentRecord_TreeItem = DocumentRecord_Bean & {
    level: number;
};

export type DocumentTemplate = {
    description: string;
    documentSample: Omit<Document_Bean, 'id'>;
};

export type DocumentTemplate_Index = Record<string, DocumentTemplate>;
