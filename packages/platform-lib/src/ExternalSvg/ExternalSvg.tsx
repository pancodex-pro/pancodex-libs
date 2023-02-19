import React, { useEffect, useState, useRef, CSSProperties, SVGProps } from 'react';
// import Controller from './controller';
//
// export type ExternalSvgApplyStyles = {
//     [queryId: string]: CSSProperties;
// };
//
// export type ExternalSvgApplyProps = {
//     [queryId: string]: SVGProps<string | number>;
// };
//
// export type ExternalSvgProps = {
//     applyStyles?: ExternalSvgApplyStyles;
//     applyProps?: ExternalSvgApplyProps;
//     svg: string;
//     onError: (errorText: string) => void;
// };
//
// const controller = new Controller();
//
// export function ExternalSvg(props: ExternalSvgProps) {
//
//     const { applyStyles, applyProps, svg, onError } = props;
//
//     const [render, setRender] = useState(null);
//
//     //Object equality check prev & current props
//     const prevApplyProps = useRef(applyProps);
//     const prevApplyStyles = useRef(applyStyles);
//     const shouldRedraw = JSON.stringify(prevApplyProps.current) !== JSON.stringify(applyProps) || JSON.stringify(prevApplyStyles.current) !== JSON.stringify(applyStyles);
//
//     useEffect(() => {
//         prevApplyProps.current = applyProps;
//         prevApplyStyles.current = applyStyles;
//     }, [applyProps, applyStyles])
//
//     //Create render
//     useEffect(() => {
//         if (svg && svg.length && svg.includes('<svg') || shouldRedraw) {
//             try {
//                 const converted = controller.convert(svg, { applyProps, applyStyles });
//                 setRender(converted)
//             }
//             catch (err) {
//                 if (onError) {
//                     onError(err)
//                 }
//                 else {
//                     console.error(err)
//                 }
//             }
//         }
//     }, [svg, applyProps, applyStyles, onError, shouldRedraw]);
//
//     return (<>{render}</>)
// }
