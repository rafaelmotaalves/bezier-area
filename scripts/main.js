
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const STEP_SIZE = 100;

const state = {
    size: 500,
    degree: 1,
    points: [],
    selectedPoint: null
}


const cleanCanvas = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

const resizeCanvas = () => {
    state.size = document.querySelector('input[name="size"]').value;
    canvas.width = canvas.height = state.size;
    calculatePoints();
}

const drawPoint = (x, y, radius) => {
    ctx.strokeStyle = "blue";
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}

const isInCircle = (circle, click) => {
    var v = {
        x: circle.x - click.x,
        y: circle.y - click.y
    };
    return (Math.sqrt(v.x * v.x + v.y * v.y) <= circle.radius);
}

const getSelectedPoint = (click) => {
    return state.points.find(point => isInCircle(point, click))
}

const calculatePoints = () => {
    cleanCanvas();
    state.degree = parseInt(document.querySelector('select[name="degree"]').value) + 1;
    state.points = Array(state.degree).fill(0).map(
        (_, i) => ({ x: i * (state.size / (state.degree - 1)), y: state.size / 2, radius: 10 })
    )
    drawPoints();
}

const drawPoints = () => {
    state.points.forEach(({ x, y, radius }) => drawPoint(x, y, radius));
}

const drawArea = () => {
    const bezierPoints = bezier_points(state.points);
    const f = bezierPoints[0];
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.moveTo(f.x, f.y);
    bezierPoints.forEach(
        (elem, index, arr) => {
            if (index > 0) {
                ctx.lineTo(elem.x, elem.y);
            }
        })
        ctx.lineTo(state.size , state.size);
        ctx.lineTo(0, state.size);
        ctx.lineTo(f.x, f.y)
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
}


canvas.addEventListener('mousedown', function (e) {
    state.selectedPoint = getSelectedPoint({
        x: e.offsetX,
        y: e.offsetY
    });
});

canvas.addEventListener('mousemove', function (e) {
    if (state.selectedPoint) {
        state.selectedPoint.y = e.offsetY;
        cleanCanvas();
        drawArea();
        drawPoints();
    }
});


canvas.addEventListener('mouseup', function (e) {
    state.selectedPoint = null;
});


const drawLine = (pointA, pointB) => {
    ctx.beginPath();
    ctx.moveTo(pointA.x, pointA.y);
    ctx.lineTo(pointB.x, pointB.y);
    ctx.strokeStyle = 'red';
    ctx.stroke();
}

document.querySelector('select[name="degree"]').value = 1;
document.querySelector('input[name="size"]').value = 500;
resizeCanvas();
calculatePoints();
