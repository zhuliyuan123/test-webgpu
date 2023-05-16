import positionVert from '../src/shaders/position.vert.wgsl?raw';
import redFrag from '../src/shaders/red.frag.wgsl?raw';


interface VertexData {
  vertex: Float32Array,
  vertexBuffer: GPUBuffer,
  vertexCount: number,
}

interface ColorData {
  color: Float32Array,
  colorBuffer: GPUBuffer,
  colorGroup: GPUBindGroup,
}

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

async function initPipeline(device: GPUDevice, format: GPUTextureFormat): Promise<{
  pipeline: GPURenderPipeline,
  vertexData: VertexData,
  colorData: ColorData,
}> {
  // js cpu 内存存储
  const vertex = new Float32Array([
    // xyz
    0, 0.5, 0,
    -0.5, -0.5, 0,
    0.5, -0.5, 0,
  ])

  const color = new Float32Array([1, 1, 0, 1]);

  // 申请一个 GPU 内存
  const vertexBuffer = device.createBuffer({
    size: vertex.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  })

  const colorBuffer = device.createBuffer({
    size: color.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  })


  // 将 cpu 变量写入 GPU 显存
  device.queue.writeBuffer(vertexBuffer, 0, vertex);
  device.queue.writeBuffer(colorBuffer, 0, color);


  const vertexShader = device.createShaderModule({
    code: positionVert,
  })
  const fragmentShader = device.createShaderModule({
    code: redFrag,
  })
  const descriptor: GPURenderPipelineDescriptor = {
    layout: 'auto',
    vertex: {
      module: vertexShader,
      entryPoint: 'main',
      buffers: [{
        arrayStride: 3 * 4,
        attributes: [{
          shaderLocation: 0,
          offset: 0,
          format: 'float32x3'
        }]
      }]
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

  const pipeline = await device.createRenderPipelineAsync(descriptor);

  const colorGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [{
      binding: 0,
      resource: {
        buffer: colorBuffer,
      }
    }]
  })

  const vertexData = {
    vertex,
    vertexBuffer,
    vertexCount: 3
  }

  const colorData = {
    color,
    colorBuffer,
    colorGroup,
  }



  return {
    pipeline,
    vertexData,
    colorData,
  }
}

// create & submit device commands
function draw(device: GPUDevice, context: GPUCanvasContext, pipeline: GPURenderPipeline, vertexData: VertexData, colorData: ColorData) {
  // 获取 encoder 存储一系列的绘制工作
  const commandEncoder = device.createCommandEncoder();
  const { vertexBuffer, vertexCount } = vertexData;
  const { colorGroup } = colorData;

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
  renderPass.setVertexBuffer(0, vertexBuffer);
  renderPass.setBindGroup(0, colorGroup);
  renderPass.draw(vertexCount); // 并行运行3次，会输出3个坐标

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
  const { pipeline, vertexData, colorData } = await initPipeline(device, format);

  draw(device, context, pipeline, vertexData, colorData);
}