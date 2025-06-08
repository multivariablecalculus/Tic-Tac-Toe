const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const modeSelect = document.getElementById("mode");
let board = Array(9).fill("");
let currentPlayer = "X";
let gameOver = false;

function render() {
  boardEl.innerHTML = "";
  board.forEach((cell, i) => {
    const div = document.createElement("div");
    div.className = "cell";
    div.textContent = cell;
    div.onclick = () => handleClick(i);
    div.style.cursor = cell || gameOver ? "not-allowed" : "pointer";
    div.style.transition = "0.2s";
    div.style.backgroundColor = cell === "X" ? "#ffdddd" : cell === "O" ? "#ddeeff" : "#fff";
    boardEl.appendChild(div);
  });
  statusEl.textContent = getStatusText();
}

function handleClick(i) {
  if (board[i] || gameOver) return;
  board[i] = currentPlayer;
  if (checkWinner()) {
    gameOver = true;
  } else if (board.every(Boolean)) {
    gameOver = true;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }
  render();
  if (!gameOver && currentPlayer === "O" && modeSelect.value === "cpu") {
    setTimeout(() => {
      const best = findBestMove();
      board[best] = "O";
      if (checkWinner()) {
        gameOver = true;
      } else if (board.every(Boolean)) {
        gameOver = true;
      } else {
        currentPlayer = "X";
      }
      render();
    }, 300);
  }
}

function checkWinner() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
  return wins.some(([a, b, c]) => {
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

function evaluate(b) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let [a, b_, c] of lines) {
    if (b[a] && b[a] === b[b_] && b[a] === b[c]) {
      if (b[a] === "O") return +10;
      if (b[a] === "X") return -10;
    }
  }
  return 0;
}

function isMovesLeft(b) {
  return b.some(cell => !cell);
}

function minimax(b, depth, isMax) {
  let score = evaluate(b);
  if (score !== 0) return score;
  if (!isMovesLeft(b)) return 0;

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = "O";
        best = Math.max(best, minimax(b, depth + 1, false));
        b[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = "X";
        best = Math.min(best, minimax(b, depth + 1, true));
        b[i] = "";
      }
    }
    return best;
  }
}

function findBestMove() {
  let bestVal = -Infinity;
  let bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = "O";
      let moveVal = minimax(board, 0, false);
      board[i] = "";
      if (moveVal > bestVal) {
        bestMove = i;
        bestVal = moveVal;
      }
    }
  }
  return bestMove;
}

function getStatusText() {
  if (checkWinner()) return `Winner: ${currentPlayer}`;
  if (board.every(Boolean)) return "Draw!";
  return `Next: ${currentPlayer}`;
}

function resetGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameOver = false;
  render();
}

render();