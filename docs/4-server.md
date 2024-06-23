## CLI

These emojis indicate release status:

- ⏲️: proposal stage
- ⌨️: development
- 🧪: testing
- 🚲: experimental release available
- 🚀: stable release available

### ⏲️ `yah [...options] [declarations glob]`

#### ⏲️ `--watch`

Respond to changes on the filesystem. If your declarations are modified then the output or API will be updated.

#### ⏲️ `--html [dir]`

Set the output directory for static HTML outputs.

## ⏲️ Static HTML

You can declare pages or components that have unchanging or limited props. In these cases, all the HTML for the browser can be statically generated once and served on request.

## ⏲️ Dynamic HTML

Your declarations may depend on dynamic values that cannot be known when you run `yah`. For example, user input or external APIs. In these cases it isn't possible to statically generate HTML for all possible values. Instead, `yah` will generate the HTML fresh on request.

### ⏲️ Pages

### ⏲️ Components

`component/{name}?{propName}={propValue},{propName}={propValue}`
