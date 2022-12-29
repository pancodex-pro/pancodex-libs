import {DocumentContent_Bean} from '../../types/document';
import {compileDocumentContentValue} from './compileDocumentContentValue';
import {Hero_Section} from '../../types/content/Hero_Section';
import {Body_Section} from '../../types/content/Body_Section';

export function compileDocumentContent(documentContent: DocumentContent_Bean): DocumentContent_Bean {
    documentContent = compileDocumentContentValue(documentContent, 'titles', ['TitlesCompiler']);
    const {hero, body} = documentContent.contentData;
    if (hero && hero.length > 0) {
        hero.forEach((sectionItem: Hero_Section, index: number) => {
            switch (sectionItem.sectionType) {
                case 'SECTION_HEADER':
                    documentContent = compileDocumentContentValue(documentContent, `hero.${index}`, ['HeaderTextCompiler']);
                    break;
                case 'SECTION_PARAGRAPH':
                    documentContent = compileDocumentContentValue(documentContent, `hero.${index}`, ['ParagraphTextCompiler']);
                    break;
                case 'SECTION_IMAGE':
                    documentContent = compileDocumentContentValue(documentContent, `hero.${index}`, ['ImageCompiler']);
                    break;
                default:
                    break;
            }
        });
    }
    if (body && body.length > 0) {
        body.forEach((sectionItem: Body_Section, index: number) => {
            switch (sectionItem.sectionType) {
                case 'SECTION_HEADER':
                    documentContent = compileDocumentContentValue(documentContent, `body.${index}`, ['HeaderTextCompiler']);
                    break;
                case 'SECTION_PARAGRAPH':
                    documentContent = compileDocumentContentValue(documentContent, `body.${index}`, ['ParagraphTextCompiler']);
                    break;
                case 'SECTION_IMAGE':
                    documentContent = compileDocumentContentValue(documentContent, `body.${index}`, ['ImageCompiler']);
                    break;
                default:
                    break;

            }
        });
    }
    return documentContent;
}
