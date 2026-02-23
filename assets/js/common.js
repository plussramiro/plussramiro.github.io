// Theme handling for al-folio (light / dark /system)
(function () {
  function prefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function getThemeSetting() {
    try {
      return localStorage.getItem('theme') || 'system';
    } catch (e) {
      return 'system';
    }
  }

  function applyThemeSetting() {
    const setting = getThemeSetting();

    if (setting === 'system') {
      // remove explicit user setting so CSS can respond to system
      document.documentElement.removeAttribute('data-theme-setting');
      // set data-theme based on system preference (used by some scripts)
      if (prefersDark()) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    } else {
      document.documentElement.setAttribute('data-theme-setting', setting);
      if (setting === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }
  }

  // API used elsewhere in theme
  window.setThemeSetting = function (s) {
    if (!s) s = 'system';
    try {
      localStorage.setItem('theme', s);
    } catch (e) {
      // Ignore storage errors (private mode / disabled storage)
    }
    applyThemeSetting();
  };

  // Compatibility with the original al-folio head snippet.
  window.initTheme = function () {
    applyThemeSetting();
  };

  // Toggle button: cycles system -> dark -> light -> system
  function cycleTheme() {
    const current = getThemeSetting();
    let next;
    if (current === 'system') next = 'dark';
    else if (current === 'dark') next = 'light';
    else next = 'system';
    window.setThemeSetting(next);
  }

  function setupThemeToggle() {
    // Apply initial theme
    applyThemeSetting();

    // Wire up toggle button
    const btn = document.getElementById('light-toggle');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        cycleTheme();
      });
    }

    // Listen to system preference changes when in 'system' mode
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = function () {
        const setting = getThemeSetting();
        if (setting === 'system') applyThemeSetting();
      };

      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handleSystemThemeChange);
      } else if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener(handleSystemThemeChange);
      }
    }
  }

  function setupPublicationToggles() {
    if (window.__alfolioPublicationTogglesBound) return;
    window.__alfolioPublicationTogglesBound = true;

    document.addEventListener('click', function (e) {
      const abstractBtn = e.target.closest('a.abstract.btn');
      const bibtexBtn = e.target.closest('a.bibtex.btn');
      const awardBtn = e.target.closest('a.award.btn');

      const trigger = abstractBtn || bibtexBtn || awardBtn;
      if (!trigger) return;

      e.preventDefault();

      const links = trigger.closest('.links');
      if (!links) return;

      const entry = links.parentElement;
      if (!entry) return;

      let target = null;

      if (bibtexBtn) {
        target = entry.querySelector('.bibtex.hidden');
      } else if (awardBtn) {
        target = entry.querySelector('.award.hidden');
      } else if (abstractBtn) {
        const abstractBlocks = entry.querySelectorAll('.abstract.hidden');
        if (!abstractBlocks.length) return;

        const label = (trigger.textContent || '').trim().toLowerCase();
        if (label === 'video' && abstractBlocks.length > 1) {
          target = abstractBlocks[abstractBlocks.length - 1];
        } else {
          target = abstractBlocks[0];
        }
      }

      if (!target) return;

      target.classList.toggle('open');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setupThemeToggle();
      setupPublicationToggles();
    });
  } else {
    setupThemeToggle();
    setupPublicationToggles();
  }
})();
