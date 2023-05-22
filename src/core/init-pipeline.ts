export interface VertexData {
    vertexBuffer: GPUBuffer,
    vertexCount: number,
}

export interface GroupData {
    groupArr: GPUBindGroup[],
    offsetNumber?: number;
}

export interface ShaderCode {
    vertexCode: string;
    fragmentCode: string;
}


export async function initPipeline(device: GPUDevice, format: GPUTextureFormat, shaderCode: ShaderCode, layout?: GPUPipelineLayout): Promise<GPURenderPipeline> {
    const { vertexCode, fragmentCode } = shaderCode;
    const descriptor: GPURenderPipelineDescriptor = {
        layout: layout ?? 'auto',
        vertex: {
            module: device.createShaderModule({
                code: vertexCode,
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
            topology: 'triangle-list', // try point-list, line-list, line-strip, triangle-strip?
            cullMode: 'back',
        },
        fragment: {
            module: device.createShaderModule({
                code: fragmentCode,
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