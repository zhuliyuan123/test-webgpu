import type { VertexData, ColorData } from './init-pipeline';

export function draw(device: GPUDevice, context: GPUCanvasContext, pipeline: GPURenderPipeline, vertexData: VertexData, colorData: ColorData) {
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
    device.queue.submit([commandEncoder.finish()]);
}