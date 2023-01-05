export type PageHeaderNavigationItem = {
    id: string;
    title: string;
    url: string;
};

export type NavigationItem = {
    id: string;
    title: string;
    url: string;
    imageSrc: string | null;
    imageAlt: string | null;
    iconSrc: string | null;
    children: Array<NavigationItem> | null;
};
