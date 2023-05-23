import * as React from 'react';
import { useEffect } from 'react';
import { MultiObjectInstanceService } from './multi-object-instance-service';


export default function MultiObjectInstance() {
    useEffect(() => {
        const canvasDom = document.getElementById('render-multi-objects-instance')?.querySelector('canvas');
        const service = new MultiObjectInstanceService();
        service.init(canvasDom as HTMLCanvasElement);
    }, []);
    return (
        <div id="render-multi-objects-instance" >
            <canvas></canvas>
        </div>
    );
};