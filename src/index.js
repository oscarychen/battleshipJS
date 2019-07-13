import { ShipYard } from "./gameBoard";
import { Painter } from "./painter";
import {
  CANVAS_HTML_ID_A,
  CANVAS_HTML_ID_B,
  DISPLAY_SELF,
  DISPLAY_ENEMY,
  START_BUTTON,
  P1_SCORE_HTML_ID,
  P2_SCORE_HTML_ID,
  P1_SHOTS_HTML_ID,
  P2_SHOTS_HTML_ID
} from "./constants";
import { Test } from "./test";
import { getClickedCellPos } from "./util";

const yardA = new ShipYard();
const yardB = new ShipYard();
const painterA = new Painter(CANVAS_HTML_ID_A, yardA);
const painterB = new Painter(CANVAS_HTML_ID_B, yardB);
const canvasA = document.getElementById(CANVAS_HTML_ID_A);
const canvasB = document.getElementById(CANVAS_HTML_ID_B);
const button = document.getElementById(START_BUTTON);
const p1ScoreEl = document.getElementById(P1_SCORE_HTML_ID);
const p2ScoreEl = document.getElementById(P2_SCORE_HTML_ID);
const p1ShotsEl = document.getElementById(P1_SHOTS_HTML_ID);
const p2ShotsEl = document.getElementById(P2_SHOTS_HTML_ID);
let turn = -1;
let playerOneScore = 0;
let playerTwoScore = 0;
let playerOneShots = 0;
let playerTwoShots = 0;

canvasA.addEventListener("click", e => {
  if (turn < 0) {
    return;
  }
  const cellPos = getClickedCellPos(e, canvasA);
  //   console.log("Cell clicked:", cellPos.x, cellPos.y);
  playerTwoMove(cellPos.x, cellPos.y);
});

canvasB.addEventListener("click", e => {
  if (turn < 0) {
    return;
  }
  const cellPos = getClickedCellPos(e, canvasB);
  //   console.log("Cell clicked:", cellPos.x, cellPos.y);
  playerOneMove(cellPos.x, cellPos.y);
});

button.addEventListener("click", e => {
  startGame();
});

/**
 * Set up for Player 1's turn
 */
function playerOneTurn() {
  painterA.undraw();
  painterB.undraw();

  setTimeout(function() {
    alert("Player 1's turn.");
    painterA.setMode(DISPLAY_SELF);
    painterB.setMode(DISPLAY_ENEMY);
    painterA.draw();
    painterB.draw();
  }, 250);
}

/**
 * Set up for Player 2's turn
 */
function playerTwoTurn() {
  painterA.undraw();
  painterB.undraw();

  setTimeout(function() {
    alert("Player 2's turn.");
    painterA.setMode(DISPLAY_ENEMY);
    painterB.setMode(DISPLAY_SELF);
    painterA.draw();
    painterB.draw();
  }, 250);
}

/**
 * Called on when Player two makes a move
 */
function playerTwoMove(x, y) {
  if (turn % 2 === 0) {
    return;
  }
  // if the cell is already hit previously, cannot attack same cell twice
  if (!yardA.isCellTargetable(x, y)) {
    alert("You cannot attack the same location again.");
    return;
  }

  playerTwoShots++;
  turn++;
  updateStats();
  const outcome = yardA.attackCell(x, y);
  painterA.draw();

  setTimeout(function() {
    playerTwoPostMoveChecks(x, y, outcome);
    if (checkWinningConditions()) {
      return;
    }
    playerOneTurn();
  }, 250);
}

/**
 * Checks performed after a move was made
 */
function playerTwoPostMoveChecks(x, y, outcome) {
  if (outcome) {
    playerTwoScore++;
    updateStats();
    const sunkShipType = yardA.didAtttackSinkShip(x, y);
    if (sunkShipType !== null) {
      alert("Congratulations, You sunk an enemy " + sunkShipType);
    } else {
      alert("You have damaged an enemy ship.");
    }
  }
}

/**
 * Called on when Player One makes a move
 */
function playerOneMove(x, y) {
  if (turn % 2 !== 0) {
    return;
  }
  // if the cell is already hit previously, cannot attack same cell twice
  if (!yardB.isCellTargetable(x, y)) {
    alert("You cannot attack the same location again.");
    return;
  }

  playerOneShots++;
  turn++;
  updateStats();
  const outcome = yardB.attackCell(x, y);
  painterB.draw();

  setTimeout(function() {
    playerOnePostMoveChecks(x, y, outcome);
    playerTwoTurn();
  }, 250);
}

function playerOnePostMoveChecks(x, y, outcome) {
  if (outcome) {
    playerOneScore++;
    updateStats();
    const sunkShipType = yardB.didAtttackSinkShip(x, y);

    if (sunkShipType !== null) {
      alert("Congratulations, you sunk an enemy " + sunkShipType);
    } else {
      alert("You have damaged an enemy ship.");
    }
  }
}

/**
 * Called on to start/re-start the game
 */
function startGame() {
  turn = 0;
  playerOneScore = 0;
  playerTwoScore = 0;
  playerOneShots = 0;
  playerTwoShots = 0;
  updateStats();
  yardA.initializeBoard();
  yardB.initializeBoard();
  yardA.spawnShips();
  yardB.spawnShips();
  playerOneTurn();

  button.innerHTML = "Restart";
}

/**
 * Called upon to update game stats
 */
function updateStats() {
  p1ScoreEl.innerHTML = "Score: " + playerOneScore;
  p2ScoreEl.innerHTML = "Score: " + playerTwoScore;
  p1ShotsEl.innerHTML = "Shots Fired: " + playerOneShots;
  p2ShotsEl.innerHTML = "Shots Fired: " + playerTwoShots;
}

/**
 * Check if game has finished, return true if so.
 */
function checkWinningConditions() {
  if (yardA.allShipsDestroyed() && yardB.allShipsDestroyed()) {
    alert("Game tie.");
    turn = -1;
    return true;
  } else if (yardA.allShipsDestroyed()) {
    alert("Player 1 won!");
    turn = -1;
    return true;
  } else if (yardB.allShipsDestroyed()) {
    alert("Player 2 won!");
    turn = -1;
    return true;
  }
  console.log("checkWinningCondition returning false");
  return false;
}

// new Test();
