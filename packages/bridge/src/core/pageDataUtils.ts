import {
    SiteMap_Bean,
    SiteMap_Index,
    DocumentRecord_Bean,
    SiteMap_IndexBean
} from '@pancodex/domain';
import {NavigationItem} from '../types';

export function createSiteContentNavigation(siteMap: SiteMap_Bean, siteMapIndex: SiteMap_Index): Array<NavigationItem> {
    let result: Array<NavigationItem> = [];
    if (siteMap.root.children && siteMap.root.children.length > 0) {
        let navigationItem: NavigationItem | undefined;
        siteMap.root.children.forEach((documentRecord: DocumentRecord_Bean) => {
            navigationItem = createNavigationItemByDocumentRecord(documentRecord, siteMapIndex);
            if (navigationItem) {
                result.push(navigationItem);
            }
        });
    }
    return result;
}

function createNavigationItemByDocumentRecord(documentRecord: DocumentRecord_Bean, siteMapIndex: SiteMap_Index): NavigationItem | undefined {
    let navigationItem: NavigationItem | undefined;
    const foundSiteMapItem: SiteMap_IndexBean | undefined = siteMapIndex[documentRecord.id];
    if (foundSiteMapItem && foundSiteMapItem.content) {
        const {iconSrc, thumbnailImageSrc, title, description} = foundSiteMapItem.content;
            navigationItem = {
                id: foundSiteMapItem.node.id,
                iconSrc: iconSrc,
                imageSrc: thumbnailImageSrc,
                imageAlt: description || title,
                title: title,
                url: foundSiteMapItem.nodePath,
            };
            if (documentRecord.children && documentRecord.children.length > 0) {
                navigationItem.children = [];
                documentRecord.children.forEach((childDocumentRecord: DocumentRecord_Bean) => {
                    // @ts-ignore
                    navigationItem.children.push(createNavigationItemByDocumentRecord(childDocumentRecord, siteMapIndex));
                });
            }
    }
    return navigationItem;
}
