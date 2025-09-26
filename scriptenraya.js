const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const vsAI = document.getElementById('vsAI');
const difficultySelect = document.getElementById('difficulty');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;

const winningCombos = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function checkWinner() {
  for (let combo of winningCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      gameActive = false;
      statusText.textContent = `${board[a]} ha ganado!`;
      return;
    }
  }
  if (!board.includes(null)) {
    gameActive = false;
    statusText.textContent = '¡Empate!';
  }
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || board[index]) return;

  placeMove(index, currentPlayer);
  checkWinner();

  if (gameActive) {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Turno de ${currentPlayer}`;
    if (vsAI.checked && currentPlayer === 'O') {
      setTimeout(() => aiMove(difficultySelect.value), 500);
    }
  }
}

function placeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player);
}

function isWinning(player) {
  return winningCombos.some(([a, b, c]) =>
    board[a] === player && board[b] === player && board[c] === player
  );
}

function aiMove(difficulty) {
  let empty = board.map((val, i) => val === null ? i : null).filter(i => i !== null);

  let move;

  if (difficulty === 'easy') {
    move = empty[Math.floor(Math.random() * empty.length)];
  } else if (difficulty === 'medium') {
    move = findBestMove('O') || findBestMove('X') || empty[Math.floor(Math.random() * empty.length)];
  } else if (difficulty === 'hard') {
    move = minimax(board, 'O').index;
  }

  placeMove(move, 'O');
  checkWinner();
  if (gameActive) {
    currentPlayer = 'X';
    statusText.textContent = `Turno de ${currentPlayer}`;
  }
}

function findBestMove(player) {
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = player;
      if (isWinning(player)) {
        board[i] = null;
        return i;
      }
      board[i] = null;
    }
  }
  return null;
}

// Minimax para dificultad "difícil"
function minimax(newBoard, player) {
  const availSpots = newBoard.map((val, i) => val === null ? i : null).filter(i => i !== null);

  if (isWinning('X')) return { score: -10 };
  if (isWinning('O')) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  const moves = [];

  for (let i of availSpots) {
    const move = {};
    move.index = i;
    newBoard[i] = player;

    if (player === 'O') {
      const result = minimax(newBoard, 'X');
      move.score = result.score;
    } else {
      const result = minimax(newBoard, 'O');
      move.score = result.score;
    }

    newBoard[i] = null;
    moves.push(move);
  }

  let bestMove;
  if (player === 'O') {
    let bestScore = -Infinity;
    for (let m of moves) {
      if (m.score > bestScore) {
        bestScore = m.score;
        bestMove = m;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let m of moves) {
      if (m.score < bestScore) {
        bestScore = m.score;
        bestMove = m;
      }
    }
  }

  return bestMove;
}

function restartGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameActive = true;
  statusText.textContent = `Turno de ${currentPlayer}`;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('X', 'O');
  });
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restartGame);
