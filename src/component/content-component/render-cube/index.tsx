import * as React from 'react';
import { useEffect } from 'react';
import { RenderCubeService } from './render-cube-service';

export default function RenderCube() {
    useEffect(() => {
        const canvasDom = document.getElementById('render-cube')?.querySelector('canvas');
        const renderCubeService = new RenderCubeService();
        renderCubeService.init(canvasDom as HTMLCanvasElement);
    }, [])
    return (
        <div id="render-cube">
            <canvas></canvas>
        </div>
    )
}