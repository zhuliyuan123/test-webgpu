import * as React from 'react';
import { useEffect } from 'react';
import { RenderMultiObjectBufferService } from './render-multi-objects-buffer-service';


export default function MultiObjectBuffer() {
    useEffect(() => {
        const canvasDom = document.getElementById('render-multi-objects-buffer')?.querySelector('canvas');
        const service = new RenderMultiObjectBufferService();
        service.init(canvasDom as HTMLCanvasElement);
        return () => {
            service.destroy();
        }
    }, [])
    return (
        <div id="render-multi-objects-buffer">
            <canvas></canvas>
        </div>
    )
}