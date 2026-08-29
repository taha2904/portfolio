const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

const nav = $('.nav');
const navToggle = $('.nav-toggle');
const navLinks = $('.nav-links');

function closeNav() {
	if (!nav) return;
	nav.classList.remove('open');
	if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
}

if (nav && navToggle && navLinks) {
	navToggle.addEventListener('click', () => {
		const open = nav.classList.toggle('open');
		navToggle.setAttribute('aria-expanded', String(open));
	});
	navLinks.addEventListener('click', event => {
		if (event.target.closest('a')) closeNav();
	});
	document.addEventListener('click', event => {
		if (nav.classList.contains('open') && !nav.contains(event.target)) closeNav();
	});
}

const year = $('#year');
if (year) year.textContent = new Date().getFullYear();

const projectGrid = $('#projects-grid');
const filterBar = $('#tools-filter');
const categories = $('#categories-grid');
const exploreControls = $('#explore-controls');

if (projectGrid && filterBar) {
	const priority = ['site-research', 'multi-portal', 'jlr-thunderclap', 'jlr-aem', 'jlr-competitors', 'coventry-suite', 'ai-automation'];
	const cards = $$('.card', projectGrid);
	cards.sort((a, b) => {
		const aIndex = priority.indexOf(a.dataset.project);
		const bIndex = priority.indexOf(b.dataset.project);
		return (aIndex < 0 ? priority.length : aIndex) - (bIndex < 0 ? priority.length : bIndex);
	}).forEach(card => projectGrid.appendChild(card));

	projectGrid.classList.remove('hide-on-init', 'is-hidden');
	filterBar.classList.remove('hide-on-init', 'is-hidden');
	$$('.card', projectGrid).forEach(card => {
		card.hidden = false;
		card.style.display = '';
	});
	if (categories) categories.dataset.open = 'false';
	if (exploreControls) exploreControls.classList.add('is-hidden');

	filterBar.addEventListener('click', event => {
		const button = event.target.closest('[data-tool]');
		if (!button) return;
		const selected = button.dataset.tool.toLowerCase();
		$$('[data-tool]', filterBar).forEach(item => {
			const active = item === button;
			item.classList.toggle('active', active);
			item.setAttribute('aria-selected', String(active));
		});
		$$('.card', projectGrid).forEach(card => {
			const tools = (card.dataset.tools || '').toLowerCase();
			card.hidden = selected !== 'all' && !tools.includes(selected);
			card.style.display = '';
		});
	});
}

const projectDataElement = $('#projects-data');
let projects = {};
try {
	projects = projectDataElement ? JSON.parse(projectDataElement.textContent) : {};
} catch (error) {
	console.error('Project details could not be loaded.', error);
}

const modal = $('#project-modal');
const modalDialog = modal ? $('.modal-dialog', modal) : null;
const modalTitle = modal ? $('#modal-title', modal) : null;
const modalSubtitle = modal ? $('.modal-subtitle', modal) : null;
const modalBody = modal ? $('.modal-body', modal) : null;
let lastFocusedElement = null;

function renderProjectDetails(projectId) {
	const project = projects[projectId];
	if (!project) return '<p>More detail is available on request.</p>';
	return `
		<div class="panel">
			<p><strong>Context:</strong> ${project.context}</p>
			<p><strong>My role:</strong> ${project.role}</p>
		</div>
		<div class="panel">
			<ol>
				<li><strong>Problem:</strong> ${project.pao.problem}</li>
				<li><strong>Actions:</strong> ${project.pao.actions}</li>
				<li><strong>Outcome:</strong> ${project.pao.outcome}</li>
			</ol>
		</div>
		<div class="panel">
			<p><strong>Tools and keywords:</strong> ${project.keywords.join(', ')}</p>
		</div>`;
}

function openModal(projectId, trigger) {
	if (!modal || !modalDialog) return;
	const card = $(`.card[data-project="${projectId}"]`);
	lastFocusedElement = trigger || document.activeElement;
	if (modalTitle) modalTitle.textContent = card ? $('h3', card).textContent : projects[projectId]?.title || 'Project details';
	if (modalSubtitle) modalSubtitle.textContent = card ? $('.subtitle', card).textContent : '';
	if (modalBody) modalBody.innerHTML = renderProjectDetails(projectId);
	modal.setAttribute('aria-hidden', 'false');
	document.body.classList.add('modal-open');
	modalDialog.focus();
}

function closeModal() {
	if (!modal) return;
	modal.setAttribute('aria-hidden', 'true');
	document.body.classList.remove('modal-open');
	if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

$$('.view-details').forEach(button => {
	button.addEventListener('click', () => openModal(button.dataset.projectId, button));
});

if (modal) {
	modal.addEventListener('click', event => {
		if (event.target.matches('[data-modal-close]')) closeModal();
	});
}

document.addEventListener('keydown', event => {
	if (event.key === 'Escape') {
		closeNav();
		closeModal();
	}
});
