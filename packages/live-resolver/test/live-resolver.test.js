import assert from 'assert';
import $ from 'jquery';
import liveResolver from '../index.js';

function blobBuildHelper(lines) {
  return [
    {
      lines: lines.map(function(line) {
        const el = $(line).get(0);
        return {
          text: $(line).text(),
          el,
        };
      }),
    },
  ];
}

describe('live-resolver', () => {
  it('a', () => {
    const blob = blobBuildHelper([
      '<div>var <span>foo</span> = require(<span><span>\'</span>foo<span>\'</span></span>)</div>',
      '<div>var <span>bar</span> = require(<span><span>\'</span>bar<span>\'</span></span>)</div>',
    ]);
    const firstBlob = blob[0];
    const options = {
      regex: /require(?:.resolve)?\(['"]([^'"]+)['"]\);?/g,
    };
    liveResolver(blob, options);

    assert.equal(firstBlob.lines[0].el.innerHTML, 'var <span>foo</span> = require(<span><span>\'</span><a>foo</a><span>\'</span></span>)');
    assert.equal(firstBlob.lines[1].el.innerHTML, 'var <span>bar</span> = require(<span><span>\'</span><a>bar</a><span>\'</span></span>)');
  });

  it('b', () => {
    const blob = blobBuildHelper([
      '<div><span>attr-</span><span>foo</span></div>',
      '<div><span>attr-</span><span>bar</span></div>',
    ]);
    const firstBlob = blob[0];
    const options = {
      regex: /attr-(\w*)/g,
    };
    liveResolver(blob, options);

    assert.equal(firstBlob.lines[0].el.innerHTML, '<span>attr-</span><a><span>foo</span></a>');
    assert.equal(firstBlob.lines[1].el.innerHTML, '<span>attr-</span><a><span>bar</span></a>');
  });

  it('c', () => {
    const blob = blobBuildHelper([
      '<div><span>attr-</span><strong><span>foo</span></strong></div>',
      '<div><span>attr-</span><strong><span>bar</span></strong></div>',
    ]);
    const firstBlob = blob[0];
    const options = {
      regex: /attr-(\w*)/g,
    };
    liveResolver(blob, options);

    assert.equal(firstBlob.lines[0].el.innerHTML, '<span>attr-</span><strong><a><span>foo</span></a></strong>');
    assert.equal(firstBlob.lines[1].el.innerHTML, '<span>attr-</span><strong><a><span>bar</span></a></strong>');
  });

  it('d', () => {
    const blob = blobBuildHelper([
      '<div><span>attr-</span><span>foo</span> <span>data-</span><span>bar</span></div>',
      '<div><span>attr-</span><span>foo</span> <span>data-</span><span>bar</span></div>',
    ]);
    const firstBlob = blob[0];
    const options = {
      regex: /attr-(\w*) data-(\w*)/g,
    };
    liveResolver(blob, options);

    assert.equal(firstBlob.lines[0].el.innerHTML, '<span>attr-</span><a><span>foo</span></a> <span>data-</span><a><span>bar</span></a>');
    assert.equal(firstBlob.lines[1].el.innerHTML, '<span>attr-</span><a><span>foo</span></a> <span>data-</span><a><span>bar</span></a>');
  });
});
