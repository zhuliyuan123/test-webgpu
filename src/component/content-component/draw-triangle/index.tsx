import * as React from 'react';
import { useEffect } from 'react';
import { runDrawTriangle } from './draw-triangle-service';
import { message } from 'antd';

export default function DrawTriangle() {
    const [messageApi] = message.useMessage();
    useEffect(() => {
        const canvasDom = document.getElementById('draw-triangle')?.querySelector('canvas');
        try {
            runDrawTriangle(canvasDom as HTMLCanvasElement);
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: `${error}`,
            })
        };
    }, [])
    return (
        <div id="draw-triangle" style={{ width: '100%', height: '100%', display: 'flex' }}>
            <canvas></canvas>
        </div>
    )
}