import {Section} from './common';
import {Text_Property} from './Text_Property';
import {Image_Property} from './Image_Property';
import {CallToAction_Property} from './CallToAction_Property';

export type Hero_SectionType =
    'SECTION_HEADER' |
    'SECTION_PARAGRAPH' |
    'SECTION_DIVIDER' |
    'SECTION_IMAGE' |
    'SECTION_CTA';

export type Hero_Section = Section & {
    sectionType: Hero_SectionType;
    headerText?: Text_Property;
    paragraphText?: Text_Property;
    image?: Image_Property;
    cta?: CallToAction_Property;
};
