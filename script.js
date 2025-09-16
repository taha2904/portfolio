// Utilities
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Header nav (class-based for smoother control + accessibility)
const nav = $('.nav');
const navToggle = $('.nav-toggle');
const navLinks = $('.nav-links');

function openNav() {
	if (!nav) return;
	nav.classList.add('open');
	if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
}

function closeNav() {
	if (!nav) return;
	nav.classList.remove('open');
	if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
}

if (navToggle && nav && navLinks) {
	// Toggle on button
	navToggle.addEventListener('click', () => {
		const isOpen = nav.classList.contains('open');
		isOpen ? closeNav() : openNav();
	});

	// Close when clicking a nav link (mobile)
	navLinks.addEventListener('click', (e) => {
		const link = e.target.closest('a');
		if (link) closeNav();
	});

	// Click outside to close
	document.addEventListener('click', (e) => {
		if (!nav.classList.contains('open')) return;
		if (!nav.contains(e.target)) closeNav();
	});

	// Escape to close
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') closeNav();
	});
}

// Year
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Projects data
const projectsDataEl = $('#projects-data');
let projects = {};
try { projects = JSON.parse(projectsDataEl.textContent); } catch {}

// Tools filter
const filterBar = $('#tools-filter');
if (filterBar) {
	filterBar.addEventListener('click', (e) => {
		const btn = e.target.closest('[data-tool]');
		if (!btn) return;
		const tool = btn.getAttribute('data-tool');
		$$('.projects-grid .card').forEach(card => {
			if (tool === 'all') { card.style.display = ''; return; }
			const tags = (card.getAttribute('data-tools') || '').toLowerCase();
			card.style.display = tags.includes(tool.toLowerCase()) ? '' : 'none';
		});
		$$('#tools-filter .tool').forEach(b => b.classList.remove('active'));
		btn.classList.add('active');
		// ARIA state for selected tab-like control
		$$('#tools-filter .tool').forEach(b => b.setAttribute('aria-selected', 'false'));
		btn.setAttribute('aria-selected', 'true');
	});
}

// Render details HTML for modal from JSON (context, role, and PAO)
function renderDetails(projectId) {
	const data = projects[projectId];
	if (!data) return '';
	return `
		<div class="panel">
			<p><strong>Context:</strong> ${data.context}</p>
			<p><strong>Role:</strong> ${data.role}</p>
		</div>
		<div class="panel">
			<ol class="list">
				<li><strong>Problem:</strong> ${data.pao.problem}</li>
				<li><strong>Actions:</strong> ${data.pao.actions}</li>
				<li><strong>Outcome:</strong> ${data.pao.outcome}</li>
			</ol>
		</div>
		<div class="panel">
			<p><strong>Tools & Keywords:</strong> ${data.keywords.join(', ')}</p>
		</div>
	`;
}

// Modal logic
const modal = $('#project-modal');
const modalDialog = modal ? $('.modal-dialog', modal) : null;
const modalTitle = modal ? $('#modal-title', modal) : null;
const modalSubtitle = modal ? $('.modal-subtitle', modal) : null;
const modalBody = modal ? $('.modal-body', modal) : null;

function openModalForProject(projectId) {
	if (!modal) return;
	const card = $(`.card[data-project="${projectId}"]`);
	const title = card ? $('h3', card)?.textContent || '' : '';
	const subtitle = card ? $('.subtitle', card)?.textContent || '' : '';
	if (modalTitle) modalTitle.textContent = title;
	if (modalSubtitle) modalSubtitle.textContent = subtitle;
	if (modalBody) modalBody.innerHTML = renderDetails(projectId);
	modal.setAttribute('aria-hidden', 'false');
	// Focus trap entry
	if (modalDialog) modalDialog.focus();
}

function closeModal() {
	if (!modal) return;
	modal.setAttribute('aria-hidden', 'true');
}

// Wire buttons
$$('.view-details').forEach(btn => {
	btn.addEventListener('click', () => {
		const id = btn.getAttribute('data-project-id');
		if (id) openModalForProject(id);
	});
});

// Close handlers
document.addEventListener('click', (e) => {
	if (!modal || modal.getAttribute('aria-hidden') !== 'false') return;
	if (e.target?.matches('[data-modal-close]')) { closeModal(); }
	// backdrop click
	const backdrop = $('.modal-backdrop', modal);
	if (e.target === backdrop) { closeModal(); }
});

document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape') closeModal();
});