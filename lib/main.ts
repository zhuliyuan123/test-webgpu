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
  const vertexShader = device.createShaderModule({
    code: triangleVert,
  })
  const fragmentShader = device.createShaderModule({
    code: redFrag,
  })
  const descriptor: GPURenderPipelineDescriptor = {
        layout: 'auto',
        vertex: {
            module: vertexShader,
            entryPoint: 'main'
        },
        primitive: {
            topology: 'triangle-list' // try point-list, line-list, line-strip, triangle-strip?
        },
        fragment: {
            module: fragmentShader,
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

// create & submit device commands
function draw(device: GPUDevice, context: GPUCanvasContext, pipeline: GPURenderPipeline) {
  // 获取 encoder 存储一系列的绘制工作
  const commandEncoder = device.createCommandEncoder();

  // 申请一个渲染通道
  const renderPass = commandEncoder.beginRenderPass({
    colorAttachments: [{
      view: context.getCurrentTexture().createView(),
      loadOp: 'clear',
      clearValue: { r: 0, g: 0, b: 0, a: 1.0 },
      storeOp: 'store'
    }]
  })

  
  renderPass.setPipeline(pipeline);
  renderPass.draw(3); // 并行运行3次，会输出3个坐标

  renderPass.end();
  // 写入 encoder 完成，生成 buffer，给 GPU 处理
  const buffer = commandEncoder.finish();
  device.queue.submit([buffer]);
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

  draw(device, context, pipeline);
}