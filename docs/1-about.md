# Introduction

This project is a work in progress with the following goals:

- Provide a browser-based app editor
- Provide a superset of HTML as a medium for a RESTful exchange to power the browser-based editor
- Enable component-oriented app design

## A superset of HTML

`yah` is a collection of `YAML` frontmatter and `HTML` elements and attributes that declaratively describe your web app: data fetching, layout, styling, etc.

## RESTful exchange

In [hypermedia systems](https://hypermedia.systems), a major inspiration for this project, the origin stories of REST, HTTP and HTML are well explained: HTML is the engine of application state, expressed as representational state transfer (REST), using the HTTP protocol. The book also contrasts this definition of REST with JSON APIs which, typically, necessitate larger complexity on the client than simply sending HTML to a browser that understands HTML.

The backend idea is to be able to create html templates and components by posting html. The posted html is annotated with attributes that aid parsing into templates and components. There will also be fetching endpoints for those templates and components.

A template can be serialized back into the original html page. A template can reference and be composed of components. A template will also have a data layer for embedding content into a template.

Components are html snippets (with styling, perhaps eventually some clientside scripting) and can themselves be composed of other components. A component in a template is a component instance with set attribute values.

Posting a html document to the backend will save the template and it's component instances.

Posting html to the `component/save` endpoint will save the component. There should also be a referencing store so that if a component interface changes then the affected pages and components are also updated. It might be worth seeing how React Bricks solves this problem.

# Acknowledgements

- https://hypermedia.systems
- https://www.solidjs.com/
- https://astro.build
- https://pugjs.org
- https://binaryigor.com/htmx-and-web-components-a-perfect-match.html
