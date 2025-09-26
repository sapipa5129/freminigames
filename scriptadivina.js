let numberToGuess = 0;
let attempts = 0;
let max = 10;

const startBtn = document.getElementById('start-btn');
const difficulty = document.getElementById('difficulty');
const game = document.getElementById('game');
const guessInput = document.getElementById('guess');
const guessBtn = document.getElementById('guess-btn');
const message = document.getElementById('message');
const tries = document.getElementById('tries');
const recordDisplay = document.getElementById('record');
const result = document.getElementById('result');
const restartBtn = document.getElementById('restart-btn');

function updateRecordDisplay() {
  const record = localStorage.getItem('bestScore');
  recordDisplay.textContent = record ? `Récord: ${record} intentos` : 'Récord: —';
}

startBtn.addEventListener('click', () => {
  const level = difficulty.value;
  max = level === 'easy' ? 10 : level === 'medium' ? 50 : 100;
  numberToGuess = Math.floor(Math.random() * max) + 1;
  attempts = 0;
  tries.textContent = attempts;
  message.textContent = '';
  guessInput.value = '';
  result.textContent = '';
  result.classList.add('hidden');
  restartBtn.classList.add('hidden');
  game.classList.remove('hidden');
  updateRecordDisplay();
});

guessBtn.addEventListener('click', () => {
  const guess = Number(guessInput.value);
  if (!guess || guess < 1 || guess > max) {
    message.textContent = `Introduce un número entre 1 y ${max}`;
    return;
  }

  attempts++;
  tries.textContent = attempts;

  if (guess === numberToGuess) {
    message.textContent = '';
    result.textContent = `🎉 ¡Correcto! Era ${numberToGuess}. Lo lograste en ${attempts} intentos.`;
    result.classList.remove('hidden');
    restartBtn.classList.remove('hidden');
    game.classList.add('hidden');

    const bestScore = localStorage.getItem('bestScore');
    if (!bestScore || attempts < Number(bestScore)) {
      localStorage.setItem('bestScore', attempts);
      updateRecordDisplay();
    }
  } else {
    message.textContent = guess < numberToGuess ? 'Demasiado bajo 📉' : 'Demasiado alto 📈';
  }
});

restartBtn.addEventListener('click', () => {
  startBtn.click();
});
