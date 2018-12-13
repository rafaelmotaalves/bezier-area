const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const state = {
    size: 5,
    degree: 2,
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
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = 'blue';
    ctx.fill();
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
    state.degree = parseInt(document.querySelector('select[name="degree"]').value);
    state.points = Array(state.degree).fill(0).map(
        (_, i) => ({ x: i * (state.size / (state.degree - 1)), y: state.size / 2, radius: 5})
    )
    drawPoints();
}

const drawPoints = () => {
    cleanCanvas();
    state.points.forEach(({ x, y, radius}) => drawPoint(x, y, radius));
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
        drawPoints();
    }
});

canvas.addEventListener('mouseup', function (e) {
    state.selectedPoint = null;
});

document.querySelector('select[name="degree"]').value = 2;
document.querySelector('input[name="size"]').value = 500;
resizeCanvas();
calculatePoints();