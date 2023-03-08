export const dataContentTypeTemplate: string = `
<% function printProps(componentName) { componentProps[componentName].forEach(function(prop) { %><% if (prop.type === 'Image') { %><%= prop.name %>: { src: string; alt: string; width: number; height: number; };<% } else if (prop.type === 'HeaderText') { %><%= prop.name %>: string;<% } else if (prop.type === 'ParagraphText') { %><%= prop.name %>: string;<% } else if (prop.type === 'Link') { %><%= prop.name %>: { href: string; target: string; };<% } else if (prop.type === 'DocumentsList') { %><%= prop.name %>: Array<PageContentContext>;<% } %><% });} %> 
import {PageContentContext} from './types';
type DataFieldType = 'string' | 'number';

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
    <% dataFields.forEach(function(dataFieldName) { %><%= dataFieldName %>?: {value: string; type: DataFieldType;};
    <% }); %>
 }
 
/**
 * Page content type
 */
export type <%= upperFirst(className) %>Content = {
    title: string;
    slug: string;
    tags: Record<string, number>;
    dataFields: <%= upperFirst(className) %>_DataFields;
    <% areasNames.forEach(function(areaName) {%>
    <%= areaName %>: <%= upperFirst(className) %>_<%= upperFirst(areaName) %>;
    <% }); %>
};
`;