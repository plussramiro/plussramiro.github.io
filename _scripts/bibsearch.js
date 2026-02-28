---
permalink: /assets/js/bibsearch.js
---
import { highlightSearchTerm } from "./highlight-search-term.js";

document.addEventListener("DOMContentLoaded", function () {
  const bibSearchInput = document.getElementById("bibsearch");
  if (!bibSearchInput) return;
  const INPUT_DEBOUNCE_MS = 80;

  const filterItems = (searchTerm) => {
    document.querySelectorAll(".bibliography, .unloaded").forEach((element) => element.classList.remove("unloaded"));

    if (CSS.highlights) {
      const nonMatchingElements = highlightSearchTerm({ search: searchTerm, selector: ".bibliography > li" });
      if (nonMatchingElements == null) {
        return;
      }
      nonMatchingElements.forEach((element) => {
        element.classList.add("unloaded");
      });
    } else {
      document.querySelectorAll(".bibliography > li").forEach((element) => {
        const text = element.innerText.toLowerCase();
        if (text.indexOf(searchTerm) === -1) {
          element.classList.add("unloaded");
        }
      });
    }

    document.querySelectorAll("h2.bibliography").forEach((element) => {
      let iterator = element.nextElementSibling;
      let hideFirstGroupingElement = true;

      while (iterator && iterator.tagName !== "H2") {
        if (iterator.tagName === "OL") {
          const ol = iterator;
          const unloadedSiblings = ol.querySelectorAll(":scope > li.unloaded");
          const totalSiblings = ol.querySelectorAll(":scope > li");

          if (unloadedSiblings.length === totalSiblings.length) {
            ol.previousElementSibling.classList.add("unloaded");
            ol.classList.add("unloaded");
          } else {
            hideFirstGroupingElement = false;
          }
        }
        iterator = iterator.nextElementSibling;
      }

      if (hideFirstGroupingElement) {
        element.classList.add("unloaded");
      }
    });
  };

  const updateInputField = () => {
    const hashValue = decodeURIComponent(window.location.hash.substring(1));
    bibSearchInput.value = hashValue;
    filterItems(hashValue.toLowerCase());
  };

  let timeoutId;
  let frameId;

  const scheduleFilter = (searchTerm) => {
    clearTimeout(timeoutId);
    if (frameId) cancelAnimationFrame(frameId);

    timeoutId = setTimeout(() => {
      frameId = requestAnimationFrame(() => {
        filterItems(searchTerm);
        frameId = null;
      });
    }, INPUT_DEBOUNCE_MS);
  };

  bibSearchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    scheduleFilter(searchTerm);
  });

  window.addEventListener("hashchange", updateInputField);
  updateInputField();
});
