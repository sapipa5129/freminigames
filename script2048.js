const container = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
let score = 0;
let grid = [];

function createGrid() {
  grid = Array(16).fill(0);
  container.innerHTML = '';
  for (let i = 0; i < 16; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.textContent = '';
    container.appendChild(tile);
  }
  addNewTile();
  addNewTile();
  updateGrid();
}

function addNewTile() {
  const emptyIndices = grid.map((val, i) => val === 0 ? i : null).filter(i => i !== null);
  if (emptyIndices.length === 0) return;
  const index = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  grid[index] = Math.random() < 0.9 ? 2 : 4;
}

function updateGrid() {
  const tiles = document.querySelectorAll('.tile');
  grid.forEach((val, i) => {
    tiles[i].textContent = val === 0 ? '' : val;
    tiles[i].style.backgroundColor = getColor(val);
  });
  scoreDisplay.textContent = `Puntuación: ${score}`;
}

function getColor(val) {
  const colors = {
    0: '#cdc1b4',
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e'
  };
  return colors[val] || '#3c3a32';
}

function slide(row) {
  let arr = row.filter(val => val);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i + 1] = 0;
    }
  }
  return arr.filter(val => val).concat(Array(4 - arr.filter(val => val).length).fill(0));
}

function move(direction) {
  let newGrid = Array(16).fill(0);
  for (let i = 0; i < 4; i++) {
    let row = [];
    for (let j = 0; j < 4; j++) {
      let index = direction === 'left' ? i * 4 + j :
                  direction === 'right' ? i * 4 + (3 - j) :
                  direction === 'up' ? j * 4 + i :
                  direction === 'down' ? (3 - j) * 4 + i : null;
      row.push(grid[index]);
    }
    let newRow = slide(row);
    for (let j = 0; j < 4; j++) {
      let index = direction === 'left' ? i * 4 + j :
                  direction === 'right' ? i * 4 + (3 - j) :
                  direction === 'up' ? j * 4 + i :
                  direction === 'down' ? (3 - j) * 4 + i : null;
      newGrid[index] = newRow[j];
    }
  }
  if (JSON.stringify(grid) !== JSON.stringify(newGrid)) {
    grid = newGrid;
    addNewTile();
    updateGrid();
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') move('left');
  if (e.key === 'ArrowRight') move('right');
  if (e.key === 'ArrowUp') move('up');
  if (e.key === 'ArrowDown') move('down');
});

createGrid();
