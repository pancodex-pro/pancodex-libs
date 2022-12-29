import get from 'lodash/get';
import isNil from 'lodash/isNil';
import set from 'lodash/set';
import {DocumentContent_Bean, DocumentContentStatusMap} from '../types/document';
import {Compiler} from './Compiler';
import {Image_Property} from '../types/content/Image_Property';

export class ImageCompiler implements Compiler {
    compile(documentContent: DocumentContent_Bean, propertyPath: string | undefined): DocumentContent_Bean {
        if (propertyPath) {
            const newStatusMap: DocumentContentStatusMap = documentContent.statusMap || {};
            set(newStatusMap, `${propertyPath}.alt`, {});
            set(newStatusMap, `${propertyPath}.src`, {});
            set(newStatusMap, `${propertyPath}.width`, {});
            set(newStatusMap, `${propertyPath}.height`, {});
            let image: Image_Property = get(documentContent, propertyPath) as Image_Property;
            if (image) {
                const {alt, src, width, height} = image;
                if (!alt || alt.length === 0) {
                    set(newStatusMap, `${propertyPath}.alt`, {
                        errorMessage: 'Missing image alt text value',
                        errorsCount: 1
                    });
                    documentContent.statusMap = newStatusMap;
                }
                if (!src || src.length === 0) {
                    set(newStatusMap, `${propertyPath}.src`, {
                        errorMessage: 'Missing image source URL value',
                        errorsCount: 1
                    });
                    documentContent.statusMap = newStatusMap;
                }
                if (isNil(width) || width < 0) {
                    set(newStatusMap, `${propertyPath}.width`, {
                        errorMessage: 'The image width should be more that 0',
                        errorsCount: 1
                    });
                    documentContent.statusMap = newStatusMap;
                }
                if (isNil(height) || height < 0) {
                    set(newStatusMap, `${propertyPath}.height`, {
                        errorMessage: 'The image height should be more that 0',
                        errorsCount: 1
                    });
                    documentContent.statusMap = newStatusMap;
                }
            }
        }
        return documentContent;
    }
}