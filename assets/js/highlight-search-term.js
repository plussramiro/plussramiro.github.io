/**
 * This file is a modified version of:
 * https://github.com/marmelab/highlight-search-term/blob/main/src/index.js
 * - We return the `nonMatchingElements`
 * - We fixed a bug: `getRangesForSearchTermInElement` got the `node.parentElement`,
 *   which does not work if there are multiple text nodes in one element.
 *
 * highlight-search-term is published under MIT License.
 */

const highlightSearchTerm = ({ search, selector, customHighlightName = "search" }) => {
  if (!selector) {
    throw new Error("The selector argument is required");
  }

  if (!CSS.highlights) return;

  CSS.highlights.delete(customHighlightName);
  if (!search) {
    return;
  }

  const ranges = [];
  const nonMatchingElements = [];
  const elements = document.querySelectorAll(selector);

  Array.from(elements).forEach((element) => {
    let match = false;
    getTextNodesInElementContainingText(element, search).forEach((node) => {
      const rangesForSearch = getRangesForSearchTermInNode(node, search);
      ranges.push(...rangesForSearch);
      if (rangesForSearch.length > 0) {
        match = true;
      }
    });
    if (!match) {
      nonMatchingElements.push(element);
    }
  });

  if (ranges.length === 0) return nonMatchingElements;

  const highlight = new Highlight(...ranges);
  CSS.highlights.set(customHighlightName, highlight);
  return nonMatchingElements;
};

const getTextNodesInElementContainingText = (element, text) => {
  const nodes = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (node.textContent && node.textContent.toLowerCase().includes(text)) {
      nodes.push(node);
    }
  }
  return nodes;
};

const getRangesForSearchTermInNode = (node, search) => {
  const ranges = [];
  const text = (node.textContent ? node.textContent.toLowerCase() : "") || "";

  let start = 0;
  let index;
  while ((index = text.indexOf(search, start)) >= 0) {
    const range = new Range();
    range.setStart(node, index);
    range.setEnd(node, index + search.length);
    ranges.push(range);
    start = index + search.length;
  }
  return ranges;
};

export { highlightSearchTerm };
