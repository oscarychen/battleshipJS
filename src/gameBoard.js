import {
  YARD_HEIGHT,
  YARD_WIDTH,
  POSITION_EMPTY_HIT,
  POSITION_OCCUPIED_HIT,
  POSITION_EMPTY,
  POSITION_OCCUPIED,
  SHIP_TYPE_1,
  SHIP_TYPE_2,
  SHIP_TYPE_3
} from "./constants";
import { Ship } from "./ships";
import { shuffleArray } from "./util";

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

  setEntity(ship) {
    this.entity = ship;
  }

  getEntity() {
    return this.entity;
  }

  setStatus(value) {
    this.status = value;
  }

  getStatus() {
    return this.status;
  }

  setX(value) {
    this.x = value;
  }

  setY(value) {
    this.y = value;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  toString() {
    return "(" + this.x + "," + this.y + ") " + this.getStatus() + ". ";
  }

  toArray() {
    return [this.x, this.y];
  }
}

/**
 * Represents the gameboard space. Contains an array of Cells.
 * Keeps tracks of the player(owner) of itself.
 */
export class ShipYard {
  constructor() {
    this.cells = [];
    this.ships = [];
    this.initializeBoard();
  }

  /**
   * Initialize ShipYard, reset all cells to empty
   */
  initializeBoard() {
    this.cells = [];
    for (let j = 0; j < YARD_HEIGHT; j++) {
      for (let i = 0; i < YARD_WIDTH; i++) {
        this.cells.push(new Cell(i, j, POSITION_EMPTY, null));
      }
    }
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
   * Need to be explicitly called upon after creating ShipYard object.
   * Creates new Ship objects using new Cell objects.
   * Compare the Cell objects from Ship and ShipYard with the same coordinates,
   * and only add the Ship if there is no status conflicts in any of the Cells.
   * The spawn position is random, and if there is a Cell conflict, the Ship would
   * be rotated and checked again.
   */
  spawnShips() {
    this.ships = [];
    const emptyCells = this.getEmptyCells();
    let numShips = 0;
    shuffleArray(emptyCells);

    // using each empty cell position as spawning point for a ship
    for (let i = 0; i < emptyCells.length; i++) {
      const x = emptyCells[i].getX();
      const y = emptyCells[i].getY();
      const ship = new Ship(x, y, this.spawnShipTypeDecider(numShips));
      let rotateCounter = 0;
      // if the spawned ship has collision, rotate up to 3 times
      while (this.spawnShipHasCollision(ship) && rotateCounter <= 3) {
        ship.rotate();
        rotateCounter++;
      }

      //the new ship has no collission issue and can be added to the ShipYard
      if (!this.spawnShipHasCollision(ship)) {
        this.addShipToYard(ship);
        numShips++;
      }

      if (numShips >= 4) {
        // console.log("All ships have been spawned.");
        // console.log(this.ships);
        return;
      }
    }
  }

  /**
   * Helper method used by spawnShips(), takes the sequence number of the ship being spawned,
   * return the type of ship to be spawned.
   */
  spawnShipTypeDecider(numShips) {
    switch (numShips) {
      case 0:
        return SHIP_TYPE_1;
      case 1:
        return SHIP_TYPE_2;
      case 2:
        return SHIP_TYPE_3;
      case 3:
        return SHIP_TYPE_3;
      default:
        console.log("Error: cannot spawn more than 4 ships.");
        break;
    }
  }

  /**
   * Checks a given ship against a ShipYard, to see if ship can be added.
   * Returns true if collision detected.
   */
  spawnShipHasCollision(ship) {
    const cells = Array.from(ship.getCells());

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
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
   * Takes a Ship object (which has been previously checked to be ready to add to ShipYard),
   * Replace the Cell objects in the Ship with the corresponding Cell objects from ShipYared.
   * Essentially making sure the Ship contains Cell object pointers to the same objects that the ShipYard
   * is pointing at, as the Ship is added to the ShipYard.
   */
  addShipToYard(ship) {
    const shipCells = ship.getCells();
    for (let i = 0; i < shipCells.length; i++) {
      const x = shipCells[i].getX();
      const y = shipCells[i].getY();
      const yardCell = this.getCell(x, y);
      yardCell.setStatus(POSITION_OCCUPIED);
      yardCell.setEntity(ship);
      shipCells[i] = yardCell;
    }
    this.ships.push(ship);
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
   * Helper method that returns the Cell object by searching x and y cordinates
   */
  getCell(x, y) {
    const cell = this.cells.find(item => item.getX() === x && item.getY() === y);
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

    if (cell.getStatus() === POSITION_EMPTY) {
      return false;
    }

    return true;
  }

  /**
   * Called upon to check whether this position can be attacked, same Cell cannot be attacked twice in the same game.
   */
  isCellTargetable(x, y) {
    const cell = this.getCell(x, y);
    if (cell.getStatus() === POSITION_EMPTY_HIT || cell.getStatus() === POSITION_OCCUPIED_HIT) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Called upon to attack a Cell's position.
   * Returns true if a Ship is hit.
   */
  attackCell(x, y) {
    const cell = this.getCell(x, y);

    if (cell.getStatus() === POSITION_EMPTY) {
      cell.setStatus(POSITION_EMPTY_HIT);
      return false;
    } else if (cell.getStatus() === POSITION_OCCUPIED) {
      cell.setStatus(POSITION_OCCUPIED_HIT);
      return true;
    }
  }

  /**
   * Called on to check if an ship was sunk as the result of an
   * attack on the Cell position. Return Ship.type attribute if ship was sunk;
   * otherwise return null.
   */
  didAtttackSinkShip(x, y) {
    const cell = this.getCell(x, y);
    const ship = cell.getEntity();
    // console.log(ship);
    for (let i = 0; i < ship.getCells().length; i++) {
      if (ship.cells[i].getStatus() === POSITION_OCCUPIED) {
        return null;
      }
    }
    return ship.getType();
  }

  /**
   * Return true if all ships have been destroyed
   */
  allShipsDestroyed() {
    for (let i = 0; i < this.cells.length; i++) {
      console.log(this.cells[i].getStatus());
      if (this.cells[i].getStatus() === POSITION_OCCUPIED) {
        return false;
      }
    }

    return true;
  }
}
