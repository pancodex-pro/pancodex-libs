import { CSSProperties, ReactNode, SVGProps } from 'react';

export interface LinkProps {
    href: string;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
}

export interface ImgProps {
    url?: string;
    alt?: string;
    svg?: string;
    style?: CSSProperties;
    svgProps?: SVGProps<string | number>;
    className?: string;
}
