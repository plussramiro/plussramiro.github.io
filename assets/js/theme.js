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
    var setting = getThemeSetting();

    if (setting === 'system') {
      document.documentElement.removeAttribute('data-theme-setting');
      if (prefersDark()) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      return;
    }

    document.documentElement.setAttribute('data-theme-setting', setting);
    if (setting === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  window.initTheme = function () {
    applyThemeSetting();
  };

  if (typeof window.setThemeSetting !== 'function') {
    window.setThemeSetting = function (setting) {
      var next = setting || 'system';
      try {
        localStorage.setItem('theme', next);
      } catch (e) {
        // Ignore storage errors (private mode / disabled storage)
      }
      applyThemeSetting();
    };
  }
})();
