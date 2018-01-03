// @flow
'use strict';
const test = require('ava');
const { collectImportsSync } = require('./');
const fixtures = require('fixturez');
const { join } = require('path');
const f = fixtures(__dirname, { root: __dirname });

let nonePath = f.find('none.js');
let externalPath = f.find('external.js');
let internalPath = f.find('internal.js');
let internalAndExternalPath = f.find('internal-and-external.js');
let exportFromPath = f.find('export-from.js');
let cycleAPath = f.find('cycle-a.js');
let cycleBPath = f.find('cycle-b.js');

test('none', t => {
  t.deepEqual(collectImportsSync(nonePath), {
    internal: [nonePath],
    external: [],
  });
});

test('external', t => {
  t.deepEqual(collectImportsSync(externalPath), {
    internal: [externalPath],
    external: ['external'],
  });
});

test('internal', t => {
  t.deepEqual(collectImportsSync(internalPath), {
    internal: [internalPath, nonePath],
    external: [],
  });
});

test('internal-and-external', t => {
  t.deepEqual(collectImportsSync(internalAndExternalPath), {
    internal: [internalAndExternalPath, externalPath],
    external: ['external'],
  });
});

test('export-from', t => {
  t.deepEqual(collectImportsSync(exportFromPath), {
    internal: [exportFromPath, nonePath],
    external: [],
  });
});

test('cycle', t => {
  t.deepEqual(collectImportsSync(cycleAPath), {
    internal: [cycleAPath, cycleBPath],
    external: [],
  });
});
