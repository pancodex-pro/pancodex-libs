import {ContentFactory} from './ContentFactory';
import {DocumentContent_Bean} from '../types';
import set from 'lodash/set';
import {compileDocumentContentValue} from '../compilers';

export class ImageFactory implements ContentFactory {
    createContentValue(
        documentContent: DocumentContent_Bean,
        propertyPath: string
    ): DocumentContent_Bean {
        set(documentContent, propertyPath, {
            alt: '',
            width: -1,
            height: -1,
            src: ''
        });
        documentContent = compileDocumentContentValue(documentContent, propertyPath, ['ImageCompiler']);
        return documentContent;
    }

}