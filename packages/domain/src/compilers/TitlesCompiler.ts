import set from 'lodash/set';
import {DocumentContent_Bean, DocumentContentStatusMap} from '../types/document';
import {Compiler} from './Compiler';

export class TitlesCompiler implements Compiler {
    compile(documentContent: DocumentContent_Bean): DocumentContent_Bean {
        const {title} = documentContent;
        documentContent.statusMap['title'] = {};
        if (!title || title.length === 0) {
            const newStatusMap: DocumentContentStatusMap = documentContent.statusMap || {};
            set(newStatusMap, 'title', {
                errorMessage: 'Missing title value',
                errorsCount: 1
            });
            documentContent.statusMap = newStatusMap;
        }
        return documentContent;
    }
}
