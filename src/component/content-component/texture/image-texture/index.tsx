import * as React from 'react';
import { useEffect } from 'react';
import { ImageTextureService } from './image-texture-service';

export default function ImageTexture() {
    useEffect(() => {
        const canvasDom = document.getElementById('render-image-texture')?.querySelector('canvas');
        const service = new ImageTextureService();
        service.init(canvasDom as HTMLCanvasElement);
        return () => {
            service.destroy();
        }
    }, [])
    return (
        <div id="render-image-texture">
            <canvas></canvas>
        </div>
    )
}