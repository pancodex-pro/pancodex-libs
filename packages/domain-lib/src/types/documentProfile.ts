export type DocumentProfile_Item = {
    id: string;
    name: string;
    // mainNavigationGroups: Record<string, DocumentContent_Group>; // use for top nav bar navigation
    // pageLevelNavigationGroups: Record<string, DocumentContent_Group>; // use for the sidebar navigation
    // footerNavigationGroups: Record<string, DocumentContent_Group>; // use for page bottom navigation
    // hasInternalNavigation?: boolean; // page sections navigation
    // hasBreadcrumbs?: boolean; // the path from the root of the site
    // socialLinksGroups: Record<string, DocumentContent_Group>; // facebook, twitter, etc. groups
};

export type DocumentProfiles = Record<string, DocumentProfile_Item>;
