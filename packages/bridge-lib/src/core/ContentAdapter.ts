import {
    DocumentContentBlockComponentField,
    DocumentContentBlockComponent,
    DocumentContentBlock
} from '@pancodex/domain-lib';
import {PageData, AnyField} from './types';

type BlocksSpecification = Record<string, ComponentsSpecification>;
type ComponentsSpecification = Record<string, PropsSpecification>;
type PropsSpecification = Array<string>;

export abstract class ContentAdapter<T> {
    protected readonly _pageData: PageData;

    public constructor(pageData: PageData) {
        this._pageData = pageData;
    }

    protected processProps(props: Array<DocumentContentBlockComponentField>, propsSpec: PropsSpecification): Record<string, AnyField> {
        const result: Record<string, AnyField> = {};
        for (const propsItem of props) {
            if (propsSpec.includes(propsItem.name)) {
                result[propsItem.name] = propsItem.fieldContent;
            }
        }
        return result;
    }

    protected processComponents(
        components: Array<DocumentContentBlockComponent>,
        componentsSpec: ComponentsSpecification
    ): Record<string, any> {
        const result: Record<string, any> = {};
        for (const componentsItem of components) {
            const foundPropsSpec = componentsSpec[componentsItem.name];
            if (foundPropsSpec) {
                if (componentsItem.instances && componentsItem.instances.length > 0) {
                    if (componentsItem.isArray) {
                        result[componentsItem.name] = [];
                        for (const instance of componentsItem.instances) {
                            const componentContent: any = this.processProps(instance.props, foundPropsSpec);
                            result[componentsItem.name].push(componentContent);
                        }
                    } else {
                        result[componentsItem.name] = this.processProps(componentsItem.instances[0].props, foundPropsSpec);
                    }
                } else {
                    result[componentsItem.name] = {};
                }
            }
        }
        return result;
    }

    protected processBlocks(blocks: Array<DocumentContentBlock>, blocksSpec: BlocksSpecification): Array<Record<string, any>> {
        const result: Array<Record<string, any>> = [];
        for (const blocksItem of blocks) {
            const foundComponentsSpec = blocksSpec[blocksItem.name];
            if (foundComponentsSpec && blocksItem.components && blocksItem.components.length > 0) {
                result.push({
                    [blocksItem.name]: this.processComponents(blocksItem.components, foundComponentsSpec),
                });
            }
        }
        return result;
    }

    abstract adapt(): T;
}
