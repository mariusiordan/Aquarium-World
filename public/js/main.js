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

/**
 * Client-side validation for the contact form.
 */
(function () {
  'use strict';

  var form = document.querySelector('.form');
  if (!form) return;

  var rules = {
    name: function (value) {
      if (!value.trim()) return 'Enter your name.';
      if (value.length > 100) return 'Your name must be 100 characters or fewer.';
      return null;
    },
    email: function (value) {
      if (!value.trim()) return 'Enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        return 'Enter an email address in the correct format, like name@example.com';
      }
      return null;
    },
    subject: function (value) {
      if (!value) return 'Choose a subject from the list.';
      return null;
    },
    message: function (value) {
      if (!value.trim()) return 'Enter your message.';
      if (value.trim().length < 10) return 'Your message must be at least 10 characters.';
      return null;
    }
  };

  function clearError(field) {
    var group = field.closest('.form__group');
    var existing = group.querySelector('.form__error');
    if (existing) existing.remove();
    group.classList.remove('has-error');
    field.removeAttribute('aria-invalid');
  }

  function showError(field, message) {
    var group = field.closest('.form__group');
    clearError(field);

    var error = document.createElement('p');
    error.className = 'form__error';
    error.id = field.id + '-error';
    error.innerHTML = '<span class="visually-hidden">Error:</span> ' + message;

    field.parentNode.insertBefore(error, field);
    group.classList.add('has-error');
    field.setAttribute('aria-invalid', 'true');
  }

  function validateField(field) {
    var rule = rules[field.name];
    if (!rule) return true;

    var error = rule(field.value);
    if (error) {
      showError(field, error);
      return false;
    }
    clearError(field);
    return true;
  }
  
  Object.keys(rules).forEach(function (name) {
    var field = form.elements[name];
    if (field) {
      field.addEventListener('blur', function () { validateField(field); });
    }
  });

  form.addEventListener('submit', function (event) {
    var firstInvalid = null;

    Object.keys(rules).forEach(function (name) {
      var field = form.elements[name];
      if (field && !validateField(field) && !firstInvalid) {
        firstInvalid = field;
      }
    });

    if (firstInvalid) {
      event.preventDefault();
      firstInvalid.focus();
    }
  });
})();