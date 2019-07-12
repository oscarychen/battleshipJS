import { POSITION_OCCUPIED } from "./constants";
import { Cell } from "./gameBoard";

export class ShipLShape {
  constructor(x, y) {
    this.cells = []; // list of cells that the ship occupies
    this.initialize(x, y);
  }

  /**
   * Given a starting cell cordinates,generate rest of the ship cells.
   * The ship is generately either in vertical or horizontal orientation, randomly.
   */
  initialize(x, y, vertical = true) {
    if (vertical) {
      // generate vertical ship
      this.cells[0] = new Cell(x, y);
      this.cells[1] = new Cell(x, y + 1);
      this.cells[2] = new Cell(x, y + 2);
      this.cells[3] = new Cell(x + 1, y + 2);
    } else {
      // generate horizontal ship
      this.cells[0] = new Cell(x, y);
      this.cells[1] = new Cell(x + 1, y);
      this.cells[2] = new Cell(x + 2, y);
      this.cells[3] = new Cell(x + 2, y - 1);
    }
  }

  getCells() {
    return this.cells;
  }
}

export class ShipBlock extends ShipLShape {
  /**
   * Given a starting cell cordinates,generate rest of the ship cells.
   * The ship is generately either in vertical or horizontal orientation, randomly.
   */
  initialize(a, b, vertical = true) {
    const x = a;
    const y = b;
    if (vertical) {
      // generate vertical ship
      for (let i = 0; i < 8; i++) {
        if (i === 3) {
          // draws next column
          x = a + 1;
          y = b;
        }
        this.cells(new Cell(x, y++));
      }
    } else {
      // generate horizontal ship
      for (let i = 0; i < 8; i++) {
        if (i === 3) {
          // draws next row
          x = a;
          y = b + 1;
        }
        this.cells(new Cell(x++, y));
      }
    }
  }
}

export class ShipLine extends ShipLShape {
  /**
   * Given a starting cell cordinates,generate rest of the ship cells.
   * The ship is generately either in vertical or horizontal orientation, randomly.
   */
  initialize(x, y, vertical = true) {
    if (vertical) {
      // generate vertical ship
      for (let i = 0; i < 4; i++) {
        this.cells.push(new Cell(x, y++));
      }
    } else {
      // generate horizontal ship
      for (let i = 0; i < 4; i++) {
        this.cells.push(new Cell(x++, y));
      }
    }
  }
}
