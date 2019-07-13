import {
  POSITION_EMPTY,
  POSITION_OCCUPIED,
  CELL_SIZE,
  COLOR_CELL_HIT,
  COLOR_CELL_EMPTY,
  COLOR_CELL_OCCUPIED,
  POSITION_EMPTY_HIT,
  POSITION_OCCUPIED_HIT,
  DISPLAY_SELF,
  YARD_WIDTH,
  YARD_HEIGHT
} from "./constants";

/**
 * Class that draws the game in GUI
 */
export class Painter {
  constructor(canvasElementId, shipYard) {
    this.canvas = document.getElementById(canvasElementId);
    this.ctx = this.canvas.getContext("2d");
    this.yard = shipYard;
    this.mode;
  }

  /**
   * Used to set the display mode, to show player and opponent different views during their turns
   */
  setMode(mode) {
    this.mode = mode;
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

  undraw() {
    this.ctx.beginPath();
    this.ctx.rect(0, 0, YARD_WIDTH * CELL_SIZE, YARD_HEIGHT * CELL_SIZE);
    this.ctx.fillStyle = COLOR_CELL_EMPTY;
    this.ctx.fill();
    this.ctx.closePath();
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
    const { a, b, w, h } = this.coordinatesToRect(x, y);

    switch (type) {
      case POSITION_EMPTY_HIT:
        this.drawFillSquare(a, b, w, h, COLOR_CELL_EMPTY);
        this.drawCross(a, b, COLOR_CELL_HIT);
        break;
      case POSITION_OCCUPIED_HIT:
        this.drawFillSquare(a, b, w, h, COLOR_CELL_OCCUPIED);
        this.drawCross(a, b, COLOR_CELL_HIT);
        break;
      case POSITION_EMPTY:
        this.drawFillSquare(a, b, w, h, COLOR_CELL_EMPTY);
        break;
      case POSITION_OCCUPIED:
        if (this.mode === DISPLAY_SELF) {
          this.drawFillSquare(a, b, w, h, COLOR_CELL_OCCUPIED);
        } else {
          this.drawFillSquare(a, b, w, h, COLOR_CELL_EMPTY);
        }
        break;
      default:
        console.log("Painter.drawCell(): Unknown type.");
        break;
    }
    this.drawGrid(a, b, w, h);
  }

  /**
   * Paint cross over a cell space
   */
  drawCross(a, b, color) {
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.moveTo(a, b);
    this.ctx.lineTo(a + CELL_SIZE, b + CELL_SIZE);
    this.ctx.stroke();
    this.ctx.moveTo(a + CELL_SIZE, b);
    this.ctx.lineTo(a, b + CELL_SIZE);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  /**
   * Fill color in a cell space
   */
  drawFillSquare(a, b, w, h, color) {
    this.ctx.beginPath();
    this.ctx.rect(a, b, w, h);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  /**
   * Draw cell outline
   */
  drawGrid(a, b, w, h) {
    this.ctx.beginPath();
    this.ctx.rect(a, b, w, h);
    this.ctx.strokeStyle = "rgba(10, 10, 255, 5)";
    this.ctx.stroke();
    this.ctx.closePath();
  }
}
