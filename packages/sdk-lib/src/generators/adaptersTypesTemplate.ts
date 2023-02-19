export const adaptersTypesTemplate: string = `
<% classNames.forEach(function(className) {%>
export type {<%= upperFirst(className) %>Content} from './<%= upperFirst(className) %>Content';
<% }); %>
`;
