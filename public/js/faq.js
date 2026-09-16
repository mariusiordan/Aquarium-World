/**
 * FAQ search, backed by AJAX.
 */

const DEBOUNCE_MS = 300;

function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function initFaqSearch() {
  const container = document.querySelector('[data-faq-search]');
  if (!container) return;

  const input = container.querySelector('[data-faq-search-input]');
  const status = container.querySelector('[data-faq-search-status]');
  const results = document.querySelector('[data-faq-results]');
  const initial = document.querySelector('[data-faq-initial]');

  let debounceTimer = null;
  let requestId = 0;

  const render = (data) => {
    if (data.count === 0) {
      results.innerHTML =
        '<p class="filter__empty">No questions match that search. Try a different word, ' +
        'or <button type="button" class="link-button" data-faq-clear>show all questions</button>.</p>';
      return;
    }

    // Results are rendered open, since the visitor has already told us what
    // they are looking for and we want to make it easy to read the answer.
    const items = data.results.map((faq) => `
      <li>
        <details class="faq-item" open>
          <summary class="faq-item__question">
            <span class="faq-item__question-text">${escapeHtml(faq.question)}</span>
            <span class="faq-item__marker" aria-hidden="true"></span>
          </summary>
          <div class="faq-item__answer">
            <p class="faq-item__category">${escapeHtml(faq.category)}</p>
            <p>${escapeHtml(faq.answer)}</p>
          </div>
        </details>
      </li>`).join('');

    results.innerHTML = `<ul class="faq-list">${items}</ul>`;
  };

  const fetchResults = async () => {
    const term = input.value.trim();
    const id = ++requestId;

    // An empty field means no search is active, so restore the full list
    if (term.length === 0) {
      results.innerHTML = '';
      initial.hidden = false;
      status.textContent = '';
      return;
    }

    status.textContent = 'Searching…';

    try {
      const response = await fetch(`/api/faqs?q=${encodeURIComponent(term)}`);
      if (!response.ok) throw new Error('Request failed');

      const data = await response.json();

      // Ignore a response superseded by a newer request
      if (id !== requestId) return;

      initial.hidden = true;
      render(data);

      status.textContent = data.count === 0
        ? 'No questions found.'
        : `Showing ${data.count}${data.count === 1 ? ' question.' : ' questions.'}`;
    } catch {
      if (id !== requestId) return;

      status.textContent = 'Sorry, the search is unavailable. All questions are shown below.';
      results.innerHTML = '';
      initial.hidden = false;
    }
  };

  input.addEventListener('input', () => {
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(fetchResults, DEBOUNCE_MS);
  });

  results.addEventListener('click', (event) => {
    if (event.target.matches('[data-faq-clear]')) {
      input.value = '';
      fetchResults();
      input.focus();
    }
  });
}

initFaqSearch();