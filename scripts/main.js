
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
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.strokeStyle = "red";
    ctx.lineWidth = 10;
    bezierPoints.forEach(
        (elem, index, arr) => {
            if (index < arr.length - 1) {
                ctx.fillRect(elem.x, elem.y, arr[index + 1].x - elem.x, state.size - elem.y);
                ctx.moveTo(elem.x, elem.y);
                ctx.lineTo(arr[index + 1].x, arr[index + 1].y);
            }
        }
    )
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


document.querySelector('select[name="degree"]').value = state.degree;
document.querySelector('input[name="size"]').value = state.size;
resizeCanvas();
calculatePoints();
