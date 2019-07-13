import { ShipYard } from "./gameBoard";
import { Player } from "./player";
import { Painter } from "./painter";
import { CANVAS_HTML_ID_A, POSITION_DAMAGED, POSITION_OCCUPIED_HIT } from "./constants";
import { Test } from "./test";

const playerA = new Player(1);
const playerB = new Player(2);
const yardA = new ShipYard(playerA);
const yardB = new ShipYard(playerB);
yardA.spawnShips();
const painterA = new Painter(CANVAS_HTML_ID_A, yardA);

painterA.draw();

console.log(yardA);

// new Test();
