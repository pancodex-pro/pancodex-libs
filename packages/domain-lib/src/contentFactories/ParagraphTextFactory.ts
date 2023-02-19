import set from 'lodash/set';
import {ContentFactory} from './ContentFactory';
import {DocumentContent_Bean} from '../types';
import {compileDocumentContentValue} from '../compilers';

export class ParagraphTextFactory implements ContentFactory {
    createContentValue(
        documentContent: DocumentContent_Bean,
        propertyPath: string
    ): DocumentContent_Bean {
        set(documentContent, propertyPath, {
            htmlText: 'Type some text'
        });
        documentContent = compileDocumentContentValue(documentContent, propertyPath, ['ParagraphTextCompiler']);
        return documentContent;
    }

}