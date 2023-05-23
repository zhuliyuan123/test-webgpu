import { initWebGPU } from '@core/init-web-gpu';
import { initPipeline } from '@core/init-pipeline';
import fragCode from './shaders/frag.wgsl?raw';
import vertCode from './shaders/vert.wgsl?raw';
import { getMvpMatrix } from '@core/math';
import { draw } from '@core/draw';
import { vertex, vertexCount } from '@core/constant/cube-vertex';


const CUBE_NUMBER: number = 30000;

export class MultiObjectInstanceService {
    private device!: GPUDevice;
    private context!: GPUCanvasContext;
    private vertexBuffer!: GPUBuffer;
    private mvpMatrixArr!: GPUBuffer;
    private bindGroup!: GPUBindGroup;
    private positionArr: { x: number, y: number, z: number }[] = [];
    private pipeline!: GPURenderPipeline;
    private mvpBuffer: Float32Array = new Float32Array(CUBE_NUMBER * 4 * 4);
    private animationFrameId!: number;

    public async init(canvas: HTMLCanvasElement) {
        const { context, format, device, size } = await initWebGPU(canvas);
        this.context = context;
        this.device = device;
        this.pipeline = await initPipeline(device, format, {
            vertexCode: vertCode,
            fragmentCode: fragCode,
        });
        this.setVertexBuffer();
        const rotation = { x: 0, y: 0, z: 0 }
        this.setMvpMatrix(size.width / size.height, rotation, true);
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
        rotation.x = now;
        rotation.y = now;
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
            },
            instanceCount: CUBE_NUMBER,
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
    }, isCreate?: boolean) {
        const scale = { x: 1, y: 1, z: 1 };
        if (!this.mvpMatrixArr) {
            this.mvpMatrixArr = this.device.createBuffer({
                size: 4 * 4 * 4 * CUBE_NUMBER,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            });
        }
        for (let i = 0; i < CUBE_NUMBER; i++) {
            if (isCreate) {
                this.positionArr.push({ x: Math.random() * 40 - 20, y: Math.random() * 40 - 20, z: - 50 - Math.random() * 50 })
            }
            // 性能优化一起写入 GPU 的 buffer 中
            // this.device.queue.writeBuffer(this.mvpMatrixArr, i * 4 * 4 * 4, getMvpMatrix(aspect, this.positionArr[i], {
            //     x: Math.sin(rotation.x + i),
            //     y: Math.cos(rotation.y + i),
            //     z: rotation.z,
            // }, scale))
            const mvpMatrix = getMvpMatrix(aspect, this.positionArr[i], {
                x: Math.sin(rotation.x + i),
                y: Math.cos(rotation.y + i),
                z: rotation.z,
            }, scale)
            this.mvpBuffer.set(mvpMatrix, i * 4 * 4);
        }
        this.device.queue.writeBuffer(this.mvpMatrixArr, 0, this.mvpBuffer);
    }

    private toBindGroup() {
        this.bindGroup = this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: {
                    buffer: this.mvpMatrixArr,
                }
            }]
        });
    }
}