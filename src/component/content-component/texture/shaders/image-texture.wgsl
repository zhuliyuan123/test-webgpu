@group(1) @binding(0) var Sampler: sampler;
@group(1) @binding(1) var Texture: texture_2d<f32>;


@stage(fragment)
fn main(
    @localtion(0) fragUV: vec2<f32>,
    @localtion(1) fragPosition: vec4<f32>
) -> @localtion(0) vec4<f32> {
    return textureSample(Texture, Sampler, fragUV) * fragPosition;
}
