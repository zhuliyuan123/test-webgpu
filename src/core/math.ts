import { mat4, vec3 } from 'gl-matrix';



function getModelViewMatrix(
    position = { x: 0, y: 0, z: 0 },
    rotation = { x: 0, y: 0, z: 0 },
    scale = { x: 1, y: 1, z: 1 }
) {
    // get modelView Matrix
    const modelViewMatrix = mat4.create()
    // translate position
    mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(position.x, position.y, position.z))
    // rotate
    mat4.rotateX(modelViewMatrix, modelViewMatrix, rotation.x)
    mat4.rotateY(modelViewMatrix, modelViewMatrix, rotation.y)
    mat4.rotateZ(modelViewMatrix, modelViewMatrix, rotation.z)
    // scale
    mat4.scale(modelViewMatrix, modelViewMatrix, vec3.fromValues(scale.x, scale.y, scale.z))

    // return matrix as Float32Array
    return modelViewMatrix as Float32Array;
}


function getProjectionMatrix(
    aspect: number,
    fov: number = 60 / 180 * Math.PI,
    near: number = 0.1,
    far: number = 100.0,
    position = { x: 0, y: 0, z: 0 }
) {

    const projectionMatrix = mat4.create();
    // 创建透视空间矩阵
    mat4.perspective(projectionMatrix, fov, aspect, near, far);
    return projectionMatrix as Float32Array;
}

export function getMvpMatrix(
    aspect: number,
    position: { x: number, y: number, z: number },
    rotation: { x: number, y: number, z: number },
    scale: { x: number, y: number, z: number }
) {

    const modelViewMatrix = getModelViewMatrix(position, rotation, scale);

    const projectionMatrix = getProjectionMatrix(aspect);

    const mvpMatrix = mat4.create();

    mat4.multiply(mvpMatrix, projectionMatrix, modelViewMatrix);

    return mvpMatrix as Float32Array;
}