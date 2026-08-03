(() => {
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const setTheme = (value) => {
    theme = value;
    root.setAttribute('data-theme', theme);
    if (!toggle) return;
    toggle.setAttribute('aria-label', `Basculer vers le thème ${theme === 'dark' ? 'clair' : 'sombre'}`);
    toggle.innerHTML = theme === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="none" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
  };
  setTheme(theme);
  toggle?.addEventListener('click', () => setTheme(theme === 'dark' ? 'light' : 'dark'));
})();