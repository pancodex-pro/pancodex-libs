import get from 'lodash/get';
import set from 'lodash/set';
import {DocumentContent_Bean, DocumentContentStatusMap} from '../types/document';
import {Compiler} from './Compiler';
import {ParagraphText} from '../types/fields/ParagraphText';

export class ParagraphTextCompiler implements Compiler {
    compile(documentContent: DocumentContent_Bean, propertyPath: string | undefined): DocumentContent_Bean {
        if (propertyPath) {
            const newStatusMap: DocumentContentStatusMap = documentContent.statusMap || {};
            set(newStatusMap, `${propertyPath}.htmlText`, {});
            let text: ParagraphText = get(documentContent, propertyPath) as ParagraphText;
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