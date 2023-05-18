import * as React from 'react';
import { useEffect, useState } from 'react';
import { runInit } from './init-service';



export default function Init() {

    const [list, setList] = useState<string[]>([]);

    useEffect(() => {
        async function setInitInfo(canvas: HTMLCanvasElement) {
            const device = await runInit(canvas);
            if (typeof device === 'string') {
                setList([device])
            }
            let i: keyof GPUSupportedLimits
            let arr: string[] = [];
            for (i in (device as GPUDevice).limits) {
                arr.push(`${i}:${(device as GPUDevice).limits[i]}`);
            }
            setList(arr);
        }
        const canvasDom = document.getElementById('init')?.querySelector('canvas');
        if (canvasDom) {
            const devicePixelRatio = window.devicePixelRatio || 1;
            canvasDom.width = canvasDom.clientWidth * devicePixelRatio;
            canvasDom.height = canvasDom.clientHeight * devicePixelRatio;
            setInitInfo(canvasDom)
        }
    }, []);
    return (
        <div id='init' style={{ width: '100%', height: '100%' }}>
            <canvas style={{ width: '0', height: '0' }}></canvas>
            <h1 style={{ textAlign: 'center' }} >GPU配置</h1>
            {
                list.map((text: string) => <p style={{ textAlign: 'center' }} key={text}>{text}</p>)
            }
        </div>
    );
}