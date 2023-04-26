import triangleVert from '../src/shaders/triangle.vert.wgsl?raw';
import redFrag from '../src/shaders/red.frag.wgsl?raw';

// 初始化 webGPU device & config canvas context
async function initWebGPU(canvas: HTMLCanvasElement) {
  // 获取设备访问权限
  if (!navigator.gpu) {
    throw new Error('Not Support WebGPU');
  }

  // 访问适配器，该方法接受一个可选的设置对象，其允许你请求一个高性能或者低功耗的适配器。如果没有可选的对象，设备将提供对默认适配器的访问，这对于大多数用途来说足够了。
  const adapter = await navigator.gpu.requestAdapter({
    powerPreference: 'high-performance',
  });
  if (!adapter) {
    throw Error("Couldn't request WebGPU adapter.");
  }

  // 拿到设备
  const device = await adapter.requestDevice();

  // 颜色编码格式
  const format = navigator.gpu.getPreferredCanvasFormat();

  // 拿到webGPU的上下文
  const context = canvas.getContext('webgpu') as GPUCanvasContext;
  // 配置 context
  context.configure({
    device,
    format,
  })

  return {
    context,
    format,
    device,
  }
}  

async function initPipeline(device: GPUDevice, format: GPUTextureFormat): Promise<GPURenderPipeline> {
  const descriptor: GPURenderPipelineDescriptor = {
        layout: 'auto',
        vertex: {
            module: device.createShaderModule({
                code: triangleVert
            }),
            entryPoint: 'main'
        },
        primitive: {
            topology: 'triangle-list' // try point-list, line-list, line-strip, triangle-strip?
        },
        fragment: {
            module: device.createShaderModule({
                code: redFrag
            }),
            entryPoint: 'main',
            targets: [
                {
                    format: format
                }
            ]
        }
    }
    return await device.createRenderPipelineAsync(descriptor)
  
}



export async function run() {
  const canvas = document.querySelector('canvas');
  if (!canvas) {
    throw new Error('No Canvas')
  }
  const devicePixelRatio = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * devicePixelRatio;
  canvas.height = canvas.clientHeight * devicePixelRatio;
  const { context, format, device } = await initWebGPU(canvas);

  // 获取 pipeline
  const pipeline = await initPipeline(device, format);
  
}