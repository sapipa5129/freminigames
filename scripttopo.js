const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const difficultySelect = document.getElementById('difficulty');
const hitSound = document.getElementById('hitSound');

let score = 0;
let timeLeft = 30;
let moleInterval;
let speed = 1000;

function setDifficulty() {
  const level = difficultySelect.value;
  if (level === 'easy') speed = 1000;
  else if (level === 'medium') speed = 700;
  else if (level === 'hard') speed = 400;
}

function randomHole() {
  holes.forEach(h => {
    h.classList.remove('active');
    h.classList.remove('trap');
  });

  const index = Math.floor(Math.random() * holes.length);
  const isTrap = Math.random() < 0.2; // 20% probabilidad de caca

  if (isTrap) {
    holes[index].classList.add('trap');
  } else {
    holes[index].classList.add('active');
  }
}

function updateTime(seconds) {
  timeLeft = Math.max(0, timeLeft + seconds);
  timeDisplay.textContent = timeLeft;
}

function startGame() {
  setDifficulty();

  moleInterval = setInterval(() => {
    randomHole();
  }, speed);

  const countdown = setInterval(() => {
    updateTime(-1);
    if (timeLeft <= 0) {
      clearInterval(countdown);
      clearInterval(moleInterval);
      holes.forEach(h => h.classList.remove('active', 'trap'));
      alert(`¡Juego terminado! Tu puntuación fue: ${score}`);
    }
  }, 1000);
}

holes.forEach(hole => {
  hole.addEventListener('click', () => {
    if (hole.classList.contains('active')) {
      score += 2;
      scoreDisplay.textContent = score;
      hitSound.play();
      hole.classList.remove('active');
    } else if (hole.classList.contains('trap')) {
      score = Math.max(0, score - 3);
      scoreDisplay.textContent = score;
      updateTime(-5);
      hole.classList.remove('trap');
    }
  });
});

difficultySelect.addEventListener('change', () => {
  clearInterval(moleInterval);
  setDifficulty();
  startGame();
});

startGame();
