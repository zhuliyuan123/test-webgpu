import { initWebGPU } from '../../../core/init-web-gpu';

export async function runInit(canvasDom: HTMLCanvasElement): Promise<GPUDevice | string> {
    try {
        const { device } = await initWebGPU(canvasDom);
        return device;
    } catch (error) {
        return error as string;
    }
}