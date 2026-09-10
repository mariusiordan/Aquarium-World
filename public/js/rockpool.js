(function () {
  'use strict';

  var container = document.querySelector('[data-rockpool]');
  if (!container) return;

  var CREATURES = [
    { name: 'Shore crab', emoji: '🦀', fact: 'Shore crabs can survive out of water for hours if they stay damp.' },
    { name: 'Beadlet anemone', emoji: '🌺', fact: 'Out of water it pulls its tentacles in and looks like a blob of red jelly.' },
    { name: 'Common starfish', emoji: '⭐', fact: 'If a starfish loses an arm, it can grow a new one.' },
    { name: 'Common blenny', emoji: '🐟', fact: 'Also called a shanny. It can breathe air and survive in damp cracks.' },
    { name: 'Common limpet', emoji: '🐚', fact: 'A limpet returns to exactly the same spot on its rock every low tide.' },
    { name: 'Hermit crab', emoji: '🐌', fact: 'Hermit crabs have soft bodies, so they borrow empty shells for protection.' },
    { name: 'Sea lettuce', emoji: '🌿', fact: 'A bright green seaweed that is edible and grows in shallow pools.' },
    { name: 'Cushion star', emoji: '✨', fact: 'A small, fat starfish only about two centimetres across.' }
  ];

  var grid = container.querySelector('[data-rockpool-grid]');
  var foundCount = container.querySelector('[data-found-count]');
  var totalCount = container.querySelector('[data-total-count]');
  var status = container.querySelector('[data-rockpool-status]');
  var foundPanel = container.querySelector('[data-rockpool-found]');
  var foundList = container.querySelector('[data-rockpool-list]');
  var resetButton = container.querySelector('[data-rockpool-reset]');

  var found = 0;

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

    function liftRock(button, creature) {
    if (button.dataset.lifted === 'true') return;

    button.dataset.lifted = 'true';
    button.classList.add('is-lifted');
    button.setAttribute('aria-pressed', 'true');
    button.setAttribute('aria-label', creature.name + ' found. ' + creature.fact);

    // The creature is already in the DOM beneath the rock cover, so lifting is
    // a CSS transition on the cover rather than a content swap
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

    if (found === CREATURES.length) {
      status.textContent = 'You found all ' + CREATURES.length + ' creatures. Well done!';
    } else {
      status.textContent = creature.name + ' found. ' + (CREATURES.length - found) + ' left to find.';
    }
  }

  function build() {
    grid.innerHTML = '';
    foundList.innerHTML = '';
    foundPanel.hidden = true;
    found = 0;
    foundCount.textContent = '0';
    totalCount.textContent = String(CREATURES.length);
    status.textContent = '';

    shuffle(CREATURES).forEach(function (creature, index) {
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

  build();
})();