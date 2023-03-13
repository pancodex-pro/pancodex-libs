export const dataContentAdapterTemplate: string = `
import {ContentAdapter} from '<%= libPaths.bridgeLib %>';
import {<%= upperFirst(className) %>Content, <%= upperFirst(className) %>_DocumentAreas} from './types';

export class <%= upperFirst(className) %>ContentAdapter  extends ContentAdapter<<%= upperFirst(className) %>Content> {
    adapt(): <%= upperFirst(className) %>Content {
        const {content} = this._pageData;
        const result: <%= upperFirst(className) %>Content = {
            title: content?.title || 'undefined',
            slug: content?.slug || 'undefined',
            tags: content?.tags || {},
            dataFields: {},
            documentAreas: {
                <% areasNames.forEach(function(areaName) {%><%= areaName %>: [],<% }); %>
            }
        };

        if (content?.dataFields && content.dataFields.length > 0) {
            result.dataFields = this.processDataFields(content.dataFields);
        }
        if (content?.documentAreas && content.documentAreas.length > 0) {
            result.documentAreas = this.processDocumentAreas(content.documentAreas, {
                <% areasNames.forEach(function(areaName) {%>
                '<%= areaName %>': {
                    <% areaBlocksNames[areaName].forEach(function(blockName) { %>
                            '<%= blockName %>': {                   
                            <% blockComponents[blockName].forEach(function(component) { %>
                                <%= component.name %>: [<% componentProps[component.name].forEach(function(prop) { %>'<%= prop.name %>',<% }); %>],
                            <% }); %>
                            },
                        <% }); %>
                    },
                <% }); %>
            }) as <%= upperFirst(className) %>_DocumentAreas;
        }

        return result;
    }
}
`;
