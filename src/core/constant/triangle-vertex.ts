const vertex = new Float32Array([
    0.0, 0.5, 0.0,
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0
])

const vertexCount = 3

const changeVertex = (offset: number): Float32Array => {
    return new Float32Array([
        // xyz
        0 + offset, 0.5, 0,
        -0.5 + offset, -0.5, 0,
        0.5 + offset, -0.5, 0,
    ])
}

export { vertex, vertexCount, changeVertex }