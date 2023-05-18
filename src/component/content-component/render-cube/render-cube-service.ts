import { initWebGPU } from '@core/init-web-gpu';
import { initPipeline } from '@core/init-pipeline';
import { vertex, vertexCount } from '@core/constant/cube-vertex';
import { draw } from '@core/draw';
import { RED_RGBA } from '@core/constant/color';
import cubeVert from '@/shaders/cube.vert.wgsl?raw';
import cubeColorFrag from '@/shaders/cube.color.frag.wgsl?raw';
import { getMvpMatrix } from '@core/math';


export class RenderCubeService {
    private device!: GPUDevice;
    private context!: GPUCanvasContext;
    private vertexBuffer!: GPUBuffer;
    private mvpMatrix!: GPUBuffer;
    private bindGroup!: GPUBindGroup;
    private pipeline!: GPURenderPipeline;
    private colorBuffer!: GPUBuffer;

    public async init(canvas: HTMLCanvasElement) {
        const { context, format, device, size } = await initWebGPU(canvas);
        this.context = context;
        this.device = device;
        this.setVertexBuffer();
        this.setColorBuffer();
        this.pipeline = await initPipeline(device, format, {
            vertexCode: cubeVert,
            fragmentCode: cubeColorFrag,
        });
        const rotation = { x: 0, y: 0, z: 0 }
        this.setMvpMatrix(size.width / size.height, rotation);
        this.toBindGroup();
        this.loop(size.width / size.height, rotation);
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
        requestAnimationFrame(() => {
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
            colorData: {
                colorGroup: this.bindGroup,
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

    private setColorBuffer() {
        const color = new Float32Array([RED_RGBA.r, RED_RGBA.g, RED_RGBA.b, RED_RGBA.a]);
        this.colorBuffer = this.device.createBuffer({
            size: color.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })
        this.device.queue.writeBuffer(this.colorBuffer, 0, color);

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
                    buffer: this.colorBuffer
                }
            }, {
                binding: 1,
                resource: {
                    buffer: this.mvpMatrix,
                }
            }]
        })

    }
}