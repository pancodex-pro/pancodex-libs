import { ReactNode } from 'react';

export interface LinkProps {
    href: string;
    className?: string;
    children?: ReactNode;
}

export interface ImgProps {
    url?: string;
    alt?: string;
    svg?: string;
    className?: string;
}
