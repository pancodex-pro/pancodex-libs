import {
    SiteMap_Bean,
    SiteMap_Index,
    DocumentRecord_Bean,
    SiteMap_IndexBean
} from '@pancodex/domain';
import {NavigationItem} from '../types';
import {imageResolverInstance} from './imageResolver';

export async function createSiteContentNavigation(siteMap: SiteMap_Bean, siteMapIndex: SiteMap_Index): Promise<Array<NavigationItem>> {
    let result: Array<NavigationItem> = [];
    if (siteMap.root.children && siteMap.root.children.length > 0) {
        let navigationItem: NavigationItem | undefined;
        for(const documentRecord of siteMap.root.children) {
            navigationItem = await createNavigationItemByDocumentRecord(documentRecord, siteMapIndex);
            if (navigationItem) {
                result.push(navigationItem);
            }
        }
    }
    return result;
}

async function createNavigationItemByDocumentRecord(documentRecord: DocumentRecord_Bean, siteMapIndex: SiteMap_Index): Promise<NavigationItem | undefined> {
    let navigationItem: NavigationItem | undefined;
    const foundSiteMapItem: SiteMap_IndexBean | undefined = siteMapIndex[documentRecord.id];
    if (foundSiteMapItem && foundSiteMapItem.content) {
        const {iconSrc, thumbnailImageSrc, title, description} = foundSiteMapItem.content;
            navigationItem = {
                id: foundSiteMapItem.node.id,
                iconSrc: await imageResolverInstance(iconSrc),
                imageSrc: await imageResolverInstance(thumbnailImageSrc),
                imageAlt: description || title,
                title: title,
                url: foundSiteMapItem.nodePath,
                children: null
            };
            if (documentRecord.children && documentRecord.children.length > 0) {
                navigationItem.children = [];
                let createdChildNavigationItem: NavigationItem | undefined;
                for(const childDocumentRecord of documentRecord.children) {
                    createdChildNavigationItem = await createNavigationItemByDocumentRecord(childDocumentRecord, siteMapIndex);
                    if (createdChildNavigationItem) {
                        navigationItem.children.push(createdChildNavigationItem);
                    }
                }
            }
    }
    return navigationItem;
}
