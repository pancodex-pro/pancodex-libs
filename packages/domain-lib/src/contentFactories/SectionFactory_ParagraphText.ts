import {nanoid} from 'nanoid';
import set from 'lodash/set';
import {ContentFactory} from './ContentFactory';
import {DocumentContent_Bean} from '../types';
import {createDocumentContentValue} from './contentFactoriesFacade';

export class SectionFactory_ParagraphText implements ContentFactory {
    createContentValue(
        documentContent: DocumentContent_Bean,
        propertyPath: string
    ): DocumentContent_Bean {
        set(documentContent, propertyPath, {
            id: nanoid(),
            sectionType: 'SECTION_PARAGRAPH',
        });
        documentContent = createDocumentContentValue(
            documentContent,
            `${propertyPath}.paragraphText`,
            'ParagraphTextFactory'
        );
        return documentContent;
    }

}