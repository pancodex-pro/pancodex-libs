import {Body_Section, Body_SectionType} from '@pancodex/domain';
import {
    BodyContentSection,
    BodyContentSection_Header,
    BodyContentSection_Divider,
    BodyContentSection_Cta,
    BodyContentSection_Paragraph,
    BodyContentSection_Image,
} from '../types';
import {imageResolverInstance} from './imageResolver';

export type PageContentSectionFactoryMethod = (sectionContentData: Body_Section) => Promise<BodyContentSection>;

export const pageContentSectionMethod_Body: Record<Body_SectionType, PageContentSectionFactoryMethod> = {
    'SECTION_HEADER': async (sectionContentData) => {
        return {
            type: 'HEADER',
            id: sectionContentData.id,
            htmlText: sectionContentData.headerText?.htmlText
        } as BodyContentSection_Header;
    },
    'SECTION_PARAGRAPH': async (sectionContentData) => {
        return {
            type: 'PARAGRAPH',
            id: sectionContentData.id,
            htmlText: sectionContentData.paragraphText?.htmlText
        } as BodyContentSection_Paragraph;
    },
    'SECTION_CTA': async (sectionContentData) => {
        return {
            type: 'CTA',
            id: sectionContentData.id,
            title: sectionContentData.cta?.title,
            actionUrl: sectionContentData.cta?.actionUrl
        } as BodyContentSection_Cta;
    },
    'SECTION_DIVIDER': async (sectionContentData) => {
        return {
            type: 'DIVIDER',
            id: sectionContentData.id,
        } as BodyContentSection_Divider;
    },
    'SECTION_IMAGE': async (sectionContentData) => {
        return {
            type: 'IMAGE',
            id: sectionContentData.id,
            alt: sectionContentData.image?.alt,
            src: await imageResolverInstance(sectionContentData.image?.src),
            height: sectionContentData.image?.height,
            width: sectionContentData.image?.width
        } as BodyContentSection_Image;
    },
};
