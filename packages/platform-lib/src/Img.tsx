import React from 'react';
import Image from 'next/image';
import { ImgProps } from './types';
// import { ExternalSvg } from './ExternalSvg';

export const Img: React.FC<ImgProps> = (props: ImgProps) => {
    const { className, url, alt, svg, svgProps, style } = props;
    if (svg) {
        let applyStyles = null;
        let applyProps = null;
        if (style) {
            applyStyles = {
                'svg>': style,
            };
        }
        if (svgProps) {
            applyStyles = {
                'svg>': svgProps,
            };
        }
        return (
            <div className={className}>
                {/*<ExternalSvg*/}
                {/*    svg={svg}*/}
                {/*    applyStyles={applyStyles}*/}
                {/*    applyProps={applyProps}*/}
                {/*    onError={(errorText) => {console.error(errorText); } }*/}
                {/*/>*/}
            </div>
        );
    }
    return (<Image className={className} alt={alt} src={url || ''} />);
};
