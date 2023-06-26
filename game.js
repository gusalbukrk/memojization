const query = Object.fromEntries([...new URLSearchParams(location.search).entries()]);
// console.log(queries);

function calcScore(s) {
  return [5, 4, 3, 2, 1][s - 1] ?? 6 - s;
}

document.querySelector('#name').textContent = query.name;

document.querySelector('#timer');
//
let timer = 0;
//
const interval = setInterval(() => {
  timer++;
  document.querySelector('#timer').textContent = `${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}`;
}, 1000);

// https://stackoverflow.com/a/12646864
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

const emojis = shuffleArray(query.emojis.split(' ').map(e => [e, e]).flat());

// populate section with emojis
const section = document.querySelector('section');
emojis.forEach(emoji => {
  const template = document.querySelector('template#emoji').content.cloneNode(true);
  template.querySelector('span').textContent = emoji;
  section.appendChild(template);
})

// memory game logic
let firstCard = null;
//
function cardFlipHandler(e) {
  if (firstCard === e.target || e.target.classList.contains('waiting')) return;

  e.target.classList.remove('hidden');
  e.target.dataset.tries = parseInt(e.target.dataset.tries) + 1;

  if (firstCard === null) firstCard = e.target;
  else {
    if (firstCard.textContent === e.target.textContent) {
      firstCard.removeEventListener('click', cardFlipHandler);
      e.target.removeEventListener('click', cardFlipHandler);

      firstCard.classList.remove('pointer');
      e.target.classList.remove('pointer');

      document.querySelector('#punctuation').textContent = parseInt(document.querySelector('#punctuation').textContent) + calcScore(parseInt(firstCard.dataset.tries)) + calcScore(parseInt(e.target.dataset.tries));

      firstCard = null;

      if (document.querySelector('.emoji.hidden') === null) { // game has ended
        clearInterval(interval);
        document.querySelector('button').childNodes[0].textContent = 'Play again';
      }
    } else {
      document.querySelectorAll('.emoji').forEach(emoji => emoji.classList.add('waiting'));

      setTimeout(() => {
        firstCard.classList.add('hidden');
        e.target.classList.add('hidden');

        document.querySelectorAll('.emoji').forEach(emoji => emoji.classList.remove('waiting'));

        firstCard = null;
      }, 2000);
    }
  }
}
//
document.querySelectorAll('.emoji').forEach(emoji => emoji.addEventListener('click', cardFlipHandler));

document.querySelector('button').addEventListener('click', () => {
  location.reload();
});
