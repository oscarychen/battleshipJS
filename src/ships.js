import {
  SHIP_TYPE_1,
  SHIP_TYPE_2,
  SHIP_TYPE_3,
  SHIP_TYPE_1_TEMPLATE,
  SHIP_TYPE_2_TEMPLATE,
  SHIP_TYPE_3_TEMPLATE
} from "./constants";
import { Cell } from "./gameBoard";

/**
 * This class is used primarily to help spawning ships in ShipYard.
 * However, ShipYard does not keep track of Ship objects and only creates
 * Ship objects during the spawning process, and disposes the Ship objects after.
 */
export class Ship {
  constructor(x, y, type) {
    this.type = type;
    this.cells = [];
    this.initialize(x, y, type);
  }

  getType() {
    return this.type;
  }

  /**
   * Return the ship as a 2D array containing x,y coordinates of each cell.
   * Used for Test comparison purpose.
   */
  toArray() {
    const arr = [];
    this.cells.forEach(cell => {
      arr.push(cell.toArray());
    });
    return arr;
  }

  /**
   * Get a list of Cell objects that make up the ship
   */
  getCells() {
    return this.cells;
  }

  initialize(x, y, type) {
    // console.log("Spawning ship: ", type);
    const template = this.getTemplate(type);
    template.forEach(([a, b]) => {
      this.cells.push(new Cell(x + a, y + b));
    });
  }

  /**
   * Get the template of the ship based on type
   */
  getTemplate(type) {
    switch (type) {
      case SHIP_TYPE_1:
        return SHIP_TYPE_1_TEMPLATE;

      case SHIP_TYPE_2:
        return SHIP_TYPE_2_TEMPLATE;

      case SHIP_TYPE_3:
        return SHIP_TYPE_3_TEMPLATE;
    }
  }

  /**
   * Rotates the ship 90 degress counter-clock wise
   */
  rotate() {
    for (let i = 1; i < this.cells.length; i++) {
      const x = this.cells[i].getX();
      const y = this.cells[i].getY();
      this.cells[i].setX(y);
      this.cells[i].setY(-x);
    }
  }
}
