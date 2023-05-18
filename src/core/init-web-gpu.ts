export interface IInitWebGPU {
    context: GPUCanvasContext;
    format: GPUTextureFormat;
    device: GPUDevice;
    size: {
        width: number;
        height: number;
    }
}


export async function initWebGPU(canvas: HTMLCanvasElement): Promise<IInitWebGPU> {
    if (!navigator.gpu) {
        throw new Error('Not Support WebGPU');
    }
    // 访问适配器，该方法接受一个可选的设置对象，其允许你请求一个高性能或者低功耗的适配器。如果没有可选的对象，设备将提供对默认适配器的访问，这对于大多数用途来说足够了。
    const adapter = await navigator.gpu.requestAdapter({
        powerPreference: 'high-performance',
    });

    if (!adapter) {
        throw Error("Couldn't request WebGPU adapter");
    }

    // 拿到设备
    const device = await adapter.requestDevice();

    // 拿到webGPU的上下文
    const context = canvas.getContext('webgpu') as GPUCanvasContext;

    // 获取用户的纹理格式
    // https://developer.mozilla.org/zh-CN/docs/Web/API/GPU/getPreferredCanvasFormat
    const format = navigator.gpu.getPreferredCanvasFormat();

    const size = {
        width: canvas.width,
        height: canvas.height,
    }

    context.configure({
        device,
        format,
        alphaMode: 'opaque'
    })

    return {
        context,
        format,
        device,
        size,
    }
}