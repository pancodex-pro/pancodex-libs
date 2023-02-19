export const adaptersHooksTemplate: string = `
import {PageData} from '<%= libPaths.bridgeLib %>';
<% classNames.forEach(function(className) {%>
import {<%= upperFirst(className) %>Content} from './<%= upperFirst(className) %>Content';
import {<%= upperFirst(className) %>ContentAdapter} from './<%= upperFirst(className) %>ContentAdapter';
<% }); %>

export type PageContentContext = {
<% classNames.forEach(function(className) {%>
    <%= lowerFirst(className) %>Content?: <%= upperFirst(className) %>Content;
<% }); %>
};

export function usePageContentContext(pageData: PageData): PageContentContext {
    const pageContentContext: PageContentContext = {};
    if (pageData && pageData.content && pageData.profile && pageData.name) {
        switch (pageData.name) {
        <% classNames.forEach(function(className) {%>
            case '<%= upperFirst(className) %>':
                pageContentContext.<%= lowerFirst(className) %>Content = new <%= upperFirst(className) %>ContentAdapter(pageData).adapt(); 
                break;
        <% }); %>       
        }
    }
    return pageContentContext;
}
`;
