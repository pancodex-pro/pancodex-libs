export type BodyContentSection_Header = BodyContentSection_Basic & {
    htmlText: string;
};

export type BodyContentSection_Paragraph = BodyContentSection_Basic & {
    htmlText: string;
};

export type BodyContentSection_Image = BodyContentSection_Basic & {
    alt: string;
    height: number;
    src: string;
    width: number;
};

export type BodyContentSection_Cta = BodyContentSection_Basic & {
    title: string;
    actionUrl: string;
}

export type BodyContentSection_Divider = BodyContentSection_Basic & {}

export type BodyContentSectionType =
    'HEADER' |
    'PARAGRAPH' |
    'DIVIDER' |
    'IMAGE' |
    'CTA';

export type BodyContentSection_Basic = {
    id: string;
    type: BodyContentSectionType;
}

export type BodyContentSection =
    BodyContentSection_Header
    | BodyContentSection_Paragraph
    | BodyContentSection_Cta
    | BodyContentSection_Image
    | BodyContentSection_Divider;
