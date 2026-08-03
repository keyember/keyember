/* ===== PROJECT DATA (CRUD) ===== */
const STORAGE_KEY = 'keyember_projects';

const DEFAULT_PROJECTS = [
  {
    id: 1,
    name: 'Keyember — Page de profil',
    desc: 'Cette page. Background Discord, mascotte waifu, système de projets CRUD.',
    url: 'https://keyember.github.io/keyember',
    tag: 'HTML/CSS/JS',
    status: 'live'
  }
];

function loadProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_PROJECTS;
  } catch { return DEFAULT_PROJECTS; }
}

function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function renderProjects() {
  const grid = document.getElementById('project-grid');
  const projects = loadProjects();
  if (!grid) return;

  if (projects.length === 0) {
    grid.innerHTML = `<div class="empty-state"><span>🗂️</span>Aucun projet pour l'instant.<br>Clique sur <strong>+ Ajouter</strong> pour commencer.</div>`;
    return;
  }

  grid.innerHTML = projects.map(p => `
    <article class="project-card" data-id="${p.id}">
      <div class="project-card-header">
        <span class="project-card-title">${escHtml(p.name)}</span>
        <div class="project-card-actions">
          <button class="btn btn-icon" title="Modifier" onclick="openEditModal(${p.id})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn btn-delete" title="Supprimer" onclick="deleteProject(${p.id})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      </div>
      ${p.desc ? `<p class="project-card-desc">${escHtml(p.desc)}</p>` : ''}
      <div class="project-card-footer">
        <span class="project-status ${p.status}">${statusLabel(p.status)}</span>
        ${p.tag ? `<span class="project-tag">${escHtml(p.tag)}</span>` : ''}
        ${p.url ? `<a class="project-link" href="${escHtml(p.url)}" target="_blank" rel="noopener">↗ Voir</a>` : ''}
      </div>
    </article>
  `).join('');
}

function statusLabel(s) {
  return { live: '● Live', wip: '⟳ WIP', archived: '✕ Archivé' }[s] || s;
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function nextId() {
  const projects = loadProjects();
  return projects.length ? Math.max(...projects.map(p => p.id)) + 1 : 1;
}

/* ===== MODAL ===== */
let editingId = null;

function openAddModal() {
  editingId = null;
  document.getElementById('modal-title').textContent = 'Nouveau projet';
  document.getElementById('p-name').value = '';
  document.getElementById('p-desc').value = '';
  document.getElementById('p-url').value = '';
  document.getElementById('p-tag').value = '';
  document.getElementById('p-status').value = 'wip';
  document.getElementById('project-modal').classList.remove('hidden');
  document.getElementById('p-name').focus();
}

function openEditModal(id) {
  const projects = loadProjects();
  const p = projects.find(x => x.id === id);
  if (!p) return;
  editingId = id;
  document.getElementById('modal-title').textContent = 'Modifier le projet';
  document.getElementById('p-name').value = p.name;
  document.getElementById('p-desc').value = p.desc || '';
  document.getElementById('p-url').value = p.url || '';
  document.getElementById('p-tag').value = p.tag || '';
  document.getElementById('p-status').value = p.status;
  document.getElementById('project-modal').classList.remove('hidden');
  document.getElementById('p-name').focus();
}

function closeModal() {
  document.getElementById('project-modal').classList.add('hidden');
  editingId = null;
}

function deleteProject(id) {
  if (!confirm('Supprimer ce projet ?')) return;
  const projects = loadProjects().filter(p => p.id !== id);
  saveProjects(projects);
  renderProjects();
}

/* ===== NAVIGATION ===== */
function initNav() {
  const items = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.section');

  function activate(targetId) {
    sections.forEach(s => s.classList.toggle('active', s.id === targetId));
    items.forEach(i => i.classList.toggle('active', i.dataset.section === targetId));
  }

  items.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      activate(item.dataset.section);
    });
  });

  // CTAs dans les sections
  document.querySelectorAll('[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = a.getAttribute('href').slice(1);
      const section = document.getElementById(target);
      if (section && section.classList.contains('section')) {
        e.preventDefault();
        activate(target);
      }
    });
  });
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  renderProjects();

  document.getElementById('add-project-btn').addEventListener('click', openAddModal);
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('project-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('project-modal')) closeModal();
  });

  document.getElementById('project-form').addEventListener('submit', e => {
    e.preventDefault();
    const projects = loadProjects();
    const data = {
      id: editingId || nextId(),
      name: document.getElementById('p-name').value.trim(),
      desc: document.getElementById('p-desc').value.trim(),
      url:  document.getElementById('p-url').value.trim(),
      tag:  document.getElementById('p-tag').value.trim(),
      status: document.getElementById('p-status').value
    };
    if (!data.name) return;
    if (editingId) {
      const idx = projects.findIndex(p => p.id === editingId);
      if (idx !== -1) projects[idx] = data;
    } else {
      projects.push(data);
    }
    saveProjects(projects);
    renderProjects();
    closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
});

// Expose pour les onclick inline
window.openEditModal = openEditModal;
window.deleteProject = deleteProject;
