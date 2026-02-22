// Theme handling for al-folio (light / dark /system)
(function () {
  function prefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyThemeSetting() {
    const setting = localStorage.getItem('theme') || 'system';

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
    localStorage.setItem('theme', s);
    applyThemeSetting();
  };

  // Toggle button: cycles system -> dark -> light -> system
  function cycleTheme() {
    const current = localStorage.getItem('theme') || 'system';
    let next;
    if (current === 'system') next = 'dark';
    else if (current === 'dark') next = 'light';
    else next = 'system';
    window.setThemeSetting(next);
  }

  document.addEventListener('DOMContentLoaded', function () {
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
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
        const setting = localStorage.getItem('theme') || 'system';
        if (setting === 'system') applyThemeSetting();
      });
    }
  });
})();
