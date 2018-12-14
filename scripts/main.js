
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


const state = {
    size: 500,
    degree: 1,
    points: [],
    curvePoints: [],
    selectedPoint: null,
    stepSize: 100,
    generator: 1,
    markPoints: false,
}

const changeStepSize = () => {
    state.stepSize = parseInt(document.querySelector('input[name="stepSize"]').value);
    calculatePoints();
}

const changeGenerator = () => {
    state.generator = parseInt(document.querySelector('select[name="generator"]').value);
    calculatePoints();
}

const changeMarkPoints = () => {
    state.markPoints = document.querySelector('input[name="markPoints"]').value == 'on';
    calculatePoints();
}

const resizeCanvas = () => {
    state.size = parseInt(document.querySelector('input[name="size"]').value);
    canvas.width = canvas.height = state.size;
    calculatePoints();
}

const cleanCanvas = () => ctx.clearRect(0, 0, canvas.width, canvas.height);


const drawPoint = (x, y, radius, color) => {
    ctx.strokeStyle = "blue";
    ctx.fillStyle = color;
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
    state.degree = parseInt(document.querySelector('input[name="degree"]').value) + 1;
    state.points = Array(state.degree).fill(0).map(
        (_, i) => ({ x: i * (state.size / (state.degree - 1)), y: state.size / 2, radius: 10 })
    )
    drawPoints();
}

const drawPoints = () => {
    state.points.forEach(({ x, y, radius }) => drawPoint(x, y, radius, 'blue'));
}

const drawArea = () => {
    const bezierPoints = bezier_points(state.points);
    state.curvePoints = bezierPoints;

    console.log(state)
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
    ctx.lineTo(state.size, state.size);
    ctx.lineTo(0, state.size);
    ctx.lineTo(f.x, f.y)
    ctx.closePath();
    ctx.fill();
    if (state.markPoints) {
        bezierPoints.forEach(({ x, y }) => drawPoint(x, y, 5, 'green'))
    }

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

document.querySelector('select[name="generator"]').value = state.generator;
document.querySelector('input[name="degree"]').value = state.degree;
document.querySelector('input[name="size"]').value = state.size;
document.querySelector('input[name="stepSize"]').value = state.stepSize;

resizeCanvas();
calculatePoints();
