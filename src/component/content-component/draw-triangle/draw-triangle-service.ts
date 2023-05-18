import { initWebGPU } from '@core/init-web-gpu';
import { initPipeline } from '@core/init-pipeline';
import type { RGB } from '@core/constant/color';
import { draw } from '@core/draw';
import { RED_RGBA } from '@core/constant/color';
import { changeVertex, vertexCount } from '@core/constant/triangle-vertex';
import positionVert from '@/shaders/position.vert.wgsl?raw';
import redFrag from '@/shaders/red.frag.wgsl?raw';



export class DrawTriangleService {
    private device!: GPUDevice;
    private context!: GPUCanvasContext;
    private vertexBuffer!: GPUBuffer;
    private colorBuffer!: GPUBuffer;
    private bindGroup!: GPUBindGroup;
    private pipeline!: GPURenderPipeline;


    public async init(canvas: HTMLCanvasElement) {
        const { context, format, device } = await initWebGPU(canvas);
        this.device = device;
        this.context = context;
        this.setVertexBuffer(50);
        this.setColorBuffer({
            r: RED_RGBA.r,
            g: RED_RGBA.g,
            b: RED_RGBA.b,
        });
        this.pipeline = await initPipeline(device, format, {
            vertexCode: positionVert,
            fragmentCode: redFrag,
        });
        this.setColorGroup();
        this.draw();
    }

    public changeColor(color: RGB) {
        this.setColorBuffer(color);
        this.draw();
    }

    public changePosition(value: number) {
        this.setVertexBuffer(value);
        this.draw();
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

    private setVertexBuffer(offset: number) {
        const vertex = changeVertex((offset - 50) / 100)
        if (!this.vertexBuffer) {
            this.vertexBuffer = this.device.createBuffer({
                size: vertex.byteLength,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            });
        }
        this.device.queue.writeBuffer(this.vertexBuffer, 0, vertex);
    }

    private setColorBuffer(colorRGB: RGB) {
        const color = new Float32Array([colorRGB.r, colorRGB.g, colorRGB.b, 1]);
        if (!this.colorBuffer) {
            this.colorBuffer = this.device.createBuffer({
                size: color.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
        }
        this.device.queue.writeBuffer(this.colorBuffer, 0, color);
    }

    private setColorGroup() {
        this.bindGroup = this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: {
                    buffer: this.colorBuffer,
                }
            }]
        })
    }
}
