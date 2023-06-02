import { initWebGPU } from '@core/init-web-gpu';
import { vertex, vertexCount } from '@core/constant/cube-with-uv-vertex';
import { draw } from '@core/draw';
import vertCode from '../shaders/vert.wgsl?raw';
import fragCode from '../shaders/frag.wgsl?raw';
import { getMvpMatrix } from '@core/math';
import textureUrl from '/texture.webp?url';


export class ImageTextureService {
    private device!: GPUDevice;
    private context!: GPUCanvasContext;
    private vertexBuffer!: GPUBuffer;
    private mvpMatrix!: GPUBuffer;
    private bindGroup!: GPUBindGroup;
    private pipeline!: GPURenderPipeline;
    private animationFrameId!: number;
    private texture!: GPUTexture;
    private sampler!: GPUSampler;
    private textureGroup!: GPUBindGroup;

    public async init(canvas: HTMLCanvasElement) {
        const { context, format, device, size } = await initWebGPU(canvas);
        this.context = context;
        this.device = device;
        this.setVertexBuffer();
        this.pipeline = await this.initPipeline(format);
        const rotation = { x: 0, y: 0, z: 0 }
        this.setMvpMatrix(size.width / size.height, rotation);
        this.setTexture();
        this.setSampler();
        this.toBindGroup();
        this.loop(size.width / size.height, rotation);
    }

    public destroy() {
        this.device.destroy();
        cancelAnimationFrame(this.animationFrameId);
    }

    private loop(aspect: number, rotation: {
        x: number,
        y: number,
        z: number,
    }) {
        const now = Date.now() / 1000;
        rotation.x = Math.sin(now);
        rotation.y = Math.cos(now);
        this.setMvpMatrix(aspect, rotation);
        this.draw();
        this.animationFrameId = requestAnimationFrame(() => {
            this.loop(aspect, rotation)
        })
    }

    private draw() {
        draw(this.device, this.context.getCurrentTexture().createView(), {
            pipeline: this.pipeline,
            vertexData: {
                vertexBuffer: this.vertexBuffer,
                vertexCount,
            },
            groupData: {
                groupArr: [this.bindGroup],
            }
        });
    }

    private setVertexBuffer() {
        const cubeVertex = vertex;
        this.vertexBuffer = this.device.createBuffer({
            size: cubeVertex.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })
        this.device.queue.writeBuffer(this.vertexBuffer, 0, cubeVertex);
    }

    private setMvpMatrix(aspect: number, rotation: {
        x: number,
        y: number,
        z: number,
    }) {
        const position = { x: 0, y: 0, z: -8 };
        const scale = { x: 1, y: 1, z: 1 };
        if (!this.mvpMatrix) {
            this.mvpMatrix = this.device.createBuffer({
                size: 4 * 4 * 4,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            })
        }
        this.device.queue.writeBuffer(this.mvpMatrix, 0, getMvpMatrix(aspect, position, rotation, scale))
    }

    private toBindGroup() {
        this.bindGroup = this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: {
                    buffer: this.mvpMatrix,
                }
            }]
        })
        this.textureGroup = this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(1),
            entries: [{
                binding: 0,
                resource: this.sampler,
            }, {
                binding: 1,
                resource: this.texture.createView(),
            }]
        })
    }

    private async initPipeline(format: GPUTextureFormat) {
        const descriptor: GPURenderPipelineDescriptor = {
            layout: 'auto',
            vertex: {
                module: this.device.createShaderModule({
                    code: vertCode,
                }),
                entryPoint: 'main',
                buffers: [{
                    arrayStride: 5 * 4,
                    attributes: [{
                        shaderLocation: 0,
                        offset: 0,
                        format: 'float32x3'
                    }, {
                        shaderLocation: 1,
                        offset: 3 * 4,
                        format: 'float32x2'
                    }]
                }]
            },
            primitive: {
                topology: 'triangle-list', // try point-list, line-list, line-strip, triangle-strip?
                cullMode: 'back',
            },
            fragment: {
                module: this.device.createShaderModule({
                    code: fragCode,
                }),
                entryPoint: 'main',
                targets: [
                    {
                        format: format
                    }
                ]
            },
        }
        const pipeline = await this.device.createRenderPipelineAsync(descriptor);
        return pipeline;
    }

    private async setTexture() {
        const res = await fetch(textureUrl);
        const img = await res.blob();
        const bitmap = await createImageBitmap(img)
        const textureSize = [bitmap.width, bitmap.height]
        this.texture = this.device.createTexture({
            size: textureSize,
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
        });
        this.device.queue.copyExternalImageToTexture(
            { source: bitmap },
            { texture: this.texture },
            textureSize,
        )
    }

    private setSampler() {
        this.sampler = this.device.createSampler({
            magFilter: 'linear',
            minFilter: 'linear',
        })
    }
}