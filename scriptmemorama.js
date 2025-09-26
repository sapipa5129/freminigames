const board = document.getElementById("board");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const finalScore = document.getElementById("final-score");
const gameOver = document.getElementById("game-over");

const emojisBase = [..."😀😃😄😁😆😅😂🤣😊😇🙂🙃😉😌😍🥰😘😗😙😚😋😛😝😜🤪🤨🧐🤓😎🥸🤩😏😒😞😔😟😕🙁☹️😣😖😫😩🥺😢😭😤😠😡🤬🤯😳🥵🥶😱😨😰😥😓🤗🤔🤭🤫🤥😶😐😑"];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let score = 0;
let timer = 0;
let interval;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function startTimer() {
  clearInterval(interval);
  timer = 0;
  timerDisplay.textContent = `Tiempo: 0s`;
  interval = setInterval(() => {
    timer++;
    timerDisplay.textContent = `Tiempo: ${timer}s`;
  }, 1000);
}

function startGame(difficulty) {
  let rows, cols, pairs;

  if (difficulty === "facil") {
    rows = 4; cols = 4; pairs = 8;
  } else if (difficulty === "medio") {
    rows = 4; cols = 8; pairs = 16;
  } else {
    rows = 8; cols = 16; pairs = 64;
  }

  const selectedEmojis = shuffle(emojisBase).slice(0, pairs);
  cards = shuffle([...selectedEmojis, ...selectedEmojis]);

  board.style.gridTemplateColumns = `repeat(${cols}, 60px)`;
  board.innerHTML = "";
  score = 0;
  matchedPairs = 0;
  flippedCards = [];
  scoreDisplay.textContent = `Puntuación: ${score}`;
  gameOver.style.display = "none";
  document.getElementById("difficulty-selector").style.display = "none";

  cards.forEach((emoji, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.index = index;
    card.dataset.emoji = emoji;
    card.textContent = "";
    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });

  startTimer();
}

function flipCard(e) {
  const card = e.target;
  if (card.classList.contains("flipped") || flippedCards.length === 2) return;

  card.classList.add("flipped");
  card.textContent = card.dataset.emoji;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.emoji === card2.dataset.emoji) {
    score += 10;
    matchedPairs++;
    flippedCards = [];
    if (matchedPairs === cards.length / 2) {
      clearInterval(interval);
      finalScore.textContent = `Tu puntuación fue: ${score} en ${timer}s`;
      gameOver.style.display = "block";
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      card1.textContent = "";
      card2.textContent = "";
      flippedCards = [];
    }, 800);
  }
  scoreDisplay.textContent = `Puntuación: ${score}`;
}

function resetGame() {
  board.innerHTML = "";
  gameOver.style.display = "none";
  document.getElementById("difficulty-selector").style.display = "block";
  clearInterval(interval);
}
