import {AnyFieldType, AnyField} from './fields';
import {DocumentType, LocaleType} from './document';

export type StringSelectKey = string | undefined | void;
export type TextConstantKey = string | undefined;

export type DocumentContentBlockComponentFieldClass<S extends StringSelectKey = undefined, T extends TextConstantKey = undefined> = {
    label?: string;
    type: AnyFieldType;
    indexNumber: number;
    stringSelectKey?: S;
    textConstantKey?: T;
    fieldContent: AnyField;
};

export type DocumentContentBlockComponentClass<S extends StringSelectKey = undefined, T extends TextConstantKey = undefined> = {
    label: string;
    isArray?: boolean;
    indexNumber: number;
    props: Record<string, DocumentContentBlockComponentFieldClass<S, T>>;
};

export type DocumentContentBlockClass<S extends StringSelectKey = undefined, T extends TextConstantKey = undefined> = {
    description: string;
    isDefault?: boolean;
    components: Record<string, DocumentContentBlockComponentClass<S, T>>;
};

/**
 * @template S - a generic argument that is a literal type of all possible keys of string selection variants
 * @template T - a generic argument that is a literal type of all possible keys of text constants
 */
export type DocumentClass<S extends StringSelectKey = undefined, T extends TextConstantKey = undefined> = {
    type: DocumentType;
    defaultTitle: string;
    defaultSlug: string;
    description: string;
    metaBlocks: Record<string, DocumentContentBlockClass<S, T>>;
    bodyBlocks: Record<string, DocumentContentBlockClass<S, T>>;
};

export type TextConstants_Index = Record<string, Record<LocaleType, string>>;
export type StringSelects_Index = Record<string, Array<{
    label: string;
    value: string;
    icon?: string;
}>>;
export type DocumentClass_Index = Record<string, DocumentClass<string, string>>;
