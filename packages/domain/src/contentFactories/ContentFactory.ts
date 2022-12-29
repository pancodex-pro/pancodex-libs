import {DocumentContent_Bean} from '../types';

export abstract class ContentFactory {
    public abstract createContentValue(documentContent: DocumentContent_Bean, propertyPath: string): DocumentContent_Bean;
}
