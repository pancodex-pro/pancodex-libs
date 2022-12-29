import {
    DocumentRecord_Bean,
    LocaleType,
    DocumentContent_Base,
    DocumentRecord_TreeItem,
    DocumentType,
    SiteMap_Index
} from '../types';
import {traverseDocumentContents, traverseDocumentContentsByLocale} from './documentUtils';

export type Dictionary<T> = { [id: string]: T };

export function findDocument(root: DocumentRecord_Bean, documentId: string): DocumentRecord_Bean | undefined {
    if (root.id === documentId) {
        return root;
    } else {
        let foundDocument: DocumentRecord_Bean | undefined;
        if (root.children && root.children.length > 0) {
            let childDocument: DocumentRecord_Bean;
            for (childDocument of root.children) {
                foundDocument = findDocument(childDocument, documentId);
                if (foundDocument) {
                    break;
                }
            }
        }
        return foundDocument;
    }
}

// export function findDocumentLevel(root: DocumentRecord_Bean, documentId: string, level: number = 0): number | undefined {
//     let foundLevel: number | undefined = undefined;
//     if (root.id === documentId) {
//         foundLevel = level;
//     } else {
//         if (root.children && root.children.length > 0) {
//             let childDocument: DocumentRecord_Bean;
//             for(childDocument of root.children) {
//                 foundLevel = findDocumentLevel(childDocument, documentId, level + 1);
//                 if (foundLevel) {
//                     break;
//                 }
//             }
//         }
//     }
//     return foundLevel;
// }

export function makeSiteIndex(root: DocumentRecord_Bean, accumulator: SiteMap_Index = {}, defaultLocale: string, locale?: string, rootNodePath?: Array<DocumentRecord_Bean>): SiteMap_Index {
    let accumulatorLocal: SiteMap_Index = {...accumulator};
    const validLocale: string = locale || defaultLocale;
    let slugPath: string = '';
    const localNodePath: Array<DocumentRecord_Bean> = rootNodePath ? [...rootNodePath, root] : [root];
    if (localNodePath.length > 0) {
        localNodePath.forEach((nodeItem: DocumentRecord_Bean) => {
            slugPath = slugPath ? `${slugPath}/${nodeItem.contents[validLocale]?.slug || ''}` : nodeItem.contents[validLocale]?.slug || '';
        });
    }
    accumulatorLocal[root.id] = {
        node: root,
        nodePathItems: localNodePath,
        nodePathIndex: localNodePath.reduce<Record<string, boolean>>((acc: Record<string, boolean>, nodeItem: DocumentRecord_Bean) => {
            return {...acc, [nodeItem.id]: true};
        }, {}),
        nodePath: slugPath.replace('@site', ''),
        content: root.contents[validLocale]
    };
    if (root.children && root.children.length > 0) {
        let childDocument: DocumentRecord_Bean;
        for (childDocument of root.children) {
            accumulatorLocal = makeSiteIndex(
                childDocument,
                accumulatorLocal,
                defaultLocale,
                locale,
                [...localNodePath]
            );
        }
    }
    return accumulatorLocal;
}

export function deleteDocuments(root: DocumentRecord_Bean, documentMap: Dictionary<any>): void {
    if (root.children && root.children.length > 0) {
        let childDocument: DocumentRecord_Bean;
        const newChildren: Array<DocumentRecord_Bean> = [];
        for (childDocument of root.children) {
            if (!documentMap[childDocument.id]) {
                newChildren.push(childDocument);
            }
            deleteDocuments(childDocument, documentMap);
        }
        root.children = newChildren;
    }
}

export function getAllNested(root: DocumentRecord_Bean): Array<DocumentRecord_Bean> {
    let localResultList: Array<DocumentRecord_Bean> = [
        root
    ];
    if (root.children && root.children.length > 0) {
        let childDocument: DocumentRecord_Bean;
        for (childDocument of root.children) {
            localResultList = localResultList.concat(getAllNested(childDocument));
        }
    }
    return localResultList;
}

export function getAllNestedTreeItems(root: DocumentRecord_Bean, excludeTypes: Array<DocumentType> = [], level: number = 0): Array<DocumentRecord_TreeItem> {
    let localResultList: Array<DocumentRecord_TreeItem> = excludeTypes.includes(root.type)
        ? []
        : [
            {...root, level}
        ];
    if (root.children && root.children.length > 0) {
        let childDocument: DocumentRecord_Bean;
        for (childDocument of root.children) {
            localResultList = localResultList.concat(getAllNestedTreeItems(childDocument, excludeTypes, level + 1));
        }
    }
    return localResultList;
}

export function countProfileUsage(root: DocumentRecord_Bean, profileId: string): number {
    let result = 0;
    let existsInContents: boolean = false;
    traverseDocumentContents(root, (contentBase?: DocumentContent_Base) => {
        if (contentBase?.profileId === profileId) {
            existsInContents = true;
        }
    });
    if (existsInContents) {
        result += 1;
    }
    if (root.children && root.children.length > 0) {
        let childDocument: DocumentRecord_Bean;
        for (childDocument of root.children) {
            result += countProfileUsage(childDocument, profileId);
        }
    }
    return result;
}

export function makeTagsIndex(root: DocumentRecord_Bean, locale: LocaleType, accumulator: Record<string, number> = {}): void {
    traverseDocumentContentsByLocale(root, locale, (contentBase?: DocumentContent_Base) => {
        if (contentBase?.tags) {
            Object.keys(contentBase.tags).forEach((tagKey: string) => {
                accumulator[tagKey] = accumulator[tagKey] >= 1
                    ? accumulator[tagKey] + 1
                    : 1;
            });
        }
    });
    if (root.children && root.children.length > 0) {
        let childDocument: DocumentRecord_Bean;
        for (childDocument of root.children) {
            makeTagsIndex(childDocument, locale, accumulator);
        }
    }
}
