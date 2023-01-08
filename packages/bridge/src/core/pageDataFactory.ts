import {
    makeSiteIndex,
    SiteMap_Bean,
    DocumentContent_Bean,
    DocumentProfile_Item,
    SiteMap_Index,
    SiteMap_IndexBean
} from '@pancodex/domain';
import {PageData, HeroContentSection, NavigationItem, BodyContentSection_Header} from '../types';
import {pageContentSectionMethod_Hero} from './pageDataFactoryMethod_Hero';
import {pageContentSectionMethod_Body} from './pageDataFactoryMethod_Body';
import {createSiteContentNavigation} from './pageDataUtils';
import {imageResolverInstance} from './imageResolver';

export type DocumentContext_Proxy = {
    locale: string;
    siteMap: SiteMap_Bean;
    documentId: string;
    documentContent: DocumentContent_Bean;
    documentProfile: DocumentProfile_Item;
};

export async function createPageData(contextProxy: DocumentContext_Proxy): Promise<PageData> {
    const newPageData: PageData = {
        title: 'Unknown',
        description: 'Undefined',
        openGraphData: {
            title: 'Unknown',
            description: 'Unknown',
            locale: '',
            url: '',
            image: null,
            imageAlt: null,
            localeAlternate: null
        },
        twitterCard: {
            card: '',
            title: '',
            description: null,
            image: null
        },
        content: {
            body: [],
            hero: [],
        },
        navigation: {
            topLevelNavigation: [],
            siteNavigation: [],
            pageNavigation: []
        }
    };

    if (contextProxy) {
        const {siteMap, documentId, documentContent, documentProfile, locale} = contextProxy;
        newPageData.title = documentContent.title;
        newPageData.description = documentContent.description || null;
        if (documentProfile) {
            newPageData.openGraphData.title = documentContent.title;
            newPageData.openGraphData.description = documentContent.description || null;
            newPageData.openGraphData.image = documentContent.thumbnailImageSrc || documentContent.coverImageSrc || null;
            newPageData.openGraphData.locale = locale;

            if (documentProfile.twitter.cardType === 'SUMMARY_CARD_WITH_LARGE_IMAGE') {
                newPageData.twitterCard.card = 'summary_large_image';
                newPageData.twitterCard.image = documentContent.coverImageSrc || null;
            } else {
                newPageData.twitterCard.card = 'summary';
                newPageData.twitterCard.image = documentContent.thumbnailImageSrc || null;
            }
            newPageData.twitterCard.description = documentContent.description || null;
            newPageData.twitterCard.title = documentContent.title;
        }
        if (documentContent.contentData) {
            const {body, hero} = documentContent.contentData;
            if (hero && hero.length > 0) {
                for(const heroSection of hero) {
                    newPageData.content.hero.push(await pageContentSectionMethod_Hero[heroSection.sectionType](heroSection));
                }
            }
            if (body && body.length > 0) {
                for(const bodySection of body) {
                    newPageData.content.body.push(await pageContentSectionMethod_Body[bodySection.sectionType](bodySection));
                }
            }
        }
        if (siteMap) {
            const siteMapIndex: SiteMap_Index = makeSiteIndex(siteMap.root, {}, siteMap.defaultLocale, contextProxy.locale);
            const siteNavigation: Array<NavigationItem> = await createSiteContentNavigation(siteMap, siteMapIndex);
            console.log('SiteNavigation: ', siteNavigation);
            // init top level pages navigation
            if (documentProfile.navigation.useTopLevelNavigation) {
                if (siteNavigation.length > 0) {
                    for(const navigationItem of siteNavigation){
                        newPageData.navigation.topLevelNavigation.push({
                            id: navigationItem.id,
                            url: navigationItem.url,
                            title: navigationItem.title,
                            iconSrc: navigationItem.iconSrc || null,
                            imageAlt: navigationItem.imageAlt || null,
                            imageSrc: await imageResolverInstance(navigationItem.imageSrc),
                            children: null
                        });
                    }
                }
            }
            if (documentProfile.navigation.useSiteNavigation) {
                newPageData.navigation.siteNavigation = siteNavigation;
            }
            if (documentProfile.navigation.usePageNavigation) {
                if (newPageData.content.body.length > 0) {
                    const foundSiteMapItem: SiteMap_IndexBean | undefined = siteMapIndex[documentId];
                    if (foundSiteMapItem) {
                        newPageData.content.body.forEach((bodySection: HeroContentSection) => {
                            if (bodySection.type === 'HEADER') {
                                const headerBodySection: BodyContentSection_Header = bodySection as BodyContentSection_Header;
                                newPageData.navigation.pageNavigation.push({
                                    id: headerBodySection.id,
                                    title: headerBodySection.htmlText,
                                    url: `${foundSiteMapItem.nodePath}#${headerBodySection.id}`
                                });
                            }
                        });
                    }
                }
            }
        }
    }

    return newPageData;
}