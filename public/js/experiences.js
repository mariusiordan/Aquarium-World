(function () {
  'use strict';

  var container = document.querySelector('[data-filter]');
  if (!container) return;

  var input = container.querySelector('[data-search-input]');
  var buttons = container.querySelectorAll('[data-filter-value]');
  var zoneButtons = container.querySelectorAll('[data-zone-value]');
  var status = container.querySelector('[data-filter-status]');
  var results = document.querySelector('[data-results-container]');
  var initial = document.querySelector('[data-initial-content]');

  var activeType = 'all';
  var activeZone = 'all';
  var debounceTimer = null;
  var requestId = 0;

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
    return '<div class="experience__meta-row"><dt>' + label + '</dt><dd>' +
      escapeHtml(value) + '</dd></div>';
  }

  function setActiveButton(group, value, attribute) {
    group.forEach(function (button) {
      var isActive = button.dataset[attribute] === value;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  function render(data) {
    if (data.count === 0) {
      results.innerHTML =
        '<p class="filter__empty">No experiences match that search. Try a different word, ' +
        'or <button type="button" class="link-button" data-clear-search>show everything</button>.</p>';
      return;
    }

    var groups = {};
    data.results.forEach(function (item) {
      (groups[item.zone_name] ||= { slug: item.zone_slug, items: [] }).items.push(item);
    });

    var html = '';
    Object.keys(groups).forEach(function (zoneName) {
      var zone = groups[zoneName];
      html += '<section class="experience-zone">' +
        '<h2 class="experience-zone__heading">' +
          '<a href="/zones/' + escapeHtml(zone.slug) + '">' + escapeHtml(zoneName) + '</a>' +
        '</h2><ul class="experience-list">';

      zone.items.forEach(function (item) {
        html += '<li class="experience">' +
          '<div class="experience__header">' +
            '<h3 class="experience__name">' + escapeHtml(item.name) + '</h3>' +
            '<p class="experience__type">' + escapeHtml(item.type) + '</p>' +
          '</div>' +
          '<p class="experience__description">' + escapeHtml(item.description) + '</p>' +
          '<dl class="experience__meta">' +
            metaRow('Timing', item.duration) +
            metaRow('Access', item.accessibility) +
            metaRow('What to expect', item.sensory_note) +
          '</dl>' +
        '</li>';
      });

      html += '</ul></section>';
    });

    results.innerHTML = html;
  }

  function fetchResults() {
    var term = input.value.trim();
    var id = ++requestId;

    var url = '/api/experiences?q=' + encodeURIComponent(term) +
              '&type=' + encodeURIComponent(activeType) +
              '&zone=' + encodeURIComponent(activeZone);

    status.textContent = 'Searching…';

    fetch(url)
      .then(function (response) {
        if (!response.ok) throw new Error('Request failed');
        return response.json();
      })
      .then(function (data) {
        // Ignore a response that has been superseded by a newer request
        if (id !== requestId) return;

        initial.hidden = true;
        render(data);

        status.textContent = data.count === 0
          ? 'No experiences found.'
          : 'Showing ' + data.count + (data.count === 1 ? ' experience.' : ' experiences.');
      })
      .catch(function () {
        if (id !== requestId) return;
        status.textContent = 'Sorry, the search is unavailable. The full list is shown below.';
        results.innerHTML = '';
        initial.hidden = false;
      });
  }

  input.addEventListener('input', function () {
    window.clearTimeout(debounceTimer);

    activeType = 'all';
    activeZone = 'all';
    setActiveButton(buttons, 'all', 'filterValue');
    setActiveButton(zoneButtons, 'all', 'zoneValue');

    debounceTimer = window.setTimeout(fetchResults, 300);
  });

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeType = button.dataset.filterValue;
      activeZone = 'all';

      setActiveButton(buttons, activeType, 'filterValue');
      setActiveButton(zoneButtons, 'all', 'zoneValue');

      fetchResults();
    });
  });

  zoneButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeZone = button.dataset.zoneValue;
      activeType = 'all';

      setActiveButton(zoneButtons, activeZone, 'zoneValue');
      setActiveButton(buttons, 'all', 'filterValue');

      fetchResults();
    });
  });

  results.addEventListener('click', function (event) {
    if (event.target.matches('[data-clear-search]')) {
      input.value = '';
      activeType = 'all';
      activeZone = 'all';
      setActiveButton(buttons, 'all', 'filterValue');
      setActiveButton(zoneButtons, 'all', 'zoneValue');
      fetchResults();
      input.focus();
    }
  });
})();