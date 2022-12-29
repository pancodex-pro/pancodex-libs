import {Hero_Section, Hero_SectionType} from '@pancodex/domain';
import {
    HeroContentSection,
    HeroContentSection_Header,
    HeroContentSection_Divider,
    HeroContentSection_Cta,
    HeroContentSection_Paragraph,
    HeroContentSection_Image,
} from '../types';

type PageContentSectionFactoryMethod = (sectionContentData: Hero_Section) => HeroContentSection;

export const pageContentSectionMethod_Hero: Record<Hero_SectionType, PageContentSectionFactoryMethod> = {
    'SECTION_HEADER': (sectionContentData) => {
        return {
            type: 'HEADER',
            id: sectionContentData.id,
            htmlText: sectionContentData.headerText?.htmlText
        } as HeroContentSection_Header;
    },
    'SECTION_PARAGRAPH': (sectionContentData) => {
        return {
            type: 'PARAGRAPH',
            id: sectionContentData.id,
            htmlText: sectionContentData.paragraphText?.htmlText
        } as HeroContentSection_Paragraph;
    },
    'SECTION_CTA': (sectionContentData) => {
        return {
            type: 'CTA',
            id: sectionContentData.id,
            title: sectionContentData.cta?.title,
            actionUrl: sectionContentData.cta?.actionUrl
        } as HeroContentSection_Cta;
    },
    'SECTION_DIVIDER': (sectionContentData) => {
        return {
            type: 'DIVIDER',
            id: sectionContentData.id,
        } as HeroContentSection_Divider;
    },
    'SECTION_IMAGE': (sectionContentData) => {
        return {
            type: 'IMAGE',
            id: sectionContentData.id,
            alt: sectionContentData.image?.alt,
            src: sectionContentData.image?.src,
            height: sectionContentData.image?.height,
            width: sectionContentData.image?.width
        } as HeroContentSection_Image;
    },
};
