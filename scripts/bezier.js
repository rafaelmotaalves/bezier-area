
const bezier_points = (points) => {
    return Array(101).fill(0).map(
        (_, index) => berstein_bezier(points, (index) / 100) 
    )
}

const berstein_bezier = (points, t) => {
    return points.reduce(
        (acumulator, point, index, arr) => {
            return sum(acumulator, scale( berstein(arr.length - 1, index, t), point )) 
        }
    , { x: 0, y: 0 })
}

const berstein = (n, k, t) => {
    return binomialCoef(n, k) * Math.pow(t, k) * Math.pow(1 - t, n - k);
}

const binomialCoef = (n, i) => {
    return fatorial(n) / (fatorial(i) * fatorial(n - i));
}

const fatorial = (num) => {
    return Array(num).fill(0).reduce((acc, _, index) => acc * (index + 1), 1);
}

const sum = (a, b) => ({ x: (a.x + b.x), y: (a.y + b.y)})

const scale = (k, vector) => ({ x: (vector.x * k), y: (vector.y * k )})
