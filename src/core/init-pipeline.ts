import positionVert from '../shaders/position.vert.wgsl?raw';
import redFrag from '../shaders/red.frag.wgsl?raw';

export interface VertexData {
    vertex: Float32Array,
    vertexBuffer: GPUBuffer,
    vertexCount: number,
}

export interface ColorData {
    color: Float32Array,
    colorBuffer: GPUBuffer,
    colorGroup: GPUBindGroup,
}

interface IInitPipeline {
    pipeline: GPURenderPipeline,
    vertexData: VertexData,
    colorData: ColorData,
}

export async function initPipeline(device: GPUDevice, format: GPUTextureFormat): Promise<IInitPipeline> {
    const vertex = new Float32Array([
        // xyz
        0, 0.5, 0,
        -0.5, -0.5, 0,
        0.5, -0.5, 0,
    ])

    const color = new Float32Array([1, 1, 0, 1]);

    // 申请一个 GPU 内存
    const vertexBuffer = device.createBuffer({
        size: vertex.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    const colorBuffer = device.createBuffer({
        size: color.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(vertexBuffer, 0, vertex);
    device.queue.writeBuffer(colorBuffer, 0, color);


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

    const colorGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{
            binding: 0,
            resource: {
                buffer: colorBuffer,
            }
        }]
    })


    const vertexData = {
        vertex,
        vertexBuffer,
        vertexCount: 3
    }

    const colorData = {
        color,
        colorBuffer,
        colorGroup,
    }

    return {
        pipeline,
        vertexData,
        colorData,
    }
}