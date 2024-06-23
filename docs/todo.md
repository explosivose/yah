# todo

- doc: skeletons
  - using tags and attributes
  - declare skeletons to send immediately
  - on clientside each skeleton makes a request for the final html (with htmx)
  - based on the skeleton declarations, api endpoints are automatically generated to serve the final content to the skeletons
  - when the skeleton is sent the async data fetching (or whatever) is also dispatched, so by the time the skeleton makes it's request the html may already be ready to send
- doc: component REST apis (including skeletons)
- doc: JSON data source

  - apps
    - `yah-serve` - server app
  - libs
    - `@yah/parse` - core yah declaration processor
    - `@yah/render` - yah-to-HTML
    - `@yah/apis` - http endpoints for pages and components
    - `@yah/components` - builtin HTML-based components
    - `@yah/component-store` - crud component declarations
    - `@yah/db` - provides db connection
    - `@yah/datasource` - core data source service
      - `@yah/datasource-gql` - graphql datasource plugin
      - `@yah/datasource-json` - json datasource plugin
      - `@yah/datasource-notion`
      - `@yah/datasource-sanity`
      - `@yah/datasource-strapi`
  - bidirectional (render components)
    - rendered html pages can be reverted back to a yah-page
    - previewed components can also be reverted back
      - what is a previewed component?
        - a preview of your component like in figma
        - a smart frontend will allow you to edit the component preview, data connections and attributes so that it can be reserialized and saved.
        - all variants are shown in a table
        - data connections are mocked
        - "open" props are given text fields
        -

- Tab components:

  - typically a stateful component - where to store state?
  - can implement using [htmx and HATEOAS](https://htmx.org/examples/tabs-hateoas/)
    - as soon as we go to HATEOAS we need a server.
  - can do in [angular almost entirely declaratively](https://help.opendatasoft.com/tutorials/en/dashboard_modules/how_to_create_tabs.html)
  - can do with signals and `<Switch><Match>` in [solidjs](https://www.solidjs.com/examples/suspensetabs)
  - (?) the component definition should be declarative and represent all states
  - q: how to represent conditional attribute assignment in component def
  - q: component props are different to component state - where and when is state resolved? where is the state model declared?
