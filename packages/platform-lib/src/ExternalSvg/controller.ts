import utils from './utils';
// import React from 'react';
// import { nanoid as uuid } from 'nanoid';
// import {parse, ElementNode, Node} from 'svg-parser';
//
// type Options = {
//     applyStyles?: any;
//     applyProps?: any;
// };
//
// class Controller {
//
//     uuid: string;
//     defaults: Options;
//
//     constructor() {
//         this.uuid = uuid();
//         this.defaults = {
//             applyStyles: '',
//             applyProps: ''
//         }
//     }
//
//
//     private _parseSVG(svg: string): ElementNode {
//         const parsedSVG = parse(svg);
//         if ((parsedSVG.children[0] as ElementNode).tagName !== 'svg') throw 'Passed svg string does not include an <svg> tag as the parent wrapper';
//         return parsedSVG.children[0] as ElementNode;
//     }
//
//     private _conformSVG(parsedSVG: ElementNode) {
//         const conformedSVG = { ...parsedSVG }
//         conformedSVG.properties = utils.sanitizeAttributes(conformedSVG.properties);
//         utils.noUnSupportedTagNames(conformedSVG.children)
//
//         conformedSVG.children = Array.isArray(conformedSVG.children)
//             ? conformedSVG.children.map((child) => this._conformSVG(child as ElementNode))
//             : conformedSVG.children;
//
//         return conformedSVG;
//     }
//
//     private _convertToReactElem(elem: ElementNode, options: any, relativePath = [], childID = 0): JSX.Element {
//
//         const thisPath = [...relativePath, [elem.tagName, 'child' + childID]];
//         const applyOptions = this._applyOptions
//
//         const convertChildren = () => {
//             if (Array.isArray(elem.children)) {
//                 return elem.children.map(function (child, i) {
//                     return this._convertToReactElem(child, options, thisPath, i)
//                 }.bind((this as Controller)))
//             }
//             return null;
//         }
//
//         return React.createElement(elem.tagName, {
//             //create a unique key, class enables this be the same with each react redraw, thus prevents complete redraw of elements
//             key: this.uuid + '_' + childID,
//             ...elem.properties,
//             ...applyOptions(elem.properties.id, thisPath, options.applyProps),
//             style: elem.properties.style
//                 ? { ...elem.properties.style, ...applyOptions(elem.properties.id, thisPath, options.applyStyles) }
//                 : applyOptions(elem.properties.id, thisPath, options.applyStyles),
//             },
//             //Recursive map for all nested children
//             convertChildren()
//         );
//     }
//
//     private _applyOptions(id: any, pathIdentifier: Array<any>, options: any) {
//         let returnObj = {};
//
//         for (let key in options) {
//             let applyProp = true;
//             if (key.includes('>')) {
//                 const pathToElem = key.split('>').filter((s) => s !== '');
//                 if (pathToElem.length === pathIdentifier.length) {
//                     for (let i = 0; i < pathToElem.length; i++) {
//                         let pathID = pathToElem[i];
//                         if (!pathIdentifier[i].includes(pathID)) {
//                             applyProp = false;
//                             break;
//                         }
//                     }
//                 }
//                 else {
//                     applyProp = false;
//                 }
//
//
//             }
//             else if (id !== key) {
//                 applyProp = false;
//             }
//
//             if (applyProp) returnObj = { ...returnObj, ...options[key] };
//         }
//         return returnObj;
//     }
//
//     private _createReactElements(parsedSVG: ElementNode, options: any) {
//         return this._convertToReactElem(parsedSVG, options);
//     }
//
//     convert(svg: string, opts: Options = {}) {
//
//         const options = { applyProps: opts.applyProps || {}, applyStyles: opts.applyStyles || {} };
//         const parsedSVG = this._parseSVG(svg);
//         const conformedSVG = this._conformSVG(parsedSVG);
//         return this._createReactElements(conformedSVG, options);
//     }
//
// }
//
// export default Controller;
