import { shipYard, Cell } from "./ships";
import { POSITION_DAMAGED, POSITION_EMPTY, POSITION_OCCUPIED, CANVAS_HTML_ID_A, CELL_SIZE } from "./constants";

/**
 * Class that draws the game in GUI
 */
export class Painter {
  constructor(canvasElementId, shipYard) {
    this.canvas = document.getElementById(canvasElementId);
    this.ctx = this.canvas.getContext("2d");
    this.yard = shipYard;
  }

  /**
   * Called upon to draw cells
   */
  draw() {
    const cells = Array.from(this.yard.cells);
    cells.forEach(cell => {
      this.drawCell(cell.getX(), cell.getY(), cell.getStatus());
    });
  }

  /**
   * Helper methods that converts grid coordinates to rectangle pixel values
   */
  coordinatesToRect(x, y) {
    const anchorX = x * CELL_SIZE;
    const anchorY = y * CELL_SIZE;
    const width = anchorX + CELL_SIZE;
    const height = anchorY + CELL_SIZE;
    return { a: anchorX, b: anchorY, w: width, h: height };
  }

  /**
   * Helper method that draws an empty cell given the cells x and y cordinates
   */
  drawCell(x, y, type) {
    switch (type) {
      case POSITION_DAMAGED:
        this.ctx.fillStyle = "#1c2430";
        break;
      case POSITION_EMPTY:
        this.ctx.fillStyle = "#4287f5";
        break;
      case POSITION_OCCUPIED:
        this.ctx.fillStyle = "#30c2aa";
        break;
    }
    const { a, b, w, h } = this.coordinatesToRect(x, y);
    this.ctx.beginPath();
    this.ctx.rect(a, b, w, h);
    this.ctx.fill();
    this.ctx.strokeStyle = "rgba(10, 10, 255, 5)";
    this.ctx.stroke();
    this.ctx.closePath();
  }
}
