import { ShipYard } from "./gameBoard";
import { Player } from "./player";
import { Painter } from "./painter";
import { CANVAS_HTML_ID_A } from "./constants";

// const canvas = document.getElementById("gameCanvasA");
// const ctx = canvas.getContext("2d");
// ctx.beginPath();
// ctx.rect(20, 20, 10, 110);
// ctx.fillStyle = "#FF0000";
// ctx.fill();
// ctx.closePath();

// ctx.beginPath();
// ctx.arc(240, 160, 20, 0, Math.PI * 2, false);
// ctx.fillStyle = "green";
// ctx.fill();
// ctx.closePath();

// ctx.beginPath();
// ctx.rect(160, 10, 100, 40);
// ctx.fillStyle = "#FF0000";
// ctx.fill();
// ctx.strokeStyle = "rgba(10, 10, 255, 5)";
// ctx.stroke();
// ctx.closePath();

const playerA = new Player(1);
const playerB = new Player(2);
const yardA = new ShipYard(playerA);
const yardB = new ShipYard(playerB);
const painterA = new Painter(CANVAS_HTML_ID_A, yardA);
painterA.draw();
