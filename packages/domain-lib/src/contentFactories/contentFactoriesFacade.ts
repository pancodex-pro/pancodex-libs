import {cloneDeep} from '../utilities';
import {DocumentContent_Bean} from '../types';
import {ContentFactory} from './ContentFactory';
import {ImageFactory} from './ImageFactory';
import {SectionFactory_Image} from './SectionFactory_Image';
import {SectionFactory_HeaderText} from './SectionFactory_HeaderText';
import {SectionFactory_ParagraphText} from './SectionFactory_ParagraphText';
import {HeaderTextFactory} from './HeaderTextFactory';
import {ParagraphTextFactory} from './ParagraphTextFactory';

export type DocumentContentFactoryName =
    'ImageFactory'
    | 'HeaderTextFactory'
    | 'ParagraphTextFactory'
    | 'SectionFactory_Image'
    | 'SectionFactory_HeaderText'
    | 'SectionFactory_ParagraphText';

const contentFactoriesMap: Map<DocumentContentFactoryName, ContentFactory> = new Map();
contentFactoriesMap.set('ImageFactory', new ImageFactory());
contentFactoriesMap.set('HeaderTextFactory', new HeaderTextFactory());
contentFactoriesMap.set('ParagraphTextFactory', new ParagraphTextFactory());
contentFactoriesMap.set('SectionFactory_Image', new SectionFactory_Image());
contentFactoriesMap.set('SectionFactory_HeaderText', new SectionFactory_HeaderText());
contentFactoriesMap.set('SectionFactory_ParagraphText', new SectionFactory_ParagraphText());

export function createDocumentContentValue(
    documentContent: DocumentContent_Bean,
    propertyPath: string,
    factory: DocumentContentFactoryName
): DocumentContent_Bean {
    let newDocumentContent: DocumentContent_Bean = documentContent;
    const foundFactory: ContentFactory | undefined = contentFactoriesMap.get(factory);
    if (foundFactory) {
        newDocumentContent = foundFactory.createContentValue(newDocumentContent, propertyPath);
    }
    return newDocumentContent;
}

export function cloneDocumentContent(documentContent: DocumentContent_Bean): DocumentContent_Bean {
    const newDocumentContent: DocumentContent_Bean = cloneDeep(documentContent);
    newDocumentContent.title = `${newDocumentContent.title} (copy)`;
    // todo: compile new cloned content
    return newDocumentContent;
}
