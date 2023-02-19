import {
    DocumentContentBlockClass,
    DocumentClass,
    StringSelectKey,
    TextConstantKey,
    StringSelects_Index,
    TextConstants_Index
} from '@pancodex/domain-lib';

export type StringSelectsConfig = StringSelects_Index;
export type TextConstantsConfig = TextConstants_Index;

export type BlockConfig<S extends StringSelectKey, T extends TextConstantKey> = DocumentContentBlockClass<S, T>;
/**
 * Configuration
 * @template S - a generic argument that is a literal type of all possible keys of string selection variants
 * @template T - a generic argument that is a literal type of all possible keys of text constants
 */
export type DocumentConfig<S extends StringSelectKey, T extends TextConstantKey> = DocumentClass<S, T>;
