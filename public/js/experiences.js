/**
 * Experiences search and filter, backed by AJAX.
 */
(function () {
  'use strict';

  const container = document.querySelector('[data-filter]');
  if (!container) return;

  const input = container.querySelector('[data-search-input]');
  const buttons = container.querySelectorAll('[data-filter-value]');
  const zoneButtons = container.querySelectorAll('[data-zone-value]');
  const status = container.querySelector('[data-filter-status]');
  const results = document.querySelector('[data-results-container]');
  const initial = document.querySelector('[data-initial-content]');

  const DEBOUNCE_MS = 300;

  let activeType = 'all';
  let activeZone = 'all';
  let debounceTimer = null;
  let requestId = 0;

  function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function metaRow(label, value) {
    if (!value) return '';
    return `<div class="experience__meta-row"><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`;
  }

  function setActiveButton(group, value, attribute) {
    group.forEach((button) => {
      const isActive = button.dataset[attribute] === value;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  function resetFilters() {
    activeType = 'all';
    activeZone = 'all';
    setActiveButton(buttons, 'all', 'filterValue');
    setActiveButton(zoneButtons, 'all', 'zoneValue');
  }

  function render(data) {
    if (data.count === 0) {
      results.innerHTML =
        '<p class="filter__empty">No experiences match that search. Try a different word, ' +
        'or <button type="button" class="link-button" data-clear-search>show everything</button>.</p>';
      return;
    }

    const groups = {};
    data.results.forEach((item) => {
      (groups[item.zone_name] ||= { slug: item.zone_slug, items: [] }).items.push(item);
    });

    let html = '';
    Object.keys(groups).forEach((zoneName) => {
      const zone = groups[zoneName];
      html += `<section class="experience-zone">
        <h2 class="experience-zone__heading">
          <a href="/zones/${escapeHtml(zone.slug)}">${escapeHtml(zoneName)}</a>
        </h2>
        <ul class="experience-list">`;

      zone.items.forEach((item) => {
        html += `<li class="experience">
          <div class="experience__header">
            <h3 class="experience__name">${escapeHtml(item.name)}</h3>
            <p class="experience__type">${escapeHtml(item.type)}</p>
          </div>
          <p class="experience__description">${escapeHtml(item.description)}</p>
          <dl class="experience__meta">
            ${metaRow('Timing', item.duration)}
            ${metaRow('Access', item.accessibility)}
            ${metaRow('What to expect', item.sensory_note)}
          </dl>
        </li>`;
      });

      html += '</ul></section>';
    });

    results.innerHTML = html;
  }

  function fetchResults() {
    const term = input.value.trim();
    const id = ++requestId;

    const url = `/api/experiences?q=${encodeURIComponent(term)}` +
                `&type=${encodeURIComponent(activeType)}` +
                `&zone=${encodeURIComponent(activeZone)}`;

    status.textContent = 'Searching…';

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error('Request failed');
        return response.json();
      })
      .then((data) => {
        if (id !== requestId) return;

        initial.hidden = true;
        render(data);

        status.textContent = data.count === 0
          ? 'No experiences found.'
          : `Showing ${data.count}${data.count === 1 ? ' experience.' : ' experiences.'}`;
      })
      .catch(() => {
        if (id !== requestId) return;

        status.textContent = 'Sorry, the search is unavailable. The full list is shown below.';
        results.innerHTML = '';
        initial.hidden = false;
      });
  }

  input.addEventListener('input', () => {
    window.clearTimeout(debounceTimer);

    resetFilters();

    debounceTimer = window.setTimeout(fetchResults, DEBOUNCE_MS);
  });

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      activeType = button.dataset.filterValue;
      activeZone = 'all';

      setActiveButton(buttons, activeType, 'filterValue');
      setActiveButton(zoneButtons, 'all', 'zoneValue');

      fetchResults();
    });
  });

  zoneButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeZone = button.dataset.zoneValue;
      activeType = 'all';

      setActiveButton(zoneButtons, activeZone, 'zoneValue');
      setActiveButton(buttons, 'all', 'filterValue');

      fetchResults();
    });
  });

  results.addEventListener('click', (event) => {
    if (event.target.matches('[data-clear-search]')) {
      input.value = '';
      resetFilters();
      fetchResults();
      input.focus();
    }
  });
})();