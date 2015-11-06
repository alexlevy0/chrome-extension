import $ from 'jquery';

function getKeywords(text, regex) {
  const ret = {};
  let match;

  function findKeywords(val) {
    const startIndex = text.indexOf(val, match.index);
    ret[startIndex] = val;
  }

  while (match = regex.exec(text)) { // eslint-disable-line no-cond-assign
    match.slice(1).map(findKeywords);
  }

  return ret;
}

function insertLink(el, keywords, options, fromIndex = 0) {
  let charIndex = fromIndex;

  Array.prototype.forEach.call(el.childNodes, (child) => {
    if (child.childElementCount) {
      return insertLink(child, keywords, options, charIndex);
    }

    const $el = $(child);
    const keyword = keywords[charIndex];
    charIndex += child.textContent.length;

    if (keyword) {
      let attr = '';
      if (options.debug) {
        attr = ' class="ghl-link--debug-mode"';
      }

      const linkElement = `<a${attr}>`;
      $el.wrap(linkElement);
    }
  });
}

function blober(blob, options) {
  blob.lines.forEach((item) => {
    const keywords = getKeywords(item.text, options.regex);
    if (!keywords) {
      return;
    }

    insertLink(item.el, keywords, options);
  });
}

function main(blobs, options = {debug: false}) {
  blobs.forEach((blob) => {
    blober(blob, options);
  });
}

export {
  main as default,
};
