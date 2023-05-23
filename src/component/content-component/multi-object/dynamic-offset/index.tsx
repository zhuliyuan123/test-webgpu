import * as React from 'react';
import { useEffect } from 'react';
import { MultiObjectDynamicWithOffsetService } from './multi-objects-dynamic-offset-service';


export default function MultiObjectDynamicOffset() {
    useEffect(() => {
        const canvasDom = document.getElementById('render-multi-objects-dynamic-offset')?.querySelector('canvas');
        const service = new MultiObjectDynamicWithOffsetService();
        service.init(canvasDom as HTMLCanvasElement);
        return () => {
            service.destroy();
        }
    }, []);
    return (
        <div id="render-multi-objects-dynamic-offset" >
            <canvas></canvas>
        </div>
    );
};