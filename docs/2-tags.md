# Declaration formats

This doc describes the `yah` declarative syntax for building web and mobile apps. These are largely illustrative examples. These interfaces are designed to be simple, robust, developer-friendly and also web editor friendly.

These declarations are processed by a server-side HTML processor that understands `yah` elements.

The HTML spec allows for so-called "foreign elements". The `yah` elements define pages, components and data connections. These elements are resolved server-side to produce HTML for the browser.

Why `yah`? It's short for '`YAML` and `HTML`.

Note: while reading, you'll find HTML in [`pug`](https://pugjs.org/) format, rather than real HTML.

These emojis indicate release status:

- ⏲️: proposal stage
- ⌨️: development
- 🧪: testing
- 🚲: experimental release available
- 🚀: stable release available

# ⌨️ Variables

Variable names always begin with a letter followed by a colon character. The character depending on where the variable is declared:

- `g:` for global (see [globals](#⏲️-globals))
- `l:` for local (see [loops](#⏲️-loops))
- `p:` for component props (see [props](#⌨️-props))
- `d:` for data (see [queries and mutations](#⏲️-queries-and-mutations))

Whenever you write `p:name`, `d:name` or `g:name` it means you're using a variable and, when rendered, it will be interpolated. This applies to attribute values, attribute names (when wrapped in square braces like `<p [g:name]></p>` and text nodes.

## ⏲️ Globals

You can declare global readonly constants that are accessible in any scope.

```yaml title="Globals"
globals:
  name: Rumple
  urls:
    rick-and-morty: 'https://rickandmortyapi.com/graphql'
    htmx: https://htmx.org
```

You can use globals in pages and components. Check the example below. Notice the global `g:name`. Using the declaration above, `g:name` is replaced with the value "Rumple".

```pug
head
  title g:name
```

## ⏲️ Secrets

TODO: write about secrets - they're similar to globals but restricted to certain scopes (never HTML rendered).

You can source secrets using environment variables, retrieve them from a remote source (like AWS or Azure), or using the `yah` secret store.

# ⌨️ Pages

```pug
page
  body
    h1 My Title
```

## ⏲️ Routing

```
app/layout.yah
app/error.yah
app/loading.yah
app/not-found.yah
app/GET.yah
```

```pug
layout
  error
    loading
      not-found
        page
```

`app/layout.yah`

```pug
html
  body
    main
      children
```

`app/blog/[slug]/GET.yah`

```yaml
---
query:
  source: my-data-client
  out: post
  operation: getPost
  operands: p:params:slug
---
```

```pug
section
  nav
  h1 d:post:title
  p d:post:content
```

`app/blog/[slug]/PATCH.yah`

Mutate data using PATCH body (`p:body`) and render new data.

```yaml
---
mutation:
  source: my-data-client
  out: post
  operation: editPost
  operands:
    - p:params:slug
    - p:body
---
```

```pug
section
  nav
  h1 d:post:title
  p d:post:content
```

`app/blog/[slug]/edit`

```yaml
---
query:
  source: my-data-client
  out: post
  operation: getPost
  operands: p:params:slug
---
```

```pug
section(id='p:params:slug')
  nav
  form
    input(id='title' value='d:post.title')
    input(id='content' value='d:post.content')
    button(
      type='submit'
      hx-patch='app/blog/p:params:slug'
      hx-target='p:params:slug'
    )

```

# ⌨️ Components

Components are configurable and reusable units of user interface. You can declare components in HTML format. You can compose new components from other components: this is composition.

Your HTML declaration for a component will always have a `component` from which the HTML for the browser can be resolved. There will always be at least one root element where the browser-facing HTML begins: this is declared with the `root` attribute.

```pug title="Declare"
component(name='c:title')
  h1(root) My Title!
```

You can use this component in HTML pages or in other components like this:

```pug title="Use"
body
  c:title
```

Which resolves to the following browser HTML:

```pug title="Render"
body
  h1 My Title!
```

You can name your component whatever you like, but it's recommended to namespace your elements to avoid clashes or confusion with other elements (i.e. web components). In these docs we use the prefix `c:`.

## ⌨️ Props

You can pass string values into components using props (also known as component attributes).

When you use any variable whose name is starting with `p:` it is treated as a component prop.

In the example below, `p:id` and `p:text` are component props. When rendered for the browser, the value of `p:id` is assigned to an attribute for `h1`, while `p:text` is inserted as the text content of `h1`.

```pug title="Declare"
component(name='c:title')
  h1(root id='p:id') p:text
```

You use these props as component attributes using the same name but without the `p:` prefix:

```pug title="Use"
body
  c:title(id='main-title' text='Welcome')
```

This example renders as:

```pug title="Render"
body
  h1(id='main-title') Welcome
```

You can use props to assign element attributes, as part of [attribute expressions](#attribute-expressions), or as part of text content.

## ⌨️ Children

You can pass children to components using the `children` element.

```pug title="Declare"
component(name='c:title')
  h1(root id='p:id')
    children
```

```pug title="Use"
body
  c:title(id='main-title') Welcome
```

Which resolves as:

```pug title="Render"
body
  h1(id='main-title') Welcome
```

## ⌨️ Composition

Here's a simple `c:title` component which will resolve to a `h1` element.

```pug title="Declare"
component(name='c:title')
  h1(root id='p:id')
    children
```

You can use `c:title` in another component like this:

```pug title="Compose"
component(name='c:welcome')
  c:title(id='main-title') Welcome
```

And use the `c:welcome` component on a page:

```pug title="Use"
body
  c:welcome
```

Which resolves as:

```pug title="Render"
body
  h1(id='main-title') Welcome
```

## ⌨️ Conditions

### ⌨️ `yah:show`

This element shows child elements when a condition is met.

```pug
yah:show(when='p:type == "hello"') Hello!
```

When condition [expression](#attribute-expressions) in the `when` attribute is evaluated as truthy then the string 'Hello' is rendered.

#### ⏲️ `fallback`

You can also define a `fallback` which shows when the condition is evaluated as falsy. The string 'false' is evaluated as `false`.

```pug title="Declare"
component(name="c:welcome")
  yah:show(when="p:is-your-birthday")
    c:title(root p:id='main-title') Happy Birthday!
    fallback(root) Welcome
```

```pug title="Use"
body
  c:welcome(is-your-birthday='party time')
```

```pug title="Render"
body
  h1(id='main-title') Happy Birthday!
```

## ⏲️ Loops

### ⏲️ `yah:for`

You can iterate over arrays and objects using `yah:for`.

For example, let's say you have `d:collection` which refers to an array of objects:

```json
[{ "name": "Pilot" }, { "name": "Lawnmower Dog" }, { "name": "Anatomy Park" }]
```

You can list each one like so:

```pug title="Use"
ol
yah:for(const='item' in='d:collection')
  empty
    p No items in the list
  do
    li l:item.name
```

And your list could look like this:

```pug title="Render"
ol
  li Pilot
  li Lawnmower Dog
  li Anatomy Park
```

You can do something similar with objects although the order of items is not guaranteed:

```json
{
  "name": "Pilot",
  "id": "1",
  "air_date": "December 2, 2013"
}
```

```pug title="Use"
ol
yah:for(key='name' value='value' in='d:object')
  empty
    p Empty object
  do
    li l:name: l:value
```

```pug title="Render"
ol
  li name: Pilot
  li air_date: December 2, 2013
  li id: 1
```

The `yah:for` element can only have `do` and `empty` child elements.

## ⏲️ History

TODO: how does component clientside state affect url history?
TODO: components should have access to browser navigation to undo or redo state changes
TODO: component state should be (opt-in) reflected in url so that, on refresh (or copy-pasting url), the page is restored
TODO: component state can be cached on clientside

## ⏲️ Using queries and mutations

You can connect your components to data sources via queries and mutations. Learn about [queries and mutations here](#⏲️-queries-and-mutations).

### ⏲️ Inline queries

You can declare queries and mutations inside your component.

```yaml
---
datasource:
  name: rick-and-morty
  url: https://rickandmortyapi.com/graphql
query:
  name: getCharacters
  source: rick-and-morty
  variables:
    page: 1
    filter:
      status: unknown
  gql: |
    query getCharacters($filter: FilterCharacter) {
      characters(filter: $filter) {
        info {
          pages
          count
          next
          prev
        }
        results {
          name
          status
        }
      }
    }
---
```

```pug
component(name='c:character-list')
  ol
    yah:for(const='character' in='d:characters')
      empty
        p No characters match your query
      do
        li l:character.name (l:character.status)
```

### ⏲️ Using the data library

Your component can use queries and mutations from your data library.

In this example we're using the `getCharacters` query from the `rick-and-morty` data source. The result is assigned to a component variable named `characters`.

```yaml
---
query:
  from-library: rick-and-morty.getCharacters
  out: characters
  variables:
    page: 1
    filter:
      status: unknown
---
```

```pug
component(name='c:character-list')
  ol
    yah:for(const='character' in='d:characters')
      empty
        p No characters match your query
      do
        li d:character.name (d:character.status)
```

## ⌨️ Variants

### ⌨️ `yah:variants`

The `yah:variants` element (class variance authority) provides an interface to select string values based on inputs. This is useful for creating style variants of components (e.g. small, large, primary, secondary).

```pug
component(name='c:button')
  yah:variants(class='inline-flex rounded-md')
    variants
      size
        sm(class='h-9 px-3' default)
        lg(class='h-11 px-8')
      type
        primary(class='bg-primary' default)
        secondary(class='bg-secondary')
  button(class='yah:variants')
```

This example will add `size` and `type` attributes to the component. The component can be instantiated in different sizes and colors. The `default` attribute sets a default value making these attributes optional.

```pug title="Use"
body
  c:button(type='secondary' size='lg')
  c:button
```

```pug title="Render"
body
  button(class='inline-flex rounded-md h-11 px-8 bg-secondary')
  button(class='inline-flex rounded-md h-9 px-3 bg-primary')
```

TODO: variants could be extended beyond the `class` attribute, and beyond a single variable (with corresponding props) in the render scope of the component.

## ⌨️ Attribute expressions

Some attributes can contain expressions that are evaluated when the component is rendered. These expressions are [Angular expressions](https://docs.angularjs.org/guide/expression).

# ⏲️ Queries and mutations

You can declare reusable queries and mutations outside of components. This forms your data library.

## ⏲️ Data sources

You can declare many types of data-sources.

TODO: sql data source
TODO: javascript data sources

### ⏲️ Remote data

You can use the `url` attribute of `<datasource>` and the `<headers>` tag to connect to remote data.

```yaml
datasource:
  name: rick-and-morty
  uri: https://rickandmortyapi.com/graphql
  type: gql
  headers:
    Authorization: |
      Bearer secrets:rick-and-morty-token
```

### ⏲️ Excel spreadsheets

You can load Excel spreadsheets from the filesystem.

You can also use the spreadsheet store to upload spreadsheets as data sources.

#### ⏲️ The spreadsheet store

The spreadsheet store is an API for uploading, labelling and removing XLSX data. These data can be referenced as data sources.

### ⏲️ GraphQL

#### ⏲️ Importing GraphQL documents

You can import queries and mutations from the filesystem using the `load-documents` field.

```yaml
datasource:
  name: rick-and-morty
  uri: https://rickandmortyapi.com/graphql
  load-documents: ./gql/**/*.graphql
```

## ⏲️ Declare queries

You can declare queries in `yaml`:

```yaml
query:
  name: getCharacters
  source: rick-and-morty
  variables:
    page: 1
    filter:
      status: unknown
  gql: |
    query getCharacters($filter: FilterCharacter) {
      characters(filter: $filter) {
        info {
          pages
          count
          next
          prev
        }
        results {
          name
          status
        }
      }
    }
```
