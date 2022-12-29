export type PageHeaderNavigationItem = {
    id: string;
    title: string;
    url: string;
};

export type NavigationItem = {
    id: string;
    title: string;
    url: string;
    imageSrc?: string;
    imageAlt?: string;
    iconSrc?: string;
    children?: Array<NavigationItem>;
};
