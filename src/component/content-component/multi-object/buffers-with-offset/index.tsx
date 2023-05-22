import * as React from 'react';
import { useEffect } from 'react';
import { RenderMultiObjectBufferWithOffsetService } from './render-multi-objects-buffer-with-offset-service';


export default function MultiObjectBufferWithOffset() {
    useEffect(() => {
        const canvasDom = document.getElementById('render-multi-objects-buffer-with-offset')?.querySelector('canvas');
        const renderCubeService = new RenderMultiObjectBufferWithOffsetService();
        // renderCubeService.init(canvasDom as HTMLCanvasElement);
    }, []);
    return (
        <div id="render-multi-objects-buffer-with-offset" >
            <canvas></canvas>
        </div>
    );
};