import { CELL_SIZE } from "./constants";

/**
 * Compare x,y values in a 2D array, return true if all values are the same
 */
export function compare2DArrays(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i][0] !== arr2[i][0]) {
      return false;
    }
    if (arr1[i][1] !== arr2[i][1]) {
      return false;
    }
  }

  return true;
}

/**
 * Shuffle array in-place
 */
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

/**
 * Helper method that transaltes x,y pixel coordinates on canvas to cell coordinates on ShipYard
 */
function pixelToCellCoord(x, y) {
  x = Math.floor(x / CELL_SIZE);
  y = Math.floor(y / CELL_SIZE);
  return { x, y };
}

/**
 * Given an event and canvas, returns the cell coordinates of a mouse click
 */
export function getClickedCellPos(event, canvas) {
  let x = event.clientX - canvas.offsetLeft;
  let y = event.clientY - canvas.offsetTop;
  return pixelToCellCoord(x, y);
}
