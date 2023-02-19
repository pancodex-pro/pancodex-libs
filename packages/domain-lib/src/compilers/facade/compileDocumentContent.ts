import {DocumentContent_Bean, DocumentContentBlock} from '../../types/document';
import {
    iterateDocumentContentAreaBlocks,
    iterateDocumentContentAreaBlockComponents,
    iterateDocumentContentAreaBlockComponentInstances,
    iterateDocumentContentAreaBlockComponentFields
} from '../../utilities';
import {compileDocumentContentValue} from './compileDocumentContentValue';
import {AnyFieldType} from '../../types';
import {DocumentContentCompilerName} from '../Compiler';

const compilersByFieldType: Record<AnyFieldType, Array<DocumentContentCompilerName>> = {
    DocumentsListing: [],
    HeaderText: ['HeaderTextCompiler'],
    Image: ['ImageCompiler'],
    Link: [],
    ParagraphText: ['ParagraphTextCompiler'],
    StringValue: []
};

function compileDocumentContentBlocks(documentContent: DocumentContent_Bean, blocks: Array<DocumentContentBlock>, pathPrefix: string): DocumentContent_Bean {
    iterateDocumentContentAreaBlocks(blocks, pathPrefix, (block, blockPathPrefix) => {
        const {components} = block;
        iterateDocumentContentAreaBlockComponents(components, blockPathPrefix, (component, componentPathPrefix) => {
            const {instances} = component;
            iterateDocumentContentAreaBlockComponentInstances(instances, componentPathPrefix, (instance, instancePathPrefix) => {
                const {props} = instance;
                iterateDocumentContentAreaBlockComponentFields(props, instancePathPrefix, (field, fieldPathPrefix) => {
                    documentContent = compileDocumentContentValue(
                        documentContent,
                        `${fieldPathPrefix}.${field.name}`,
                        compilersByFieldType[field.type]
                    );
                });
            });
        });
    });
    return documentContent;
}

export function compileDocumentContent(documentContent: DocumentContent_Bean): DocumentContent_Bean {
    documentContent = compileDocumentContentValue(documentContent, 'titles', ['TitlesCompiler']);
    const {metaBlocks, bodyBlocks} = documentContent;
    if (metaBlocks && metaBlocks.length > 0) {
        documentContent = compileDocumentContentBlocks(documentContent, metaBlocks, 'metaBlocks');
    }
    if (bodyBlocks && bodyBlocks.length > 0) {
        documentContent = compileDocumentContentBlocks(documentContent, bodyBlocks, 'bodyBlocks');
    }
    return documentContent;
}
