// @flow
'use strict';

const fs = require('fs');
const { loadFileSync, resolveImportFilePathSync } = require('babel-file-loader');
const { sync: resolveSync } = require('resolve');
const path = require('path');

/*::
import type { BabelParserOptions } from 'babel-flow-types';

export type ParserOptions = BabelParserOptions;
export type ResolveOptions = {
  package?: Object,
  extensions?: Array<string>,
  readFile?: Function,
  isFile?: Function,
  packageFilter?: Function,
  pathFilter?: Function,
  paths?: Array<string>,
  moduleDirectory?: string | Array<string>,
};
*/

function getImportSources(filePath, parserOpts) {
  let file = loadFileSync(filePath, parserOpts);
  let importSources = [];

  for (let item of file.path.get('body')) {
    if (
      item.isImportDeclaration() ||
      (item.isExportDeclaration() && item.node.source)
    ) {
      importSources.push(item.node.source.value);
    }
  }

  return importSources;
}

function resolveImportSourcePathSync(filePath, importSource, resolveOpts) {
  return resolveSync(importSource, Object.assign({}, resolveOpts, {
    basedir: path.dirname(filePath),
  }));
}

const INTERNAL_MODULE_SOURCE = /^\./;

function collectImportsSync(
  entry /*: string */,
  parserOpts /*:: ?: ParserOptions */,
  resolveOpts /*:: ?: ResolveOptions */
) {
  let visited = {};
  let queue = [entry];
  let internal = [];
  let external = [];

  while (queue.length) {
    let filePath = queue.shift();
    let importSources = getImportSources(filePath, parserOpts);

    for (let importSource of importSources) {
      if (INTERNAL_MODULE_SOURCE.test(importSource)) {
        let resolved = resolveImportSourcePathSync(filePath, importSource, resolveOpts);
        if (!visited[resolved]) queue.push(resolved);
      } else {
        external.push(importSource)
      }
    }

    internal.push(filePath);
    visited[filePath] = true;
  }

  return {
    internal,
    external,
  };
}

exports.collectImportsSync = collectImportsSync;
