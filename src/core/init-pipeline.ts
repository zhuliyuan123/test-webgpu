import positionVert from '../shaders/position.vert.wgsl?raw';
import redFrag from '../shaders/red.frag.wgsl?raw';
export interface VertexData {
    vertexBuffer: GPUBuffer,
    vertexCount: number,
}

export interface ColorData {
    colorGroup: GPUBindGroup,
}


export async function initPipeline(device: GPUDevice, format: GPUTextureFormat): Promise<GPURenderPipeline> {
    const descriptor: GPURenderPipelineDescriptor = {
        layout: 'auto',
        vertex: {
            module: device.createShaderModule({
                code: positionVert,
            }),
            entryPoint: 'main',
            buffers: [{
                arrayStride: 3 * 4,
                attributes: [{
                    shaderLocation: 0,
                    offset: 0,
                    format: 'float32x3'
                }]
            }]
        },
        primitive: {
            topology: 'triangle-list' // try point-list, line-list, line-strip, triangle-strip?
        },
        fragment: {
            module: device.createShaderModule({
                code: redFrag,
            }),
            entryPoint: 'main',
            targets: [
                {
                    format: format
                }
            ]
        },
    }
    const pipeline = await device.createRenderPipelineAsync(descriptor);
    return pipeline;
}