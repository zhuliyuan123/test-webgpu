import { initWebGPU } from '../../../core/init-web-gpu';
import { initPipeline } from '../../../core/init-pipeline';
import { draw } from '../../../core/draw';


export async function runDrawTriangle(canvas: HTMLCanvasElement) {
    const { context, format, device } = await initWebGPU(canvas);

    // 获取 pipeline
    const { pipeline, vertexData, colorData } = await initPipeline(device, format);

    // 进行画图
    draw(device, context, pipeline, vertexData, colorData);
}