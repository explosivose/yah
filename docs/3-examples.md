I want to illustrate some examples that use the htmx paradigms:

- controls use http verbs to get or modify server state
- http verbs return html to represent latest state

# Github Star button (graphql)

In this first example we create a generic `c:button` component and then use it to create a 'star' button for Github. Initially, `c:button-add-star` will show an icon button. When clicked, it will call itself (i.e. call the component's http endpoint) to run the server action for adding a star, and it will return the `c:button-add-star` html that indicates the star was added (a different button variant and icon).

So, it illustrates how a component can display the initial state and subsequent states (toggling the star).

First we have our design-system button:

```pug title="Design system button"
component(name='c:button')
  variants
    variants
      size
        sm
        lg
        icon
      type
        primary
        secondary
        destructive
        outline
        link
  button(class='variants')
```

```yaml title="Star-button frontmatter"
---
using:
  datasource:
    name: github-graphql
    url: https://api.github.com/graphql
  query:
    source: github-graphql
    out: has-starred
    when: !p:action
    variables:
      name: p:repo-name
      owner: p:repo-owner
    gql: |
      query isRepoStarred($name:String!,$owner:String!) {
        repository(name:$name,owner:$owner) {
          id
          viewerHasStarred
        }
      }
  mutation:
    source: github-graphql
    out: add-star
    when: p:action
    variables:
      input:
        starrableId: p:starrable-id
    gql: |
      mutation star($input:AddStarInput!) {
        addStar(input:$input) {
          starrable {
            stargazerCount
            viewerHasStarred
          }
        }
      }
  locals:
    has-starred: d:has-starred:repository:viewerHasStarred || d:add-star:starrable:viewerHasStarred
    repo-id: d:has-starred:repository:id
---
```

```pug title="Star button"
component(name='c:button-add-star')
  c:button(
    size='icon'
    type='l:has-starred ? primary : secondary'
    hx-post='c/c:button-add-star?starrable-id=l:repo-id,p:action=true'
  )
```

```pug title="Use the star button"
c:button-add-star(repo-name="yah" repo-owner="explosivose")
```

```yaml
component:
  _name: c:button-add-star
  c:button:
    _size: icon
    _type: 'l:has-starred ? primary : secondary'
    _hx-post: 'c/c:button-add-star?starrable-id=l:repo-id,p:action=true'
```

```yaml
c:button-add-star:
  _repo-name: yah
  _repo-owner: explosivose
```

# Github star button (REST)

TODO
