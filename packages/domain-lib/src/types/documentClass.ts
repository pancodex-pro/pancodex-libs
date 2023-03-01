import {AnyFieldType, AnyField} from './fields';
import {DocumentType, LocaleType, DocumentContentDataFieldType} from './document';

export type DocumentContentBlockComponentFieldClass = {
    label?: string;
    type: AnyFieldType;
    indexNumber: number;
    fieldContent: AnyField;
};

export type DocumentContentBlockComponentClass = {
    label: string;
    isArray?: boolean;
    indexNumber: number;
    props: Record<string, DocumentContentBlockComponentFieldClass>;
};

export type DocumentContentBlockClass = {
    description: string;
    isDefault?: boolean;
    components: Record<string, DocumentContentBlockComponentClass>;
};

export type DocumentContentDataFieldClassVariant = {
    label: string;
    value: string;
    icon?: string;
};
export type DocumentContentDataFieldClassInputType = 'text' | 'number' | 'select' | 'dataSetField';
export type DocumentContentDataFieldClass = {
    label: string;
    indexNumber: number;
    dataType: DocumentContentDataFieldType;
    inputType: DocumentContentDataFieldClassInputType;
    variants?: Array<DocumentContentDataFieldClassVariant>;
    defaultValue?: string;
    dataSetField?: string;
};

export type DocumentClass = {
    type: DocumentType;
    label: string;
    description: string;
    defaultTitle: string;
    defaultSlug: string;
    dataFields: Record<string, DocumentContentDataFieldClass>;
    linkBlocks: Record<string, DocumentContentBlockClass>;
    cardBlocks: Record<string, DocumentContentBlockClass>;
    bodyBlocks: Record<string, DocumentContentBlockClass>;
};

export type DocumentClass_Index = Record<string, DocumentClass>;
