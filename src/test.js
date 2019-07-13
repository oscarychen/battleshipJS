import { Player } from "./player";
import { Ship } from "./ships";
import { SHIP_TYPE_1, POSITION_DAMAGED, POSITION_OCCUPIED, POSITION_OCCUPIED_HIT } from "./constants";
import { ShipYard } from "./gameBoard";
import { compare2DArrays } from "./util";
/**
 * Testing class used to test individual methods, contains some testing sequences.
 */
export class Test {
  constructor() {
    this.shipTest();
    this.yardTest();
  }

  shipTest() {
    console.log("Ship: testing rotate()...");
    let ship = new Ship(0, 0, SHIP_TYPE_1);
    ship.rotate();
    let shipArr1 = ship.toArray();
    let shipArr2 = [[0, 0], [1, 0], [2, 0], [2, -1]];
    if (compare2DArrays(shipArr1, shipArr2)) {
      console.log("Ship rotation test 1 passed.");
    } else {
      console.log("Ship rotation test 1 failed.");
    }

    ship.rotate();
    shipArr1 = ship.toArray();
    shipArr2 = [[0, 0], [0, -1], [0, -2], [-1, -2]];
    if (compare2DArrays(shipArr1, shipArr2)) {
      console.log("Ship.rotate() test 2 passed.");
    } else {
      console.log("Ship.rotate() test 2 failed.");
    }
  }

  yardTest() {
    console.log("ShipYard: testing addShipToYard()...");
    const yard = new ShipYard();
    const ship = new Ship(0, 0, SHIP_TYPE_1);

    yard.addShipToYard(ship);
    // console.log(yard.getEmptyCells());
    // console.log(yard.getCell(0, 0));
    yard.getCell(0, 0).setStatus(POSITION_OCCUPIED_HIT);

    if (
      ship.getCells()[0].getStatus() === POSITION_OCCUPIED_HIT &&
      ship.getCells()[1].getStatus() === POSITION_OCCUPIED &&
      yard.ships.length === 1
    ) {
      console.log("ShipYard.addShipToYard() test passed.");
    } else {
      console.log("ShipYard.addShipToYard() test failed.");
    }
  }
}
