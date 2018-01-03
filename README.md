# babel-collect-imports

> Recursively collect all the internal and external dependencies from an entry point

## Install

```sh
yarn add babel-collect-imports
```

## Usage

```js
const { collectImportsSync } = require('babel-collect-imports');

let { internal, external } = collectImportsSync('path/to/entry.js');
// { internal: ['path/to/entry.js', 'path/to/import.js', 'path/to/other/import.js'],
//   external: ['lodash', 'react'] }
```

When it discovers an "internal" dependency (one that is not a node package), it
will follow the import and continue collecting dependencies.

## API

### `collectImportsSync(entry, parserOpts?, resolveOpts?)`

- `entry` should be a full file path
- `parserOpts` is [Babylon's](https://github.com/babel/babel/tree/master/packages/babylon) options
- `resolveOpts` is [resolve's](https://github.com/browserify/resolve) options

## FAQ

#### How are "internal" vs "external" imports determined?

It's all about the starting dot:

```js
import internal from './internal-because-it-starts-with-a-dot';
import external from 'external-because-it-does-not-start-with-a-dot';
```

#### What about my special aliasing system?

Your custom aliasing is bad and you should feel bad. Try playing with
`resolveOpts`.
