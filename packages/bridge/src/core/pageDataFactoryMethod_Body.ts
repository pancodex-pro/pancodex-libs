import {Body_Section, Body_SectionType} from '@pancodex/domain';
import {
    BodyContentSection,
    BodyContentSection_Header,
    BodyContentSection_Divider,
    BodyContentSection_Cta,
    BodyContentSection_Paragraph,
    BodyContentSection_Image,
} from '../types';

type PageContentSectionFactoryMethod = (sectionContentData: Body_Section) => BodyContentSection;

export const pageContentSectionMethod_Body: Record<Body_SectionType, PageContentSectionFactoryMethod> = {
    'SECTION_HEADER': (sectionContentData) => {
        return {
            type: 'HEADER',
            id: sectionContentData.id,
            htmlText: sectionContentData.headerText?.htmlText
        } as BodyContentSection_Header;
    },
    'SECTION_PARAGRAPH': (sectionContentData) => {
        return {
            type: 'PARAGRAPH',
            id: sectionContentData.id,
            htmlText: sectionContentData.paragraphText?.htmlText
        } as BodyContentSection_Paragraph;
    },
    'SECTION_CTA': (sectionContentData) => {
        return {
            type: 'CTA',
            id: sectionContentData.id,
            title: sectionContentData.cta?.title,
            actionUrl: sectionContentData.cta?.actionUrl
        } as BodyContentSection_Cta;
    },
    'SECTION_DIVIDER': (sectionContentData) => {
        return {
            type: 'DIVIDER',
            id: sectionContentData.id,
        } as BodyContentSection_Divider;
    },
    'SECTION_IMAGE': (sectionContentData) => {
        return {
            type: 'IMAGE',
            id: sectionContentData.id,
            alt: sectionContentData.image?.alt,
            src: sectionContentData.image?.src,
            height: sectionContentData.image?.height,
            width: sectionContentData.image?.width
        } as BodyContentSection_Image;
    },
};
