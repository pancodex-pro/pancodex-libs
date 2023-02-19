import {DocumentContent_Bean} from '../types/document';
import {TitlesCompiler} from './TitlesCompiler';
import {ImageCompiler} from './ImageCompiler';
import {HeaderTextCompiler} from './HeaderTextCompiler';
import {ParagraphTextCompiler} from './ParagraphTextCompiler';

export abstract class Compiler {
    public abstract compile: (documentContent: DocumentContent_Bean, propertyPath?: string) => DocumentContent_Bean;
}

export type DocumentContentCompilerName =
    'TitlesCompiler'
    | 'ImageCompiler'
    | 'HeaderTextCompiler'
    | 'ParagraphTextCompiler';

export const compilersMap: Map<DocumentContentCompilerName, Compiler> = new Map();
compilersMap.set('TitlesCompiler', new TitlesCompiler());
compilersMap.set('ImageCompiler', new ImageCompiler());
compilersMap.set('HeaderTextCompiler', new HeaderTextCompiler());
compilersMap.set('ParagraphTextCompiler', new ParagraphTextCompiler());
