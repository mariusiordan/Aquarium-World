/**
 * Rockpool Explorer. Loaded as an ES module, so it can be deferred and run after the DOM is ready. 
 */

const CREATURES = [
  { name: 'Shore crab', emoji: '🦀', fact: 'Shore crabs can survive out of water for hours if they stay damp.', hardy: true },
  { name: 'Beadlet anemone', emoji: '🌺', fact: 'Out of water it pulls its tentacles in and looks like a blob of red jelly.', hardy: true },
  { name: 'Common starfish', emoji: '⭐', fact: 'If a starfish loses an arm, it can grow a new one.', hardy: false },
  { name: 'Common blenny', emoji: '🐟', fact: 'Also called a shanny. It can breathe air and survive in damp cracks.', hardy: true },
  { name: 'Common limpet', emoji: '🐚', fact: 'A limpet returns to exactly the same spot on its rock every low tide.', hardy: true },
  { name: 'Hermit crab', emoji: '🐌', fact: 'Hermit crabs have soft bodies, so they borrow empty shells for protection.', hardy: false },
  { name: 'Sea lettuce', emoji: '🌿', fact: 'A bright green seaweed that is edible and grows in shallow pools.', hardy: true },
  { name: 'Cushion star', emoji: '✨', fact: 'A small, fat starfish only about two centimetres across.', hardy: false }
];

const TIDE_STATES = {
  low: {
    state: 'low',
    label: 'Low tide',
    note: 'The pool is exposed. Every creature is sheltering under a rock, so all eight can be found.'
  },
  mid: {
    state: 'mid',
    label: 'Tide turning',
    note: 'Water is moving across the pool. The more delicate animals have already retreated, so only the hardier ones remain in reach.'
  },
  high: {
    state: 'high',
    label: 'High tide',
    note: 'The pool is underwater and the animals have spread out to feed. Only a few are still sheltering close enough to find.'
  }
};

const TIDE_ORDER = ['low', 'mid', 'high'];
const CYCLE_MINUTES = 745; // 12h 25m, one full semidiurnal tidal cycle

/** Fisher-Yates shuffle, so rocks hide different creatures on each visit. */
function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function creaturesForTide(tide) {
  const hardy = CREATURES.filter((creature) => creature.hardy);

  if (tide.state === 'low') return CREATURES;
  if (tide.state === 'mid') return hardy;
  return hardy.slice(0, 3);
}

function initRockpoolExplorer() {
  const container = document.querySelector('[data-rockpool]');
  if (!container) return;

  const grid = container.querySelector('[data-rockpool-grid]');
  const foundCount = container.querySelector('[data-found-count]');
  const totalCount = container.querySelector('[data-total-count]');
  const status = container.querySelector('[data-rockpool-status]');
  const foundPanel = container.querySelector('[data-rockpool-found]');
  const foundList = container.querySelector('[data-rockpool-list]');
  const resetButton = container.querySelector('[data-rockpool-reset]');
  const cycleButton = container.querySelector('[data-tide-cycle]');
  const tidePanel = container.querySelector('[data-tide]');
  const tideLabel = container.querySelector('[data-tide-label]');
  const tideNote = container.querySelector('[data-tide-note]');

  let found = 0;
  let available = [];
  let tideOverride = null;

  /**
   * Returns the current tide state. A visitor-selected override takes
   * precedence; otherwise the phase is calculated from the time of day.
   */
  const getTide = () => {
    if (tideOverride) return TIDE_STATES[tideOverride];

    const now = new Date();
    const minutesToday = now.getHours() * 60 + now.getMinutes();
    const position = (minutesToday % CYCLE_MINUTES) / CYCLE_MINUTES;

    if (position < 0.25 || position > 0.75) return TIDE_STATES.low;
    if (position < 0.4 || position > 0.6) return TIDE_STATES.mid;
    return TIDE_STATES.high;
  };

  const liftRock = (button, creature) => {
    if (button.dataset.lifted === 'true') return;

    button.dataset.lifted = 'true';
    button.classList.add('is-lifted');
    button.setAttribute('aria-pressed', 'true');
    button.setAttribute('aria-label', `${creature.name} found. ${creature.fact}`);

    // The creature already sits beneath the cover in the DOM, so lifting is a
    // CSS transition on the cover rather than a content swap
    const reveal = button.querySelector('.rock__reveal');
    reveal.innerHTML =
      `<span class="rock__creature" aria-hidden="true">${creature.emoji}</span>` +
      `<span class="rock__name">${creature.name}</span>`;

    found++;
    foundCount.textContent = String(found);

    const entry = document.createElement('li');
    entry.className = 'rockpool__entry';
    entry.innerHTML = `<strong>${creature.name}</strong> ${creature.fact}`;
    foundList.appendChild(entry);
    foundPanel.hidden = false;

    status.textContent = found === available.length
      ? `You found all ${available.length} creatures sheltering at this tide. Well done!`
      : `${creature.name} found. ${available.length - found} left to find.`;
  };

  const build = () => {
    const tide = getTide();
    available = creaturesForTide(tide);

    tidePanel.dataset.tideState = tide.state;
    tideLabel.textContent = tide.label;
    tideNote.textContent = tide.note;

    grid.innerHTML = '';
    foundList.innerHTML = '';
    foundPanel.hidden = true;
    found = 0;
    foundCount.textContent = '0';
    totalCount.textContent = String(available.length);
    status.textContent = '';

    shuffle(available).forEach((creature, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'rock';
      button.dataset.lifted = 'false';
      button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-label', `Rock ${index + 1}. Lift to see what is underneath.`);

      button.innerHTML =
        '<span class="rock__reveal"></span>' +
        `<span class="rock__cover" aria-hidden="true">Rock ${index + 1}</span>`;

      button.addEventListener('click', () => liftRock(button, creature));

      grid.appendChild(button);
    });
  };

  resetButton.addEventListener('click', () => {
    build();
    status.textContent = 'Rockpool reset. All rocks are back in place.';
  });

  if (cycleButton) {
    cycleButton.addEventListener('click', () => {
      const current = tideOverride ?? getTide().state;
      tideOverride = TIDE_ORDER[(TIDE_ORDER.indexOf(current) + 1) % TIDE_ORDER.length];
      build();
      status.textContent = `Tide changed to ${TIDE_STATES[tideOverride].label.toLowerCase()}.`;
    });
  }

  build();
}

initRockpoolExplorer();