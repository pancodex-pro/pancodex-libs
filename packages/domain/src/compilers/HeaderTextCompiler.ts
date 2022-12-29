import get from 'lodash/get';
import set from 'lodash/set';
import {DocumentContent_Bean, DocumentContentStatusMap} from '../types/document';
import {Compiler} from './Compiler';
import {Text_Property} from '../types/content/Text_Property';

export class HeaderTextCompiler implements Compiler {
    compile(documentContent: DocumentContent_Bean, propertyPath: string | undefined): DocumentContent_Bean {
        if (propertyPath) {
            let text: Text_Property = get(documentContent, propertyPath) as Text_Property;
            if (text) {
                const newStatusMap: DocumentContentStatusMap = documentContent.statusMap || {};
                set(newStatusMap, `${propertyPath}.htmlText`, {});
                const {htmlText} = text;
                if (!htmlText || htmlText.length === 0) {
                    set(newStatusMap, `${propertyPath}.htmlText`, {
                        errorMessage: 'Missing header text value',
                        errorsCount: 1
                    });
                    documentContent.statusMap = newStatusMap;
                }
            }
        }
        return documentContent;
    }
}