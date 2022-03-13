const canvas = document.querySelector("#jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.querySelectorAll(".jsColor");
const range = document.querySelector("#jsRange");
const mode = document.querySelector("#jsMode");
const save = document.querySelector("#jsSave");
const shape = document.querySelector("#jsShape");

const INITIAL_COLOR = "#2C2C2C";

canvas.width = document.querySelector(".canvas").offsetWidth;
canvas.height = document.querySelector(".canvas").offsetHeight;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5;

let painting = false;
let filling = false;

let brush = true;
let rectangle = false;
let circle = false;
let line = false;

const startPoint = [];

function startPainting(event) {
    painting = true;
    if (!brush) {
        startPoint.push(event.offsetX);
        startPoint.push(event.offsetY);
    }
}

function absolute(number) {
    if (number < 0 ) {
        return -number;
    }
    return number;
}

function stopPainting(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    painting = false;
    if (startPoint.length !== 0) {
        const startX = startPoint[0];
        const startY = startPoint[1];
        const deltaX = absolute(x - startX);
        const deltaY = absolute(y - startY);
        if (rectangle) {
            if (filling) {
                ctx.fillRect(startX, startY, deltaX, deltaY);
            } else {
                ctx.strokeRect(startX, startY, deltaX, deltaY);
            }
        } else if (circle) {
            const radius = Math.sqrt(deltaX ** 2 + deltaY ** 2);
            ctx.beginPath();
            ctx.arc(startX, startY, radius, 0, Math.PI * 2);
            if (filling) {
                ctx.fill();
            } else {
                ctx.stroke();
            }
        } else if (line) {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        startPoint.splice(0, 2);
    }
}

function onMousemove(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    if (!painting) {
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else if (brush) {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

function handleClickColor(event) {
    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
}

function handleRangeDrag(event) {
    const size = event.target.value;
    ctx.lineWidth = size;
}

function handleModeClick() {
    if (!filling) {
        filling = true;
        mode.innerText = "paint";
    } else {
        filling = false;
        mode.innerText = "fill";
    } 
}

function fillCanvas() {
    if (filling && brush) {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function handleRightClick(event) {
    event.preventDefault();
    painting = false;
}

function handleSaveClick() {
    const image = canvas.toDataURL();
    const link = document.createElement("a");
    link.href = image;
    link.download = "Paint[🎨]";
    link.click();
}

function handleShapeClick() {
    if (!rectangle && !circle && !line) {
        canvas.style.cursor = "crosshair";
        rectangle = true;
        brush = false;
        shape.innerText = "circle";
    } else if (!circle && !line) {
        circle = true;
        rectangle  = false;
        shape.innerText = "line";
    } else if(!line) {
        line = true;
        circle = false;
        shape.innerText = "brush";
    } else {
        canvas.style.cursor = "";
        brush = true;
        line = false;
        shape.innerText = "rectangle";
    }
}

if (canvas) {
    canvas.addEventListener("mousemove", onMousemove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("click", fillCanvas);
    canvas.addEventListener("contextmenu", handleRightClick);
}

Array.from(colors).forEach(color => color.addEventListener("click", handleClickColor));

if (range) {
    range.addEventListener("input", handleRangeDrag);
}

if (mode) {
    mode.addEventListener("click", handleModeClick);
}

if (save) {
    save.addEventListener("click", handleSaveClick);
}

if (shape) {
    shape.addEventListener("click", handleShapeClick);
}