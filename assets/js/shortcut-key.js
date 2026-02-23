(function () {
  if (window.__alfolioSearchShortcutInitialized) return;
  window.__alfolioSearchShortcutInitialized = true;

  function isEditableTarget(target) {
    if (!target) return false;
    if (target.isContentEditable) return true;
    var tagName = (target.tagName || '').toLowerCase();
    return tagName === 'input' || tagName === 'textarea' || tagName === 'select';
  }

  function handleSearchShortcut(event) {
    var key = (event.key || '').toLowerCase();
    var isCommandPaletteShortcut = key === 'k' && (event.ctrlKey || event.metaKey) && !event.altKey;

    if (!isCommandPaletteShortcut) return;
    if (event.defaultPrevented) return;
    if (isEditableTarget(event.target)) return;
    if (typeof window.openSearchModal !== 'function') return;

    event.preventDefault();
    window.openSearchModal();
  }

  document.addEventListener('keydown', handleSearchShortcut);
})();
