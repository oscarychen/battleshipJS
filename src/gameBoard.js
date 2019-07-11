import { YARD_HEIGHT, YARD_WIDTH, POSITION_DAMAGED, POSITION_EMPTY, POSITION_OCCUPIED } from "./constants";

/**
 * Represents a grid cell in the ShipYard (gameboard space).
 */
export class Cell {
  constructor(x, y, status) {
    this.x = x;
    this.y = y;
    this.status = status ? status : POSITION_EMPTY;
  }

  setStatus(value) {
    this.status = value;
  }

  getStatus() {
    return this.status;
  }

  toString() {
    return "(" + this.x + "," + this.y + ") - " + this.getStatus();
  }
}

/**
 * Represents the gameboard space. Contains an array of Cells.
 * Keeps tracks of the player(owner) of itself.
 */
export class ShipYard {
  constructor(player) {
    this.player = player;
    this.cells = [];
  }

  /**
   * Initialize ShipYard, reset all cells to empty
   */
  initialize() {
    for (let j = 0; j < YARD_HEIGHT; j++) {
      for (let i = 0; i < YARD_WIDTH; i++) {
        this.cells.push(new Cell(i, j, POSITION_EMPTY));
      }
    }
  }

  /**
   * Called upon during initialization of the ShipYard to set up cells where there should be ships
   */
  spawnShips() {}

  /**
   * Debug method for printing all cell status
   */
  print() {
    this.cells.forEach(cell => {
      console.log(cell.toString());
    });
  }

  /**
   * Helper method that returns the Cell by providing x and y cordinates
   */
  getCell(x, y) {
    const cell = this.cells.find(item => item.x == x && item.y == y);
    return cell;
  }

  /**
   * Helper method that takes x & y cordinate and returns true if the cell is occupied
   */
  isOccupied(x, y) {
    const cell = this.getCell(x, y);
    if (cell.getStatus === POSITION_EMPTY) {
      return false;
    } else {
      return true;
    }
  }
}
