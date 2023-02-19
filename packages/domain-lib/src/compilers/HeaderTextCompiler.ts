import get from 'lodash/get';
import set from 'lodash/set';
import {DocumentContent_Bean, DocumentContentStatusMap} from '../types/document';
import {Compiler} from './Compiler';
import {HeaderText} from '../types/fields/HeaderText';

export class HeaderTextCompiler implements Compiler {
    compile(documentContent: DocumentContent_Bean, propertyPath: string | undefined): DocumentContent_Bean {
        if (propertyPath) {
            let text: HeaderText = get(documentContent, propertyPath) as HeaderText;
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