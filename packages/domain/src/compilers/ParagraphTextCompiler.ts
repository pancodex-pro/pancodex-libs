import get from 'lodash/get';
import set from 'lodash/set';
import {DocumentContent_Bean, DocumentContentStatusMap} from '../types/document';
import {Compiler} from './Compiler';
import {Text_Property} from '../types/content/Text_Property';

export class ParagraphTextCompiler implements Compiler {
    compile(documentContent: DocumentContent_Bean, propertyPath: string | undefined): DocumentContent_Bean {
        if (propertyPath) {
            const newStatusMap: DocumentContentStatusMap = documentContent.statusMap || {};
            set(newStatusMap, `${propertyPath}.htmlText`, {});
            let text: Text_Property = get(documentContent, propertyPath) as Text_Property;
            if (text) {
                const {htmlText} = text;
                if (!htmlText || htmlText.length === 0) {
                    set(newStatusMap, `${propertyPath}.htmlText`, {
                        errorMessage: 'Missing paragraph text value',
                        errorsCount: 1
                    });
                    documentContent.statusMap = newStatusMap;
                }
            }
        }
        return documentContent;
    }
}