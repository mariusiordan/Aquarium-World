(function () {
  'use strict';

  var container = document.querySelector('[data-filter]');
  if (!container) return;

  var buttons = container.querySelectorAll('[data-filter-value]');
  var status = container.querySelector('[data-filter-status]');
  var experiences = document.querySelectorAll('.experience[data-type]');
  var sections = document.querySelectorAll('[data-zone-section]');

  function applyFilter(value) {
    var visible = 0;

    experiences.forEach(function (item) {
      var matches = value === 'all' || item.dataset.type === value;
      item.hidden = !matches;
      if (matches) visible++;
    });

    sections.forEach(function (section) {
      var shown = section.querySelectorAll('.experience:not([hidden])').length;
      section.hidden = shown === 0;
    });

    buttons.forEach(function (button) {
      var isActive = button.dataset.filterValue === value;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    status.textContent = value === 'all'
      ? 'Showing all ' + visible + ' experiences.'
      : 'Showing ' + visible + ' of type ' + value + '.';
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      applyFilter(button.dataset.filterValue);
    });
  });
})();

(function () {
  'use strict';

  var toggle = document.querySelector('[data-faq-expand]');
  if (!toggle) return;

  var items = document.querySelectorAll('.faq-item');
  var allOpen = false;

  toggle.addEventListener('click', function () {
    allOpen = !allOpen;
    items.forEach(function (item) { item.open = allOpen; });
    toggle.textContent = allOpen ? 'Close all answers' : 'Open all answers';
  });
})();

(function () {
  'use strict';

  var summary = document.getElementById('error-summary');
  if (summary) summary.focus();
})();