
const bezier_points = (points) => {
    return Array(state.stepSize + 1).fill(0).map(
        (_, index) => bezier(points, index / state.stepSize) 
    )
}

bezier = (points, t) => {
    switch(state.generator){
        case 1:
            return de_casteljau_bezier(points, t, points.length - 1, 0)
        case 2:
            return berstein_bezier(points,t )
    }
}

const berstein_bezier = (points, t) => {
    return points.reduce(
        (acumulator, point, index, arr) => {
            return sum(acumulator, scale( berstein(arr.length - 1, index, t), point )) 
        }
    , { x: 0, y: 0 })
}

const de_casteljau_bezier = (points, t, r, i) => {
    if (r === 0) {
        console.log(points[i])
        return points[i];
    } else {
        return sum(
            scale((1 - t), de_casteljau_bezier(points, t, r- 1, i)), 
            scale(t, de_casteljau_bezier(points,t, r - 1,i + 1))
        )
    }
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
