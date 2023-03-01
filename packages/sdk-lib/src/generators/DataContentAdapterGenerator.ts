import path from 'path';
import fs from 'fs-extra';
import upperFirst from 'lodash/upperFirst';
import template from 'lodash/template';
import {
    DocumentClass,
    DocumentContentBlockClass,
    DocumentContentAreaName,
    DocumentContentBlockComponentClass,
    AnyFieldType,
    DocumentContentBlockComponentFieldClass, DocumentContentDataFieldClass
} from '@pancodex/domain-lib';
import {formatTS} from './prettierWrapper';
import {dataContentTypeTemplate} from './dataContentTypeTemplate';
import {dataContentAdapterTemplate} from './dataContentAdapterTemplate';

type TemplateComponentObject = {name: string; isArray?: boolean};
type TemplatePropObject = {name: string; type: AnyFieldType};

type TemplateObject = {
    libPaths: Record<LibName, string>;
    upperFirst: any;
    className: string;
    dataFields: Array<string>;
    areasNames: Array<DocumentContentAreaName>;
    areaBlocksNames: Record<string, Array<string>>;
    blockComponents: Record<string, Array<TemplateComponentObject>>;
    componentProps: Record<string, Array<TemplatePropObject>>;
};

type LibName = 'bridgeLib' | 'domainLib';

const defaultLibsPaths: Record<LibName, string> = {
    bridgeLib: '@pancodex/bridge-lib',
    domainLib: '@pancodex/domain-lib'
};
const areasNames: Array<DocumentContentAreaName> = ['linkBlocks', 'cardBlocks', 'bodyBlocks'];

export class DataContentAdapterGenerator {
    private _className: string;
    private _documentClass: DocumentClass;
    private _libsPaths: Record<LibName, string>;
    private _outputDirPath: string;

    constructor(className: string, documentClass: DocumentClass, outputDirPath: string) {
        this._className = className;
        this._documentClass = documentClass;
        this._libsPaths = defaultLibsPaths;
        this._outputDirPath = outputDirPath;
    }

    private createTemplateObject(): TemplateObject {
        const result: TemplateObject = {
            libPaths: this._libsPaths,
            upperFirst,
            className: this._className,
            dataFields: [],
            areasNames,
            areaBlocksNames: {},
            blockComponents: {},
            componentProps: {}
        };
        let dataFieldClassTuples: Array<[string, DocumentContentDataFieldClass]> = Object.entries(this._documentClass.dataFields);
        dataFieldClassTuples = dataFieldClassTuples.sort((a, b) => {
            return a[1].indexNumber - b[1].indexNumber;
        });
        for (const dataFieldClassTuple of dataFieldClassTuples) {
            result.dataFields.push(dataFieldClassTuple[0]);
        }
        for(const areaName of areasNames) {
            const blockClassTuples: Array<[string, DocumentContentBlockClass]> = Object.entries(this._documentClass[areaName]);
            const areaBlocksNames: Array<string> = [];
            for(const blockClassTuple of blockClassTuples) {
                areaBlocksNames.push(blockClassTuple[0]);
                const foundBlock: DocumentContentBlockClass | undefined = this._documentClass[areaName][blockClassTuple[0]];
                if (foundBlock) {
                    const componentClassTuples: Array<[string, DocumentContentBlockComponentClass]> = Object.entries(foundBlock.components);
                    const blockComponents: Array<TemplateComponentObject> = [];
                    for(const componentClassTuple of componentClassTuples) {
                        blockComponents.push({
                            name: componentClassTuple[0],
                            isArray: componentClassTuple[1].isArray
                        });
                        const fieldClassTuples: Array<[string, DocumentContentBlockComponentFieldClass]> = Object.entries(componentClassTuple[1].props);
                        const componentProps: Array<TemplatePropObject> = [];
                        for (const fieldClassTuple of fieldClassTuples) {
                            componentProps.push({
                                name: fieldClassTuple[0],
                                type: fieldClassTuple[1].type
                            });
                        }
                        result.componentProps[componentClassTuple[0]] = componentProps;
                    }
                    result.blockComponents[blockClassTuple[0]] = blockComponents;
                }
            }
            result.areaBlocksNames[areaName] = areaBlocksNames;
        }
        return result;
    }

    private async generateFile(fileName: string, templateText: string): Promise<void> {
        let outputFilePath: string = '';
        try {
            outputFilePath = path.join(this._outputDirPath, fileName);
            const typeFileBody: string = template(templateText)(this.createTemplateObject());
            await fs.ensureFile(outputFilePath);
            await fs.writeFile(outputFilePath, formatTS(typeFileBody));
        } catch (e: any) {
            throw Error(`Error while generating '${outputFilePath}' file. Error: ${e.message}`);
        }
    }

    withLibPath(libName: LibName, libPath: string): DataContentAdapterGenerator {
        this._libsPaths[libName] = libPath;
        return this;
    }

    async generate(): Promise<void> {
        await this.generateFile(`${upperFirst(this._className)}Content.ts`, dataContentTypeTemplate);
        await this.generateFile(`${upperFirst(this._className)}ContentAdapter.ts`, dataContentAdapterTemplate);
    }
}
