import { YARD_HEIGHT, YARD_WIDTH, POSITION_DAMAGED, POSITION_EMPTY, POSITION_OCCUPIED, NUM_SHIPS } from "./constants";
import { ShipLShape, ShipLine, ShipBlock } from "./ships";

/**
 * Represents a grid cell in the ShipYard (gameboard space).
 */
export class Cell {
  constructor(x, y, status, ship) {
    this.x = x;
    this.y = y;
    this.status = status ? status : POSITION_EMPTY;
    this.entity = ship ? ship : null; // used if the cell is part of an entity (ie. a ship)
  }

  setStatus(value) {
    this.status = value;
  }

  getStatus() {
    return this.status;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
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
    this.ships = [];
    this.initialize();
  }

  /**
   * Initialize ShipYard, reset all cells to empty
   */
  initialize() {
    for (let j = 0; j < YARD_HEIGHT; j++) {
      for (let i = 0; i < YARD_WIDTH; i++) {
        this.cells.push(new Cell(i, j, POSITION_EMPTY, null));
      }
    }
    this.spawnShips();
  }

  /**
   * Helper method that returns a list of currently empty cells
   */
  getEmptyCells() {
    const emptyCells = [];
    this.cells.forEach(cell => {
      if (cell.getStatus() === POSITION_EMPTY) {
        emptyCells.push(cell);
      }
    });
    return emptyCells;
  }

  /**
   * Helper method to shuffle array in-place
   */
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  spawnShips() {
    let ships = [];
    let hasNull = true;

    while (hasNull === true) {
      // process to spawn 4 ships
      ships.push(this.spawnShipLShape());
      // ships.push(this.spawnShipBlock());
      // ships.push(this.spawnShipLine());
      // ships.push(this.spawnShipLine());

      for (let i = 0; i < ships.length; i++) {
        //check the 4 ships spawned
        if (ships[i] === null) {
          // if any of the ships failed to spawn, restart spawning process
          hasNull = true;
          ships = [];
        } else {
          hasNull = false;
        }
      }
    }
    console.log("Spawning ships success.");
  }

  /**
   * Spawn a L-shaped ship
   */
  spawnShipLShape() {
    const emptyCells = this.getEmptyCells();
    this.shuffleArray(emptyCells);

    for (let i = 0; i < emptyCells.length; i++) {
      const cell = emptyCells[i];
      let ship = new ShipLShape(4, 5);
      if (this.spawnShipHasCollision(ship)) {
        // if collision, try orient ship horizontally
        ship = new ShipL(cell.getX(), cell.getY(), false);
      } else {
        // found available ship position, return ship
        return ship;
      }
    }
    return null; // returns null if ship spawning impossible
  }

  /**
   * Spawn a Block-shaped ship
   */
  spawnShipBlock() {
    const emptyCells = this.getEmptyCells();
    this.shuffleArray(emptyCells);

    for (let i = 0; i < emptyCells.length; i++) {
      const cell = emptyCells[i];
      let ship = new ShipBlock(cell.getX(), cell.getY());
      if (this.spawnShipHasCollision(ship)) {
        // if collision, try orient ship horizontally
        ship = new ShipBlock(cell.getX(), cell.getY(), false);
      } else {
        // found available ship position, return ship
        return ship;
      }
    }
  }

  /**
   * Spawn a Line-shaped ship
   */
  spawnShipLine() {
    const emptyCells = this.getEmptyCells();
    this.shuffleArray(emptyCells);

    for (let i = 0; i < emptyCells.length; i++) {
      const cell = emptyCells[i];
      let ship = new ShipLine(cell.getX(), cell.getY());
      if (this.spawnShipHasCollision(ship)) {
        // if collision, try orient ship horizontally
        ship = new ShipLine(cell.getX(), cell.getY(), false);
      } else {
        // found available ship position, return ship
        return ship;
      }
    }
  }

  /**
   * Checks a given ship against a ShipYard, to see if ship can be added.
   * Returns true if collision detected.
   */
  spawnShipHasCollision(ship) {
    const cells = Array.from(ship.getCells());

    for (let i = 0; i < cells.length; i++) {
      const x = cell.getX();
      const y = cell.getY();
      if (this.isOccupied(x, y)) {
        // ship cannot be spawned on this cell postion
        return true;
      }
    }
    return false; // no collision found
  }

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
   * Helper method that takes x & y cordinate and returns true if the cell is occupied or out of bound
   */
  isOccupied(x, y) {
    const cell = this.getCell(x, y);

    if (x < 0 || x >= YARD_WIDTH) {
      return true;
    }

    if (y < 0 || y >= YARD_HEIGHT) {
      return true;
    }

    if (cell.getStatus === POSITION_EMPTY) {
      return false;
    }

    return true;
  }
}
