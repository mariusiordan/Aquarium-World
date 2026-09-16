const SPOTLIGHT_DURATION = 5000;

/**
 * Removes the temporary emphasis from the opening times bar after 5 seconds.
 */
function initOpeningBar() {
  const bar = document.getElementById('opening-bar');
  if (!bar) return;

  window.setTimeout(() => {
    bar.classList.remove('is-spotlight');
  }, SPOTLIGHT_DURATION);
}

/**
 * Expands or collapses every FAQ answer at once.
 */
function initFaqExpandAll() {
  const toggle = document.querySelector('[data-faq-expand]');
  if (!toggle) return;

  const items = document.querySelectorAll('.faq-item');
  let allOpen = false;

  toggle.addEventListener('click', () => {
    allOpen = !allOpen;
    items.forEach((item) => { item.open = allOpen; });
    toggle.textContent = allOpen ? 'Close all answers' : 'Open all answers';
  });
}

/**
 * Moves focus to the error summary after a failed submission.
 */
function initErrorSummaryFocus() {
  const summary = document.getElementById('error-summary');
  if (summary) summary.focus();
}

/**
 * Client-side validation for the contact form.
 */
function initContactValidation() {
  const form = document.querySelector('.form');
  if (!form) return;

  const rules = {
    name: (value) => {
      if (!value.trim()) return 'Enter your name.';
      if (value.length > 100) return 'Your name must be 100 characters or fewer.';
      return null;
    },
    email: (value) => {
      if (!value.trim()) return 'Enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        return 'Enter an email address in the correct format, like name@example.com';
      }
      return null;
    },
    subject: (value) => {
      if (!value) return 'Choose a subject from the list.';
      return null;
    },
    message: (value) => {
      if (!value.trim()) return 'Enter your message.';
      if (value.trim().length < 10) return 'Your message must be at least 10 characters.';
      return null;
    }
  };

  const clearError = (field) => {
    const group = field.closest('.form__group');
    const existing = group.querySelector('.form__error');
    if (existing) existing.remove();
    group.classList.remove('has-error');
    field.removeAttribute('aria-invalid');
  };

  const showError = (field, message) => {
    const group = field.closest('.form__group');
    clearError(field);

    const error = document.createElement('p');
    error.className = 'form__error';
    error.id = `${field.id}-error`;
    error.innerHTML = `<span class="visually-hidden">Error:</span> ${message}`;

    field.parentNode.insertBefore(error, field);
    group.classList.add('has-error');
    field.setAttribute('aria-invalid', 'true');
  };

  const validateField = (field) => {
    const rule = rules[field.name];
    if (!rule) return true;

    const error = rule(field.value);
    if (error) {
      showError(field, error);
      return false;
    }
    clearError(field);
    return true;
  };

  // Validate on blur so the user is told about a problem as they move on,
  // rather than being interrupted mid-typing
  Object.keys(rules).forEach((name) => {
    const field = form.elements[name];
    if (field) {
      field.addEventListener('blur', () => validateField(field));
    }
  });

  form.addEventListener('submit', (event) => {
    let firstInvalid = null;

    Object.keys(rules).forEach((name) => {
      const field = form.elements[name];
      if (field && !validateField(field) && !firstInvalid) {
        firstInvalid = field;
      }
    });

    if (firstInvalid) {
      event.preventDefault();
      firstInvalid.focus();
    }
  });
}

initOpeningBar();
initFaqExpandAll();
initErrorSummaryFocus();
initContactValidation();