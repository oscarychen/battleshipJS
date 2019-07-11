import { YARD_HEIGHT, YARD_WIDTH, POSITION_DAMAGED, POSITION_EMPTY, POSITION_OCCUPIED } from "./constants";
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
}

export class ShipYard {
  constructor(player) {
    this.player = player;
    this.cells = [];
  }

  initialize() {
    for (let j = 0; j < YARD_HEIGHT; j++) {
      for (let i = 0; i < YARD_WIDTH; i++) {
        this.cells.push(new Cell(i, j, POSITION_EMPTY));
      }
    }
    console.log("ShipYard initialized.");
  }

  print() {
    this.cells.forEach(cell => {
      console.log(cell.getStatus);
    });
  }

  isOccupied(x, y) {}
}
