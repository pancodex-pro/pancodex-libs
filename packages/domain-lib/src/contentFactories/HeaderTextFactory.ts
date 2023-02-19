import set from 'lodash/set';
import {ContentFactory} from './ContentFactory';
import {DocumentContent_Bean} from '../types';
import {compileDocumentContentValue} from '../compilers';
import {nanoid} from 'nanoid';

export class HeaderTextFactory implements ContentFactory {
    createContentValue(
        documentContent: DocumentContent_Bean,
        propertyPath: string
    ): DocumentContent_Bean {
        set(documentContent, propertyPath, {
            id: nanoid(),
            htmlText: 'Type some header text'
        });
        documentContent = compileDocumentContentValue(documentContent, propertyPath, ['HeaderTextCompiler']);
        return documentContent;
    }

}