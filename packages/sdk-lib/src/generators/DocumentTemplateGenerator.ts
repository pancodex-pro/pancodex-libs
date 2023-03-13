import {
    DocumentClass,
    DocumentTemplate,
    DocumentContentBlockClass,
    DocumentContentBlockComponentClass,
    DocumentContentBlockComponent,
    DocumentContentBlockComponentInstance,
    DocumentContentBlockComponentFieldClass,
    DocumentContentBlockComponentField,
    DocumentContentDataFieldClass,
    DocumentContentAreaClass,
    DocumentContentBlock
} from '@pancodex/domain-lib';
import {generateJsonFile} from './utilities';

export class DocumentTemplateGenerator {
    private _documentClass: DocumentClass;
    private _documentTemplate: DocumentTemplate;
    private _outputFileName: string;

    constructor(className: string, documentClass: DocumentClass, outputFileName: string) {
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

    private _addDataFields(): void {
        let dataFieldClassTuples: Array<[string, DocumentContentDataFieldClass]> = Object.entries(this._documentClass.dataFields);
        dataFieldClassTuples = dataFieldClassTuples.sort((a, b) => {
            return a[1].indexNumber - b[1].indexNumber;
        });
        for (const dataFieldClassTuple of dataFieldClassTuples) {
            this._documentTemplate.documentSample.contents['defaultLocale'].dataFields.push({
                name: dataFieldClassTuple[0],
                value: dataFieldClassTuple[1].defaultValue || '',
                type: dataFieldClassTuple[1].dataType,
                dataSetField: dataFieldClassTuple[1].dataSetField
            });
        }
    }

    private _createComponentInstances(componentClass: DocumentContentBlockComponentClass): Array<DocumentContentBlockComponentInstance> {
        const componentInstances: Array<DocumentContentBlockComponentInstance> = [];
        let fieldClassTuples: Array<[string, DocumentContentBlockComponentFieldClass]> = Object.entries(componentClass.props);
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

    private _createComponents(blockClass: DocumentContentBlockClass): Array<DocumentContentBlockComponent> {
        const blockComponents: Array<DocumentContentBlockComponent> = [];
        let componentClassTuples: Array<[string, DocumentContentBlockComponentClass]> = Object.entries(blockClass.components);
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

    private _addDocumentArea(documentAreaName: string, documentArea: DocumentContentAreaClass) {
        this._checkContentBase();
        const blockClassTuples: Array<[string, DocumentContentBlockClass]> = Object.entries(documentArea.blocks);
        const blocks: Array<DocumentContentBlock> = [];
        for (const blockClassTuple of blockClassTuples) {
            if (blockClassTuple[1].isDefault) {
                blocks.push({
                    name: blockClassTuple[0],
                    components: this._createComponents(blockClassTuple[1])
                });
            }
        }
        this._documentTemplate.documentSample.contents['defaultLocale'].documentAreas.push({
            name: documentAreaName,
            blocks
        });
    }

    private _initContentBase(): DocumentTemplateGenerator {
        this._documentTemplate.documentSample.contents['defaultLocale'] = {
            title: this._documentClass.defaultTitle,
            profileId: '__defaultProfile',
            slug: this._documentClass.defaultSlug,
            statusMap: {},
            isCustomSlug: true,
            tags: {},
            dataFields: [],
            documentAreas: [],
        };
        return this;
    }

    async generate(): Promise<void> {
        this._initContentBase();
        this._addDataFields();
        let documentAreaClassTuples: Array<[string, DocumentContentAreaClass]> = Object.entries(this._documentClass.documentAreas);
        documentAreaClassTuples = documentAreaClassTuples.sort((a, b) => {
            return a[1].indexNumber - b[1].indexNumber;
        });
        for (const documentAreaClassTuple of documentAreaClassTuples) {
            this._addDocumentArea(documentAreaClassTuple[0], documentAreaClassTuple[1]);
        }
        await generateJsonFile(this._documentTemplate, this._outputFileName);
    }

}
