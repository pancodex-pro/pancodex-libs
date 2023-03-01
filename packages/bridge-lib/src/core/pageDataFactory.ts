import {Image, DocumentContentBlock, DocumentContentAreaName} from '@pancodex/domain-lib';
import {PageData, DocumentContext} from './types';
import {imageResolverInstance} from './imageResolver';

const documentContentAreaNames: Array<DocumentContentAreaName> = [
    'linkBlocks',
    'cardBlocks',
    'bodyBlocks'
];

async function setupSources(documentContentBlock: DocumentContentBlock): Promise<void> {
    const {components} = documentContentBlock;
    if (components && components.length > 0) {
        for(const component of components) {
            const {instances} = component;
            if (instances && instances.length > 0) {
                for(const instance of instances) {
                    const {props} = instance;
                    if (props && props.length > 0) {
                        for (const prop of props) {
                            const {type, fieldContent} = prop;
                            if (type === 'Image') {
                                (fieldContent as Image).src = await imageResolverInstance((fieldContent as Image).src);
                            }
                        }
                    }
                }
            }
        }
    }
}

export async function createPageData(documentContext: DocumentContext): Promise<PageData> {
    const newPageData: PageData = {};

    if (documentContext) {
        const {siteMap, documentId, documentClass, documentContent, documentProfile, locale} = documentContext;
        for (const documentContentAreaName of documentContentAreaNames) {
            const contentBlocks: Array<DocumentContentBlock> | undefined = documentContent[documentContentAreaName];
            if (contentBlocks && contentBlocks.length > 0) {
                for (const documentContentBlock of contentBlocks) {
                    await setupSources(documentContentBlock);
                }
            }
        }
        newPageData.content = documentContent;
        newPageData.locale = locale;
        newPageData.profile = documentProfile;
        newPageData.name = documentClass;
        // todo: select documents for recordsets inside the documentContent
        // todo: select documents for various navigation items
        // if (siteMap) {
        //     const siteMapIndex: SiteMap_Index = makeSiteIndex(siteMap.root, {}, siteMap.defaultLocale, documentContext.locale);
        //     const siteNavigation: Array<NavigationItem> = await createSiteContentNavigation(siteMap, siteMapIndex);
        //     console.log('SiteNavigation: ', siteNavigation);
        //     // init top level pages navigation
        //     if (documentProfile.navigation.useTopLevelNavigation) {
        //         if (siteNavigation.length > 0) {
        //             for(const navigationItem of siteNavigation){
        //                 newPageData.navigation.topLevelNavigation.push({
        //                     id: navigationItem.id,
        //                     url: navigationItem.url,
        //                     title: navigationItem.title,
        //                     iconSrc: navigationItem.iconSrc || null,
        //                     imageAlt: navigationItem.imageAlt || null,
        //                     imageSrc: await imageResolverInstance(navigationItem.imageSrc),
        //                     children: null
        //                 });
        //             }
        //         }
        //     }
        //     if (documentProfile.navigation.useSiteNavigation) {
        //         newPageData.navigation.siteNavigation = siteNavigation;
        //     }
        //     if (documentProfile.navigation.usePageNavigation) {
        //         // traverse all header text sections for the inner page navigation
        //         if (newPageData.content.body.length > 0) {
        //             const foundSiteMapItem: SiteMap_IndexBean | undefined = siteMapIndex[documentId];
        //             if (foundSiteMapItem) {
        //                 newPageData.content.body.forEach((bodySection: PageContentSection) => {
        //                     if (bodySection.type === 'HEADER') {
        //                         const headerBodySection: PageContentSection_Header = bodySection as PageContentSection_Header;
        //                         newPageData.navigation.pageNavigation.push({
        //                             id: headerBodySection.id,
        //                             title: headerBodySection.htmlText,
        //                             url: `${foundSiteMapItem.nodePath}#${headerBodySection.id}`
        //                         });
        //                     }
        //                 });
        //             }
        //         }
        //     }
        // }
    }

    return newPageData;
}