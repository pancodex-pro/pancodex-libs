import {cloneDeep} from '../utilities';
import {DocumentContent_Bean} from '../types';
import {ContentFactory} from './ContentFactory';
import {HeroSectionFactory_Image} from './HeroSectionFactory_Image';
import {ImageFactory} from './ImageFactory';
import {HeroSectionFactory_HeaderText} from './HeroSectionFactory_HeaderText';
import {HeroSectionFactory_ParagraphText} from './HeroSectionFactory_ParagraphText';
import {BodySectionFactory_Image} from './BodySectionFactory_Image';
import {BodySectionFactory_HeaderText} from './BodySectionFactory_HeaderText';
import {BodySectionFactory_ParagraphText} from './BodySectionFactory_ParagraphText';
import {HeaderTextFactory} from './HeaderTextFactory';
import {ParagraphTextFactory} from './ParagraphTextFactory';

export type DocumentContentFactoryName =
    'ImageFactory'
    | 'HeaderTextFactory'
    | 'ParagraphTextFactory'
    | 'HeroSectionFactory_Image'
    | 'HeroSectionFactory_HeaderText'
    | 'HeroSectionFactory_ParagraphText'
    | 'BodySectionFactory_Image'
    | 'BodySectionFactory_HeaderText'
    | 'BodySectionFactory_ParagraphText';

const contentFactoriesMap: Map<DocumentContentFactoryName, ContentFactory> = new Map();
contentFactoriesMap.set('ImageFactory', new ImageFactory());
contentFactoriesMap.set('HeaderTextFactory', new HeaderTextFactory());
contentFactoriesMap.set('ParagraphTextFactory', new ParagraphTextFactory());
contentFactoriesMap.set('HeroSectionFactory_Image', new HeroSectionFactory_Image());
contentFactoriesMap.set('HeroSectionFactory_HeaderText', new HeroSectionFactory_HeaderText());
contentFactoriesMap.set('HeroSectionFactory_ParagraphText', new HeroSectionFactory_ParagraphText());
contentFactoriesMap.set('BodySectionFactory_Image', new BodySectionFactory_Image());
contentFactoriesMap.set('BodySectionFactory_HeaderText', new BodySectionFactory_HeaderText());
contentFactoriesMap.set('BodySectionFactory_ParagraphText', new BodySectionFactory_ParagraphText());

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
    newDocumentContent.description = `${newDocumentContent.description} (copy)`;
    // todo: compile new cloned content
    return newDocumentContent;
}
