export const dataContentAdapterTemplate: string = `
import {ContentAdapter} from '<%= libPaths.bridgeLib %>';
import {<%= upperFirst(className) %>Content} from './types';

export class <%= upperFirst(className) %>ContentAdapter  extends ContentAdapter<<%= upperFirst(className) %>Content> {
    adapt(): <%= upperFirst(className) %>Content {
        const {content} = this._pageData;
        const result: <%= upperFirst(className) %>Content = {
            title: content?.title || 'undefined',
            slug: content?.slug || 'undefined',
            tags: content?.tags || {},
            dataFields: {},
            <% areasNames.forEach(function(areaName) {%><%= areaName %>: [],<% }); %>
        };

        if (content?.dataFields && content.dataFields.length > 0) {
            result.dataFields = this.processDataFields(content.dataFields);
        }
        <% areasNames.forEach(function(areaName) {%>
            if (content?.<%= areaName %> && content.<%= areaName %>.length > 0) {
                result.<%= areaName %> = this.processBlocks(content.<%= areaName %>, {
                    <% areaBlocksNames[areaName].forEach(function(blockName) { %>
                        '<%= blockName %>': {                   
                        <% blockComponents[blockName].forEach(function(component) { %>
                            <%= component.name %>: [<% componentProps[component.name].forEach(function(prop) { %>'<%= prop.name %>',<% }); %>],
                        <% }); %>
                        },
                    <% }); %>
                });
            }
        <% }); %>

        return result;
    }
}
`;
