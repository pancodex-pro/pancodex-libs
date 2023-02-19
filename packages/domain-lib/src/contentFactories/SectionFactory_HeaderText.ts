import {ContentFactory} from './ContentFactory';
import {DocumentContent_Bean} from '../types';
import set from 'lodash/set';
import {createDocumentContentValue} from './contentFactoriesFacade';
import {nanoid} from 'nanoid';

export class SectionFactory_HeaderText implements ContentFactory {
    createContentValue(
        documentContent: DocumentContent_Bean,
        propertyPath: string
    ): DocumentContent_Bean {
        set(documentContent, propertyPath, {
            id: nanoid(),
            sectionType: 'SECTION_HEADER',
        });
        documentContent = createDocumentContentValue(
            documentContent,
            `${propertyPath}.headerText`,
            'HeaderTextFactory'
        );
        return documentContent;
    }

}