@binding(0) @group(0) var<storage> mvpMatrix : array<mat4x4<f32>>;

struct VertexOutput {
    @builtin(position) Position : vec4<f32>,
    @location(0) color: vec4<f32>
};

@vertex
fn main(
    @builtin(instance_index) index: u32,
    @location(0) position: vec4<f32>, 
) -> VertexOutput {
    var output : VertexOutput;
    output.Position = mvpMatrix[index] * position;
    output.color = 0.5 * (position + vec4<f32>(1.0, 1.0, 1.0, 1.0));
    return output;
}