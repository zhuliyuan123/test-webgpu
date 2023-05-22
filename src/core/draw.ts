import type { VertexData, GroupData } from './init-pipeline';


export interface DrawPipelineData {
    pipeline: GPURenderPipeline;
    vertexData: VertexData;
    groupData: GroupData;
}

export function draw(device: GPUDevice, view: GPUTextureView, drawPipelineData: DrawPipelineData) {
    // 获取 encoder 存储一系列的绘制工作
    const { pipeline, vertexData, groupData } = drawPipelineData;
    const commandEncoder = device.createCommandEncoder();
    const { vertexBuffer, vertexCount } = vertexData;
    const { groupArr } = groupData;

    // 申请一个渲染通道
    const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
            view,
            loadOp: 'clear',
            clearValue: { r: 0, g: 0, b: 0, a: 1.0 },
            storeOp: 'store'
        }]
    })


    renderPass.setPipeline(pipeline);
    renderPass.setVertexBuffer(0, vertexBuffer);
    groupArr.forEach((group) => {
        const { offsetNumber } = groupData;
        if (offsetNumber) {
            for (let i = 0; i < offsetNumber; i++) {
                renderPass.setBindGroup(0, group, [256 * i]);
                renderPass.draw(vertexCount); // 并行运行3次，会输出3个坐标
            }
            return;
        }
        renderPass.setBindGroup(0, group);
        renderPass.draw(vertexCount); // 并行运行3次，会输出3个坐标
    });
    renderPass.end();
    // 写入 encoder 完成，生成 buffer，给 GPU 处理
    device.queue.submit([commandEncoder.finish()]);
}