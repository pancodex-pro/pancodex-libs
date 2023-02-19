import React from 'react';
import NextLink from 'next/link';
import { LinkProps } from './types';

export const Link: React.FC<LinkProps> = (props: LinkProps) => {
    const { children, className, href, style } = props;
    const aStyle = {...style};
    return (
        <NextLink href={href}>
            <a className={className} style={aStyle}>
                {children}
            </a>
        </NextLink>
    );
};