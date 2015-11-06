import assert from 'assert';
import {requireRegex} from '../../grammar/javascript.js';

function matchHelper(str, expected) {
  const actual = [];
  let match;

  while (match = requireRegex.exec(str)) { // eslint-disable-line no-cond-assign
    actual.push(match[1]);
  }

  assert.deepEqual(actual, expected);
}

describe('javascript', () => {
  describe('require statment', () => {
    it('returns an array of matches', () => {
      matchHelper('var path = require(\'path\')var list = require(\'fs\')', ['path', 'fs']);
      matchHelper('require(\'path\')\nrequire(\'fs\');', ['path', 'fs']);
      matchHelper('require("path")\nrequire("fs");', ['path', 'fs']);
      matchHelper('require("path")require("fs");', ['path', 'fs']);
      matchHelper('var foo = require("path")require("fs");', ['path', 'fs']);
      matchHelper('var\nfoo\n=\nrequire("path")require("fs");', ['path', 'fs']);
      matchHelper('var foo = require("path")require("fs")', ['path', 'fs']);
      matchHelper('foo = require("path")require("fs")', ['path', 'fs']);
      matchHelper('foo = require("path")bar = require("fs")', ['path', 'fs']);
      matchHelper('foo = require("a-b")bar = require("c-d-e")', ['a-b', 'c-d-e']);
      matchHelper('foo = require("./path")bar = require("./fs")', ['./path', './fs']);
      matchHelper('const foo = require("./path")bar = require("./fs")', ['./path', './fs']);
      matchHelper('require.resolve("path")require.resolve("fs");', ['path', 'fs']);
    });
  });
});
