import {PageContent} from './PageContent';
import {NavigationItem, PageHeaderNavigationItem} from './Navigation';

export type PageData = {
    title: string;
    description: string | null;
    openGraphData: {
        title: string;
        description: string | null;
        url: string;
        image: string | null;
        imageAlt: string | null;
        locale: string;
        localeAlternate: Array<string> | null;
    };
    twitterCard: {
        card: string;
        title: string;
        description: string | null;
        image: string | null;
    };
    content: PageContent;
    navigation: {
        topLevelNavigation: Array<NavigationItem>;
        siteNavigation: Array<NavigationItem>;
        pageNavigation: Array<PageHeaderNavigationItem>;
    }
};
