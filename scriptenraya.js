const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.querySelector('.board');
const winningMessageElement = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');
const restartWinningButton = document.getElementById('restartWinningButton');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const gameModeSelect = document.getElementById('gameMode');
const difficultySelect = document.getElementById('difficulty');
const difficultyOption = document.getElementById('difficulty-option');

let circleTurn;
let gameMode = 'pvp';
let difficulty = 'easy';

startGame();

restartButton.addEventListener('click', startGame);
restartWinningButton.addEventListener('click', startGame);
gameModeSelect.addEventListener('change', (e) => {
    gameMode = e.target.value;
    if (gameMode === 'pvc') {
        difficultyOption.style.display = 'flex';
    } else {
        difficultyOption.style.display = 'none';
    }
    startGame();
});
difficultySelect.addEventListener('change', (e) => {
    difficulty = e.target.value;
    startGame();
});

function startGame() {
    circleTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    winningMessageElement.classList.remove('show');
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
        if (gameMode === 'pvc' && circleTurn) {
            setTimeout(computerMove, 500);
        }
    }
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = 'Empate!';
    } else {
        winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Gana!`;
    }
    winningMessageElement.classList.add('show');
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    circleTurn = !circleTurn;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);
    if (circleTurn) {
        board.classList.add(CIRCLE_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function computerMove() {
    const availableCells = [...cellElements].filter(cell => {
        return !cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS);
    });

    let move;
    if (difficulty === 'hard') {
        move = findBestMove();
    } else if (difficulty === 'medium') {
        const winningMove = findWinningMove(CIRCLE_CLASS);
        const blockingMove = findWinningMove(X_CLASS);
        if (winningMove !== null) {
            move = winningMove;
        } else if (blockingMove !== null) {
            move = blockingMove;
        } else {
            const randomIndex = Math.floor(Math.random() * availableCells.length);
            move = availableCells[randomIndex];
        }
    } else { // easy
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        move = availableCells[randomIndex];
    }

    if (move) {
        const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
        placeMark(move, currentClass);
        if (checkWin(currentClass)) {
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else {
            swapTurns();
            setBoardHoverClass();
        }
    }
}

function findWinningMove(playerClass) {
    for (const combination of WINNING_COMBINATIONS) {
        const [a, b, c] = combination;
        const cells = [cellElements[a], cellElements[b], cellElements[c]];
        const marks = cells.map(cell => {
            if (cell.classList.contains(playerClass)) return 1;
            if (cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)) return -1;
            return 0;
        });

        if (marks.reduce((a, b) => a + b, 0) === 2) {
            const emptyCellIndex = marks.indexOf(0);
            if (emptyCellIndex !== -1) {
                return cells[emptyCellIndex];
            }
        }
    }
    return null;
}

function findBestMove() {
    let bestScore = -Infinity;
    let move;
    const availableCells = [...cellElements].filter(cell => {
        return !cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS);
    });

    for (let i = 0; i < cellElements.length; i++) {
        if (!cellElements[i].classList.contains(X_CLASS) && !cellElements[i].classList.contains(CIRCLE_CLASS)) {
            cellElements[i].classList.add(CIRCLE_CLASS);
            let score = minimax(false);
            cellElements[i].classList.remove(CIRCLE_CLASS);
            if (score > bestScore) {
                bestScore = score;
                move = cellElements[i];
            }
        }
    }
    return move;
}

function minimax(isMaximizing) {
    if (checkWin(CIRCLE_CLASS)) {
        return 10;
    } else if (checkWin(X_CLASS)) {
        return -10;
    } else if (isDraw()) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < cellElements.length; i++) {
            if (!cellElements[i].classList.contains(X_CLASS) && !cellElements[i].classList.contains(CIRCLE_CLASS)) {
                cellElements[i].classList.add(CIRCLE_CLASS);
                let score = minimax(false);
                cellElements[i].classList.remove(CIRCLE_CLASS);
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < cellElements.length; i++) {
            if (!cellElements[i].classList.contains(X_CLASS) && !cellElements[i].classList.contains(CIRCLE_CLASS)) {
                cellElements[i].classList.add(X_CLASS);
                let score = minimax(true);
                cellElements[i].classList.remove(X_CLASS);
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}
