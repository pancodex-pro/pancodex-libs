export const dataContentAdapterTemplate: string = `
import {ContentAdapter} from '<%= libPaths.bridgeLib %>';
import {<%= upperFirst(className) %>Content} from './<%= upperFirst(className) %>Content';

export class <%= upperFirst(className) %>ContentAdapter  extends ContentAdapter<<%= upperFirst(className) %>Content> {
    adapt(): <%= upperFirst(className) %>Content {
        const {content} = this._pageData;
        const result: <%= upperFirst(className) %>Content = {
            title: content?.title || 'undefined',
            tags: content?.tags || {},
            <% areasNames.forEach(function(areaName) {%><%= areaName %>: [],<% }); %>
        };

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
