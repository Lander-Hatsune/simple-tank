import { Colors } from "./colors.js";

const cvs = document.getElementById("cvs");
const ctx = cvs.getContext("2d");

function drawRect(x, y, w, h, c) {
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);
}

function drawBorder(width, height) {
    drawRect(0, 0, width, height, Colors.border);
    drawRect(5, 5, width - 10, height - 10, Colors.panel);
}

drawBorder(cvs.width, cvs.height)

