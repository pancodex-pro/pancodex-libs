export type DocumentProfile_Item = {
    id: string;
    name: string;
    metaTags: {
        robots?: string;
    },
    navigation: {
        useTopLevelNavigation?: boolean;
        useSiteNavigation?: boolean;
        usePageNavigation?: boolean;
    },
    twitter: {
        link?: string;
        creator?: string;
        cardType?:
            'SUMMARY_CARD' // Summary Card: Title, description, and thumbnail.
            | 'SUMMARY_CARD_WITH_LARGE_IMAGE'; // Summary Card with Large Image: Similar to the Summary Card, but with a prominently-featured image.
    };
    facebook: {
        link?: string;
    };
    copyright?: string;
    termsAndConditionsSrc?: string;
};

export type DocumentProfiles = Record<string, DocumentProfile_Item>;
