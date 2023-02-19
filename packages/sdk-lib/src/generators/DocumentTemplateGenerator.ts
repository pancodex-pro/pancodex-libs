import {
    DocumentClass,
    DocumentTemplate,
    DocumentContentBlockClass,
    DocumentContentBlockComponentClass,
    DocumentContentBlockComponent,
    DocumentContentBlockComponentInstance,
    DocumentContentBlockComponentFieldClass,
    DocumentContentBlockComponentField,
    DocumentContentAreaName
} from '@pancodex/domain-lib';
import {generateJsonFile} from './utilities';

const areasNames: Array<DocumentContentAreaName> = ['metaBlocks', 'bodyBlocks'];

export class DocumentTemplateGenerator {
    private _documentClass: DocumentClass<string, string>;
    private _documentTemplate: DocumentTemplate;
    private _outputFileName: string;

    constructor(className: string, documentClass: DocumentClass<string, string>, outputFileName: string) {
        this._outputFileName = outputFileName;
        this._documentClass = documentClass;
        this._documentTemplate = {
            description: documentClass.description,
            documentSample: {
                documentClass: className,
                type: documentClass.type,
                contents: {}
            }
        };
    }

    private _checkContentBase(): void {
        if (!this._documentTemplate.documentSample.contents['defaultLocale']) {
            throw Error('Before adding blocks to the template run "initContentBase" method in generator.');
        }
    }

    private _createComponentInstances(componentClass: DocumentContentBlockComponentClass<string, string>): Array<DocumentContentBlockComponentInstance> {
        const componentInstances: Array<DocumentContentBlockComponentInstance> = [];
        let fieldClassTuples: Array<[string, DocumentContentBlockComponentFieldClass<string, string>]> = Object.entries(componentClass.props);
        fieldClassTuples = fieldClassTuples.sort((a, b) => {
            return a[1].indexNumber - b[1].indexNumber;
        });
        const instanceProps: Array<DocumentContentBlockComponentField> = [];
        for (const fieldClassTuple of fieldClassTuples) {
            instanceProps.push({
                name: fieldClassTuple[0],
                type: fieldClassTuple[1].type,
                fieldContent: fieldClassTuple[1].fieldContent
            });
        }
        componentInstances.push({
            props: instanceProps
        });
        return componentInstances;
    }

    private _createComponents(blockClass: DocumentContentBlockClass<string, string>): Array<DocumentContentBlockComponent> {
        const blockComponents: Array<DocumentContentBlockComponent> = [];
        let componentClassTuples: Array<[string, DocumentContentBlockComponentClass<string, string>]> = Object.entries(blockClass.components);
        componentClassTuples = componentClassTuples.sort((a, b) => {
            return a[1].indexNumber - b[1].indexNumber;
        });
        for (const componentClassTuple of componentClassTuples) {
            blockComponents.push({
                name: componentClassTuple[0],
                isArray: componentClassTuple[1].isArray,
                instances: this._createComponentInstances(componentClassTuple[1])
            });
        }
        return blockComponents;
    }

    private _addBlock(documentContentArea: DocumentContentAreaName, blockName: string) {
        this._checkContentBase();
        const foundBlock: DocumentContentBlockClass<string, string> | undefined = this._documentClass[documentContentArea][blockName];
        if (foundBlock) {
            this._documentTemplate.documentSample.contents['defaultLocale'][documentContentArea].push({
                name: blockName,
                components: this._createComponents(foundBlock)
            });
        }
    }

    private _initContentBase(): DocumentTemplateGenerator {
        this._documentTemplate.documentSample.contents['defaultLocale'] = {
            title: this._documentClass.defaultTitle,
            profileId: '__defaultProfile',
            slug: this._documentClass.defaultSlug,
            statusMap: {},
            isCustomSlug: true,
            tags: {},
            metaBlocks: [],
            bodyBlocks: []
        };
        return this;
    }

    async generate(): Promise<void> {
        this._initContentBase();
        for (const areaName of areasNames) {
            const blockClassTuples: Array<[string, DocumentContentBlockClass<string, string>]> = Object.entries(this._documentClass[areaName]);
            for (const blockClassTuple of blockClassTuples) {
                if (blockClassTuple[1].isDefault) {
                    this._addBlock(areaName, blockClassTuple[0]);
                }
            }
        }
        await generateJsonFile(this._documentTemplate, this._outputFileName);
    }

}
