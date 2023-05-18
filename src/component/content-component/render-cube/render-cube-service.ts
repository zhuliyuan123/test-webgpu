import { initWebGPU } from '@core/init-web-gpu';

export class RenderCubeService {
    private device!: GPUDevice;
    private context!: GPUCanvasContext;

    public async init(canvas: HTMLCanvasElement) {
        const { context, format, device } = await initWebGPU(canvas);
        this.context = context;
        this.device = device;
    }
}