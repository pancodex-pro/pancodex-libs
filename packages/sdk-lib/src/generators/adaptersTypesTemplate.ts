export const adaptersTypesTemplate: string = `
<% classNames.forEach(function(className) {%>export * from './<%= upperFirst(className) %>Content';
<% }); %>
`;
