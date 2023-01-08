import {Hero_Section, Hero_SectionType} from '@pancodex/domain';
import {
    HeroContentSection,
    HeroContentSection_Header,
    HeroContentSection_Divider,
    HeroContentSection_Cta,
    HeroContentSection_Paragraph,
    HeroContentSection_Image,
} from '../types';
import {imageResolverInstance} from './imageResolver';

type PageContentSectionFactoryMethod =  (sectionContentData: Hero_Section) => Promise<HeroContentSection>;

export const pageContentSectionMethod_Hero: Record<Hero_SectionType, PageContentSectionFactoryMethod> = {
    'SECTION_HEADER': async (sectionContentData) => {
        return {
            type: 'HEADER',
            id: sectionContentData.id,
            htmlText: sectionContentData.headerText?.htmlText
        } as HeroContentSection_Header;
    },
    'SECTION_PARAGRAPH': async (sectionContentData) => {
        return {
            type: 'PARAGRAPH',
            id: sectionContentData.id,
            htmlText: sectionContentData.paragraphText?.htmlText
        } as HeroContentSection_Paragraph;
    },
    'SECTION_CTA': async (sectionContentData) => {
        return {
            type: 'CTA',
            id: sectionContentData.id,
            title: sectionContentData.cta?.title,
            actionUrl: sectionContentData.cta?.actionUrl
        } as HeroContentSection_Cta;
    },
    'SECTION_DIVIDER': async (sectionContentData) => {
        return {
            type: 'DIVIDER',
            id: sectionContentData.id,
        } as HeroContentSection_Divider;
    },
    'SECTION_IMAGE': async (sectionContentData) => {
        return {
            type: 'IMAGE',
            id: sectionContentData.id,
            alt: sectionContentData.image?.alt,
            src: await imageResolverInstance(sectionContentData.image?.src),
            height: sectionContentData.image?.height,
            width: sectionContentData.image?.width
        } as HeroContentSection_Image;
    },
};
