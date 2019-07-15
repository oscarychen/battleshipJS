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

const canvasA = document.getElementById(CANVAS_HTML_ID_A);
const canvasB = document.getElementById(CANVAS_HTML_ID_B);
const button = document.getElementById(START_BUTTON);
const p1ScoreEl = document.getElementById(P1_SCORE_HTML_ID);
const p2ScoreEl = document.getElementById(P2_SCORE_HTML_ID);
const p1ShotsEl = document.getElementById(P1_SHOTS_HTML_ID);
const p2ShotsEl = document.getElementById(P2_SHOTS_HTML_ID);

const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];

/**
 * Used to show a modal message with header, body, and footer texts.
 */
function displayTurnMessage(header, body, footer) {
  document.getElementById("modal-header-text").innerHTML = header ? header : "";
  document.getElementById("modal-body-text").innerHTML = body ? body : "";
  document.getElementById("modal-footer-text").innerHTML = footer ? footer : "";
  modal.style.display = "block";
}
function setGameMessage(msg) {
  document.getElementById("gameMessage").innerHTML = msg;
}

const yardA = new ShipYard();
const yardB = new ShipYard();
const painterA = new Painter(CANVAS_HTML_ID_A, yardA);
const painterB = new Painter(CANVAS_HTML_ID_B, yardB);
let turn = -1;
let playerOneScore = 0;
let playerTwoScore = 0;
let playerOneShots = 0;
let playerTwoShots = 0;

/**
 * Called when modal close button pressed
 */
span.onclick = function() {
  modal.style.display = "none";

  painterA.draw();
  painterB.draw();
};
/**
 * Called to close modal when clicked outside of modal
 */
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";

    painterA.draw();
    painterB.draw();
  }
};

loadGameState();

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

  displayTurnMessage("Turn switch:", "Player 1's turn next..", "");
  painterA.setMode(DISPLAY_SELF);
  painterB.setMode(DISPLAY_ENEMY);
}

/**
 * Set up for Player 2's turn
 */
function playerTwoTurn() {
  painterA.undraw();
  painterB.undraw();
  displayTurnMessage("Turn switch:", "Player 2's turn next..", "");
  painterA.setMode(DISPLAY_ENEMY);
  painterB.setMode(DISPLAY_SELF);
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
    displayTurnMessage("Try again...", "You cannot attack the same location again.", "Player 2's move..");
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
  }, 500);
}

/**
 * Checks performed after a move was made
 */
function playerTwoPostMoveChecks(x, y, outcome) {
  if (outcome) {
    // if a ship was hit
    playerTwoScore++;
    updateStats();
    const sunkShipType = yardA.didAtttackSinkShip(x, y);
    if (sunkShipType !== null) {
      // if a ship sunk
      // alert("Congratulations, You sunk an enemy " + sunkShipType);
      setGameMessage("Player 2 sunk Player 1's " + sunkShipType);
    } else {
      // alert("You have damaged an enemy ship.");
      setGameMessage("Player 2 successfully targeted Player 1's ship.");
    }
  } else {
    // if no ship was hit
    setGameMessage("");
  }
  saveGameState();
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
    displayTurnMessage("Try again...", "You cannot attack the same location again.", "Player 1's move..");
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
  }, 500);
}

function playerOnePostMoveChecks(x, y, outcome) {
  if (outcome) {
    // if a ship was hit
    playerOneScore++;
    updateStats();
    const sunkShipType = yardB.didAtttackSinkShip(x, y);

    if (sunkShipType !== null) {
      // if a ship sunk
      // alert("Congratulations, you sunk an enemy " + sunkShipType);
      setGameMessage("Player 1 sunk Player 2's " + sunkShipType);
    } else {
      // alert("You have damaged an enemy ship.");
      setGameMessage("Player 1 successfully targeted Player 2's ship.");
    }
  } else {
    // if not ship was hit
    setGameMessage("");
  }
  saveGameState();
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
    // alert("Game tie.");
    displayTurnMessage("Game Over", "Nobody wins, just like the real war.");
    turn = -1;
    return true;
  } else if (yardA.allShipsDestroyed()) {
    // alert("Player 2 won!");
    displayTurnMessage("Game Over", "Player 2 won!");
    turn = -1;
    return true;
  } else if (yardB.allShipsDestroyed()) {
    // alert("Player 1 won!");
    displayTurnMessage("Game Over", "Player 1 won!");
    turn = -1;
    return true;
  }

  return false;
}

/**
 * Save game data to local data store
 */
function saveGameState() {
  const gameState = {
    yardA,
    yardB,
    turn,
    playerOneScore,
    playerTwoScore,
    playerOneShots,
    playerTwoShots
  };
  localStorage.setItem("battleshipJS", JSON.stringify(gameState));
}

/**
 * Load game data from local data store
 */
function loadGameState() {
  const gameState = JSON.parse(localStorage.getItem("battleshipJS"));

  if (gameState !== null) {
    parseGameState(gameState);
  } else {
    yardA.spawnShips();
    yardB.spawnShips();
  }
}

/**
 * Called upon when loading game from store to parse data
 */
function parseGameState(gameState) {
  yardA.recreateShipYardFromData(gameState.yardA);
  yardB.recreateShipYardFromData(gameState.yardB);
  turn = gameState.turn;
  playerOneScore = gameState.playerOneScore;
  playerTwoScore = gameState.playerTwoScore;
  playerOneShots = gameState.playerOneShots;
  playerTwoShots = gameState.playerTwoShots;

  if (turn >= 0) {
    button.innerHTML = "Restart";
    painterA.draw();
    painterB.draw();
  }
}

// new Test();
