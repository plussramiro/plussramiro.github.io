(function () {
  var fallbackSearchState = {
    results: [],
    activeIndex: -1
  };

  function getNinjaElement() {
    return document.querySelector('ninja-keys');
  }

  function getSearchItems() {
    var ninja = getNinjaElement();
    if (!ninja || !Array.isArray(ninja.data)) return [];
    return ninja.data
      .filter(function (item) {
        if (!item || typeof item.title !== 'string' || typeof item.handler !== 'function') return false;
        // Hide template/demo entries in the command palette.
        if (item.section === 'Dropdown' || item.section === 'Posts') return false;
        return true;
      })
      .map(function (item) {
        var normalized = {};
        for (var key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key)) normalized[key] = item[key];
        }

        // Some generated titles include inline SVG for external-link icons; strip tags in the fallback UI.
        normalized.title = String(item.title).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        return normalized;
      });
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function ensureFallbackSearchModal() {
    var existing = document.getElementById('alfolio-search-fallback');
    if (existing) return existing;

    var overlay = document.createElement('div');
    overlay.id = 'alfolio-search-fallback';
    overlay.style.cssText = [
      'position:fixed',
      'inset:0',
      'background:rgba(0,0,0,.35)',
      'display:none',
      'align-items:flex-start',
      'justify-content:center',
      'padding:6vh 1rem 1rem',
      'z-index:2000'
    ].join(';');

    overlay.innerHTML =
      '<div style="width:min(920px, 100%); background:var(--global-card-bg-color, #fff); color:var(--global-text-color, #111); border:1px solid var(--global-divider-color, #ddd); border-radius:14px; box-shadow:0 14px 40px rgba(0,0,0,.22); overflow:hidden;">' +
      '  <div style="padding:.9rem 1rem; border-bottom:1px solid var(--global-divider-color, #ddd);">' +
      '    <input id="alfolio-search-input" type="text" placeholder="Type to start searching" style="width:100%; border:0; outline:0; background:transparent; color:inherit; font-size:1.05rem;" />' +
      '  </div>' +
      '  <div id="alfolio-search-results" style="max-height:55vh; overflow:auto; padding:.45rem .55rem .55rem;"></div>' +
      '  <div style="display:flex; flex-wrap:wrap; gap:.65rem 1rem; align-items:center; padding:.55rem .8rem; border-top:1px solid var(--global-divider-color, #ddd); color:var(--global-text-color-light, #666); font-size:.82rem;">' +
      '    <span><kbd style="padding:.12rem .38rem; border-radius:.3rem; border:1px solid var(--global-divider-color, #ddd); background:var(--global-bg-color, #f4f4f4); font:inherit;">↵</kbd> to select</span>' +
      '    <span><kbd style="padding:.12rem .38rem; border-radius:.3rem; border:1px solid var(--global-divider-color, #ddd); background:var(--global-bg-color, #f4f4f4); font:inherit;">↑</kbd> <kbd style="padding:.12rem .38rem; border-radius:.3rem; border:1px solid var(--global-divider-color, #ddd); background:var(--global-bg-color, #f4f4f4); font:inherit;">↓</kbd> to navigate</span>' +
      '    <span><kbd style="padding:.12rem .38rem; border-radius:.3rem; border:1px solid var(--global-divider-color, #ddd); background:var(--global-bg-color, #f4f4f4); font:inherit;">esc</kbd> to close</span>' +
      '  </div>' +
      '</div>';

    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeFallbackSearch();
    });

    document.addEventListener('keydown', function (e) {
      if (overlay.style.display === 'none') return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeFallbackSearch();
      }
    });

    return overlay;
  }

  function getFallbackButtons() {
    return Array.prototype.slice.call(
      document.querySelectorAll('#alfolio-search-results button[data-fallback-search-result]')
    );
  }

  function paintFallbackButton(button, isActive) {
    if (!button) return;
    button.style.background = isActive ? 'var(--global-bg-color, rgba(0,0,0,.03))' : 'transparent';
    button.style.outline = isActive ? '1px solid var(--global-divider-color, #ddd)' : 'none';
  }

  function setActiveFallbackIndex(index) {
    var buttons = getFallbackButtons();
    if (!buttons.length) {
      fallbackSearchState.activeIndex = -1;
      return;
    }

    if (index < 0) index = buttons.length - 1;
    if (index >= buttons.length) index = 0;

    fallbackSearchState.activeIndex = index;

    buttons.forEach(function (button, idx) {
      paintFallbackButton(button, idx === index);
    });

    try {
      buttons[index].scrollIntoView({ block: 'nearest' });
    } catch (e) {
      buttons[index].scrollIntoView(false);
    }
  }

  function runActiveFallbackResult() {
    var index = fallbackSearchState.activeIndex;
    if (index < 0) index = 0;

    var buttons = getFallbackButtons();
    if (buttons[index]) buttons[index].click();
  }

  function renderFallbackResults(query) {
    var resultsContainer = document.getElementById('alfolio-search-results');
    if (!resultsContainer) return;

    var q = (query || '').trim().toLowerCase();
    var items = getSearchItems();

    var results = items;
    if (q) {
      results = items.filter(function (item) {
        var haystack = [item.title, item.description || '', item.section || ''].join(' ').toLowerCase();
        return haystack.indexOf(q) !== -1;
      });
    }

    results = results.slice(0, 20);
    fallbackSearchState.results = results;
    fallbackSearchState.activeIndex = -1;

    if (!results.length) {
      resultsContainer.innerHTML =
        '<div style="padding:.8rem; color:var(--global-text-color-light, #666); font-size:.92rem;">No results found.</div>';
      return;
    }

    resultsContainer.innerHTML = '';

    var lastSection = null;
    results.forEach(function (item, idx) {
      var section = item.section || 'Results';
      if (section !== lastSection) {
        var sectionHeader = document.createElement('div');
        sectionHeader.textContent = section;
        sectionHeader.style.cssText = [
          'font-size:.78rem',
          'font-weight:600',
          'letter-spacing:.02em',
          'opacity:.75',
          'padding:.4rem .45rem .3rem',
          'text-transform:none'
        ].join(';');
        resultsContainer.appendChild(sectionHeader);
        lastSection = section;
      }

      var button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('data-fallback-search-result', String(idx));
      button.style.cssText = [
        'width:100%',
        'text-align:left',
        'border:0',
        'background:transparent',
        'color:inherit',
        'padding:.55rem .6rem',
        'border-radius:10px',
        'cursor:pointer',
        'display:block',
        'margin-bottom:.12rem'
      ].join(';');

      var title = item.title || '';
      var description = item.description || '';

      button.innerHTML =
        '<div style="font-weight:700; font-size:1rem; line-height:1.25;">' + escapeHtml(title) + '</div>' +
        (description
          ? '<div style="font-size:.86rem; opacity:.84; margin-top:.14rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' +
            escapeHtml(description) +
            '</div>'
          : '');

      button.addEventListener('click', function () {
        closeFallbackSearch();
        item.handler();
      });

      button.addEventListener('mouseenter', function () {
        setActiveFallbackIndex(idx);
      });

      button.addEventListener('mouseleave', function () {
        paintFallbackButton(button, idx === fallbackSearchState.activeIndex);
      });

      resultsContainer.appendChild(button);
    });

    setActiveFallbackIndex(0);
  }

  function openFallbackSearch() {
    var overlay = ensureFallbackSearchModal();
    overlay.style.display = 'flex';

    var input = document.getElementById('alfolio-search-input');
    if (!input) return;

    input.value = '';
    renderFallbackResults('');

    setTimeout(function () {
      input.focus();
    }, 0);

    input.oninput = function () {
      renderFallbackResults(input.value);
    };

    input.onkeydown = function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveFallbackIndex(fallbackSearchState.activeIndex + 1);
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveFallbackIndex(fallbackSearchState.activeIndex - 1);
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        runActiveFallbackResult();
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        closeFallbackSearch();
      }
    };
  }

  function closeFallbackSearch() {
    var overlay = document.getElementById('alfolio-search-fallback');
    if (!overlay) return;
    overlay.style.display = 'none';
    fallbackSearchState.activeIndex = -1;
    fallbackSearchState.results = [];
  }

  window.openSearchModal = function () {
    var ninja = getNinjaElement();

    // If the ninja-keys web component is available, use the native command palette.
    if (ninja && typeof ninja.open === 'function') {
      ninja.open();
      return;
    }

    // Fallback modal search if ninja-keys assets are not present.
    openFallbackSearch();
  };

  window.closeSearchModal = closeFallbackSearch;
})();
