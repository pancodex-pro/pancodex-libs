import {PageContent} from './PageContent';
import {NavigationItem, PageHeaderNavigationItem} from './Navigation';

export type PageData = {
    title: string;
    description?: string;
    openGraphData: {
        title: string;
        description?: string;
        url: string;
        image?: string;
        imageAlt?: string;
        locale: string;
        localeAlternate?: Array<string>;
    };
    twitterCard: {
        card: string;
        title: string;
        description?: string;
        image?: string;
    };
    content: PageContent;
    navigation: {
        topLevelNavigation: Array<NavigationItem>;
        siteNavigation: Array<NavigationItem>;
        pageNavigation: Array<PageHeaderNavigationItem>;
    }
};
