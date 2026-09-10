/**
 * Rockpool Explorer.
 *
 * A reveal game where each rock hides one shore creature. The state of the
 * tide is derived from the visitor's own clock rather than fetched from an
 * external service: the site must run without network access, and a failed
 * request would break the page. The cycle uses the semidiurnal period of
 * roughly 12 hours 25 minutes, which is deterministic and needs no API.
 *
 * Every rock is a real <button>, so the game is fully playable with a keyboard
 * and each rock is announced with its pressed state. Progress and tide changes
 * are reported through a live region rather than by visual change alone.
 */
(function () {
  'use strict';

  var container = document.querySelector('[data-rockpool]');
  if (!container) return;

  var CREATURES = [
    { name: 'Shore crab', emoji: '🦀', fact: 'Shore crabs can survive out of water for hours if they stay damp.', hardy: true },
    { name: 'Beadlet anemone', emoji: '🌺', fact: 'Out of water it pulls its tentacles in and looks like a blob of red jelly.', hardy: true },
    { name: 'Common starfish', emoji: '⭐', fact: 'If a starfish loses an arm, it can grow a new one.', hardy: false },
    { name: 'Common blenny', emoji: '🐟', fact: 'Also called a shanny. It can breathe air and survive in damp cracks.', hardy: true },
    { name: 'Common limpet', emoji: '🐚', fact: 'A limpet returns to exactly the same spot on its rock every low tide.', hardy: true },
    { name: 'Hermit crab', emoji: '🐌', fact: 'Hermit crabs have soft bodies, so they borrow empty shells for protection.', hardy: false },
    { name: 'Sea lettuce', emoji: '🌿', fact: 'A bright green seaweed that is edible and grows in shallow pools.', hardy: true },
    { name: 'Cushion star', emoji: '✨', fact: 'A small, fat starfish only about two centimetres across.', hardy: false }
  ];

  var TIDE_STATES = {
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

  var TIDE_ORDER = ['low', 'mid', 'high'];

  var grid = container.querySelector('[data-rockpool-grid]');
  var foundCount = container.querySelector('[data-found-count]');
  var totalCount = container.querySelector('[data-total-count]');
  var status = container.querySelector('[data-rockpool-status]');
  var foundPanel = container.querySelector('[data-rockpool-found]');
  var foundList = container.querySelector('[data-rockpool-list]');
  var resetButton = container.querySelector('[data-rockpool-reset]');
  var cycleButton = container.querySelector('[data-tide-cycle]');
  var tidePanel = container.querySelector('[data-tide]');
  var tideLabel = container.querySelector('[data-tide-label]');
  var tideNote = container.querySelector('[data-tide-note]');

  var found = 0;
  var available = [];
  var tideOverride = null;

  /**
   * Returns the current tide state. A visitor-selected override takes
   * precedence; otherwise the phase is calculated from the time of day.
   */
  function getTide() {
    if (tideOverride) return TIDE_STATES[tideOverride];

    var CYCLE_MINUTES = 745; // 12h 25m
    var now = new Date();
    var minutesToday = now.getHours() * 60 + now.getMinutes();
    var position = (minutesToday % CYCLE_MINUTES) / CYCLE_MINUTES;

    if (position < 0.25 || position > 0.75) return TIDE_STATES.low;
    if (position < 0.4 || position > 0.6) return TIDE_STATES.mid;
    return TIDE_STATES.high;
  }

  function shuffle(items) {
    var copy = items.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  function creaturesForTide(tide) {
    if (tide.state === 'low') return CREATURES;
    if (tide.state === 'mid') return CREATURES.filter(function (c) { return c.hardy; });
    return CREATURES.filter(function (c) { return c.hardy; }).slice(0, 3);
  }

  function liftRock(button, creature) {
    if (button.dataset.lifted === 'true') return;

    button.dataset.lifted = 'true';
    button.classList.add('is-lifted');
    button.setAttribute('aria-pressed', 'true');
    button.setAttribute('aria-label', creature.name + ' found. ' + creature.fact);

    var reveal = button.querySelector('.rock__reveal');
    reveal.innerHTML =
      '<span class="rock__creature" aria-hidden="true">' + creature.emoji + '</span>' +
      '<span class="rock__name">' + creature.name + '</span>';

    found++;
    foundCount.textContent = String(found);

    var entry = document.createElement('li');
    entry.className = 'rockpool__entry';
    entry.innerHTML = '<strong>' + creature.name + '</strong> ' + creature.fact;
    foundList.appendChild(entry);
    foundPanel.hidden = false;

    if (found === available.length) {
      status.textContent = 'You found all ' + available.length + ' creatures sheltering at this tide. Well done!';
    } else {
      status.textContent = creature.name + ' found. ' + (available.length - found) + ' left to find.';
    }
  }

  function build() {
    var tide = getTide();
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

    shuffle(available).forEach(function (creature, index) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'rock';
      button.dataset.lifted = 'false';
      button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-label', 'Rock ' + (index + 1) + '. Lift to see what is underneath.');

      button.innerHTML =
        '<span class="rock__reveal"></span>' +
        '<span class="rock__cover" aria-hidden="true">Rock ' + (index + 1) + '</span>';

      button.addEventListener('click', function () {
        liftRock(button, creature);
      });

      grid.appendChild(button);
    });
  }

  resetButton.addEventListener('click', function () {
    build();
    status.textContent = 'Rockpool reset. All rocks are back in place.';
  });

  if (cycleButton) {
    cycleButton.addEventListener('click', function () {
      var current = tideOverride || getTide().state;
      tideOverride = TIDE_ORDER[(TIDE_ORDER.indexOf(current) + 1) % TIDE_ORDER.length];
      build();
      status.textContent = 'Tide changed to ' + TIDE_STATES[tideOverride].label.toLowerCase() + '.';
    });
  }

  build();
})();