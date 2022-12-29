export type HeroContentSection_Header = HeroContentSection_Basic & {
    htmlText: string;
};

export type HeroContentSection_Paragraph = HeroContentSection_Basic & {
    htmlText: string;
};

export type HeroContentSection_Image = HeroContentSection_Basic & {
    alt: string;
    height: number;
    src: string;
    width: number;
};

export type HeroContentSection_Cta = HeroContentSection_Basic & {
    title: string;
    actionUrl: string;
}

export type HeroContentSection_Divider = HeroContentSection_Basic & {}

export type HeroContentSectionType =
    'HEADER' |
    'PARAGRAPH' |
    'DIVIDER' |
    'IMAGE' |
    'CTA';

export type HeroContentSection_Basic = {
    id: string;
    type: HeroContentSectionType;
}

export type HeroContentSection =
    HeroContentSection_Header
    | HeroContentSection_Paragraph
    | HeroContentSection_Cta
    | HeroContentSection_Image
    | HeroContentSection_Divider;
