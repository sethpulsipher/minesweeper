const gridSize = 10;
const numMines = 10;
let grid = [];
let minesLeft = numMines;
let gameOver = false;
let timer = 0;
let timerInterval;

const gridElement = document.getElementById('grid');
const minesCountElement = document.getElementById('mines-count');
const newGameBtn = document.getElementById('new-game-btn');
const timerElement = document.getElementById('timer');

function createGrid() {
    grid = [];
    for (let i = 0; i < gridSize; i++) {
        grid[i] = [];
        for (let j = 0; j < gridSize; j++) {
            grid[i][j] = {
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                neighborMines: 0
            };
        }
    }
}

function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < numMines) {
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);
        if (!grid[row][col].isMine) {
            grid[row][col].isMine = true;
            minesPlaced++;
        }
    }
}

function calculateNeighborMines() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (!grid[i][j].isMine) {
                grid[i][j].neighborMines = countNeighborMines(i, j);
            }
        }
    }
}

function countNeighborMines(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                if (grid[newRow][newCol].isMine) {
                    count++;
                }
            }
        }
    }
    return count;
}

function renderGrid() {
    gridElement.innerHTML = '';
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleCellClick);
            cell.addEventListener('contextmenu', handleCellRightClick);
            gridElement.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    if (gameOver) return;
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    revealCell(row, col);
}

function handleCellRightClick(event) {
    event.preventDefault();
    if (gameOver) return;
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    toggleFlag(row, col);
}

function revealCell(row, col) {
    if (grid[row][col].isRevealed || grid[row][col].isFlagged) return;

    grid[row][col].isRevealed = true;
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cell.classList.add('revealed');

    if (grid[row][col].isMine) {
        cell.classList.add('mine');
        gameOver = true;
        revealAllMines();
        alert('Game Over! You hit a mine.');
    } else {
        if (grid[row][col].neighborMines > 0) {
            cell.textContent = grid[row][col].neighborMines;
        } else {
            // Reveal neighboring cells if no adjacent mines
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newRow = row + i;
                    const newCol = col + j;
                    if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                        revealCell(newRow, newCol);
                    }
                }
            }
        }
    }

    checkWinCondition();
}

function toggleFlag(row, col) {
    if (grid[row][col].isRevealed) return;

    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (grid[row][col].isFlagged) {
        grid[row][col].isFlagged = false;
        cell.classList.remove('flagged');
        cell.textContent = '';
        minesLeft++;
    } else {
        grid[row][col].isFlagged = true;
        cell.classList.add('flagged');
        cell.textContent = '🚩';
        minesLeft--;
    }

    updateMinesCount();
    checkWinCondition();
}

function revealAllMines() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j].isMine) {
                const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                cell.classList.add('revealed', 'mine');
            }
        }
    }
}

function checkWinCondition() {
    let unrevealedSafeCells = 0;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (!grid[i][j].isMine && !grid[i][j].isRevealed) {
                unrevealedSafeCells++;
            }
        }
    }

    if (unrevealedSafeCells === 0) {
        gameOver = true;
        alert('Congratulations! You won!');
        clearInterval(timerInterval);
    }
}

function updateMinesCount() {
    minesCountElement.textContent = `Mines: ${minesLeft}`;
}

function updateTimer() {
    timer++;
    timerElement.textContent = `Time: ${timer}`;
}

function startNewGame() {
    clearInterval(timerInterval);
    timer = 0;
    timerElement.textContent = 'Time: 0';
    minesLeft = numMines;
    gameOver = false;
    createGrid();
    placeMines();
    calculateNeighborMines();
    renderGrid();
    updateMinesCount();
    timerInterval = setInterval(updateTimer, 1000);
}

newGameBtn.addEventListener('click', startNewGame);

// Initialize the game
startNewGame();