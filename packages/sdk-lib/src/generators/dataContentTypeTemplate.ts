export const dataContentTypeTemplate: string = `
import {StringValue, ParagraphText, HeaderText, Link, Image, DataFieldValue} from '<%= libPaths.bridgeLib %>';

<% function printProps(componentName) {%><% componentProps[componentName].forEach(function(prop) { %>
<%= prop.name %>: <%= prop.type %>;<% }); %>
<% } %> 

/**
 * Types of the blocks
 */
<% areasNames.forEach(function(areaName) {%>
    <% areaBlocksNames[areaName].forEach(function(blockName) { %>
        export type <%= upperFirst(className) %>_<%= upperFirst(blockName) %> = {
            <% blockComponents[blockName].forEach(function(component) { %><% if (component.isArray) { %><%= component.name %>: Array<{<% printProps(component.name) %>}>;<% } else { %><%= component.name %>: {<% printProps(component.name) %>};<% } %><% }); %>
        };
    <% }); %>
<% }); %>

/**
 * Types of the page areas
 */
<% areasNames.forEach(function(areaName) {%>
export type <%= upperFirst(className) %>_<%= upperFirst(areaName) %> = Array<{
    <% areaBlocksNames[areaName].forEach(function(blockName) { %><%= blockName %>?: <%= upperFirst(className) %>_<%= upperFirst(blockName) %>;<% }); %>
}>;
<% }); %>

/**
 * Type of data fields
 */
 export type <%= upperFirst(className) %>_DataFields = {
    <% dataFields.forEach(function(dataFieldName) { %><%= dataFieldName %>?: DataFieldValue;
    <% }); %>
 }
 
/**
 * Page content type
 */
export type <%= upperFirst(className) %>Content = {
    title: string;
    tags: Record<string, number>;
    dataFields: <%= upperFirst(className) %>_DataFields;
    <% areasNames.forEach(function(areaName) {%>
    <%= areaName %>: <%= upperFirst(className) %>_<%= upperFirst(areaName) %>;
    <% }); %>
};
`;