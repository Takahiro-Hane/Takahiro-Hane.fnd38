'use script'

document.addEventListener("DOMContentLoaded", () => {
  const boardSize = 8;
  const squares = document.querySelectorAll(".square");
  let currentPlayer = "black";


  const board = Array.from({ length: boardSize }, () =>
    Array(boardSize).fill(null)
  );

  board[3][3] = "black";
  board[3][4] = "white";
  board[4][3] = "white";
  board[4][4] = "black";

  function renderBoard() {
    squares.forEach((btn) => {
      const x = parseInt(btn.getAttribute("data1"));
      const y = parseInt(btn.getAttribute("data2"));
      const cell = board[x][y];

      if (cell === "black") {
        btn.textContent = "●";
        btn.setAttribute("data3", "black");
        btn.style.color = "black";
      } else if (cell === "white") {
        btn.textContent = "●";
        btn.setAttribute("data3", "white");
        btn.style.color = "white";
      } else {
        btn.textContent = "";
        btn.removeAttribute("data3");
        btn.style.color = "";
      }
    });

    updateScore();
    updateHighlights();
  }

  function findFlippable(x, y, color) {
    if (board[x][y]) return [];

    const opponent = color === "black" ? "white" : "black";
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],         [0, 1],
      [1, -1],  [1, 0], [1, 1],
    ];
    const flippableStones = [];

    for (const [dx, dy] of directions) {
      let cx = x + dx;
      let cy = y + dy;
      const line = [];

      while (
        cx >= 0 && cx < boardSize &&
        cy >= 0 && cy < boardSize &&
        board[cx][cy] === opponent
      ) {
        line.push([cx, cy]);
        cx += dx;
        cy += dy;
      }

      if (
        line.length > 0 &&
        cx >= 0 && cx < boardSize &&
        cy >= 0 && cy < boardSize &&
        board[cx][cy] === color
      ) {
        flippableStones.push(...line);
      }
    }

    return flippableStones;
  }

  function updateScore() {
    let black = 0, white = 0;
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (board[i][j] === "black") black++;
        if (board[i][j] === "white") white++;
      }
    }
    document.getElementById("black-count").textContent = black;
    document.getElementById("white-count").textContent = white;
  }

  
  function updateHighlights() {
    squares.forEach((btn) => {
      btn.classList.remove("highlight");

      const x = parseInt(btn.getAttribute("data1"));
      const y = parseInt(btn.getAttribute("data2"));
      if (!board[x][y]) {
        const flippable = findFlippable(x, y, currentPlayer);
        if (flippable.length > 0) {
          btn.classList.add("highlight");
        }
      }
    });
  }

  
  squares.forEach((btn) => {
    btn.addEventListener("click", () => {
      const x = parseInt(btn.getAttribute("data1"));
      const y = parseInt(btn.getAttribute("data2"));

      if (board[x][y]) return;

      const flippable = findFlippable(x, y, currentPlayer);
      if (flippable.length > 0) {
        board[x][y] = currentPlayer;
        flippable.forEach(([fx, fy]) => {
          board[fx][fy] = currentPlayer;
        });
        currentPlayer = currentPlayer === "black" ? "white" : "black";
        renderBoard();
      }
    });
  });


document.getElementById("initialize").addEventListener("click", () => {
  const confirmed = confirm("最初から始めますか？");
  if (!confirmed) return;

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      board[i][j] = null;
    }
  }
  board[3][3] = "black";
  board[3][4] = "white";
  board[4][3] = "white";
  board[4][4] = "black";
  currentPlayer = "black";
  renderBoard();
  updateCurrentPlayer(); 
});


  renderBoard();
});

