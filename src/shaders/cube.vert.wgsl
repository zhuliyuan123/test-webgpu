@group(0) @binding(1) var<uniform> mvp: mat4x4<f32>;

struct VertexOutput {
    @builtin(position) Position : vec4<f32>,
    @location(0) positionColor: vec4<f32>,
}

@vertex
fn main(@location(0) position: vec4<f32>) -> VertexOutput {
    var out: VertexOutput;
    out.Position = mvp * position;
    out.positionColor = ( position + vec4(1.0, 1.0, 1.0, 1.0) ) * 0.5;
    return out;
}