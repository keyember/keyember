/* ===================================================
   Projects — chargés depuis projects.json (repo GitHub)
   CRUD : éditer projects.json directement sur GitHub
   =================================================== */

const STATUS_LABELS = {
  live:     '● Live',
  wip:      '⟳ WIP',
  archived: '✕ Archivé'
};

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function loadProjects() {
  const grid = document.getElementById('project-grid');
  if (!grid) return;
  try {
    const res = await fetch('./projects.json?v=' + Date.now());
    if (!res.ok) throw new Error('fetch failed');
    const projects = await res.json();
    renderProjects(grid, projects);
  } catch (err) {
    grid.innerHTML = '<div class="empty-state">Impossible de charger les projets.</div>';
    console.error(err);
  }
}

function renderProjects(grid, projects) {
  if (!projects.length) {
    grid.innerHTML = '<div class="empty-state">Aucun projet pour l\'instant.</div>';
    return;
  }
  grid.innerHTML = projects.map(p => `
    <article class="project-card">
      <div class="project-card-name">${esc(p.name)}</div>
      ${p.desc ? `<p class="project-card-desc">${esc(p.desc)}</p>` : ''}
      <div class="project-card-footer">
        <span class="project-status status-${p.status}">${STATUS_LABELS[p.status] ?? p.status}</span>
        ${p.tag  ? `<span class="project-tag">${esc(p.tag)}</span>` : ''}
        ${p.url  ? `<a class="project-link" href="${esc(p.url)}" target="_blank" rel="noopener">↗ Voir</a>` : ''}
      </div>
    </article>
  `).join('');
}

/* ===== MODAL FAQ ===== */
function initFaqModal() {
  const btn     = document.getElementById('waifu-btn');
  const overlay = document.getElementById('faq-overlay');
  const close   = document.getElementById('faq-close');
  if (!btn || !overlay || !close) return;

  function openModal() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', openModal);
  close.addEventListener('click', closeModal);

  // Clic sur l'overlay (hors modal) ferme
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Touche Escape ferme
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
  initFaqModal();

  /* Navigation douce */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
