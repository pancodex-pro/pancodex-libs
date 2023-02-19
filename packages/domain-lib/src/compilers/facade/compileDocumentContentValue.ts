import {DocumentContent_Bean} from '../../types/document';
import {compilersMap, DocumentContentCompilerName, Compiler} from '../Compiler';

export function compileDocumentContentValue(
    documentContent: DocumentContent_Bean,
    propertyPath: string,
    compilers: Array<DocumentContentCompilerName>
): DocumentContent_Bean {
    if (compilers && compilers.length > 0) {
        let newDocumentContent: DocumentContent_Bean = documentContent;
        let foundCompiler: Compiler | undefined;
        compilers.forEach((compilerName: DocumentContentCompilerName) => {
            foundCompiler = compilersMap.get(compilerName);
            if (foundCompiler) {
                newDocumentContent = foundCompiler.compile(newDocumentContent, propertyPath);
            }
        });
        return newDocumentContent;
    }
    return documentContent;
}
