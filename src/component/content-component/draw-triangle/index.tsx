import * as React from 'react';
import { useEffect, useState } from 'react';
import { DrawTriangleService } from './draw-triangle-service';
import { message, ColorPicker, Slider } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { RED_RGBA } from '../../../core/constant/color';
import './index.css';

export default function DrawTriangle() {
    const [messageApi] = message.useMessage();
    const [color, setColor] = useState<Color | string>(`rgb(${RED_RGBA.r * 255}, ${RED_RGBA.g * 255}, ${RED_RGBA.b * 255})`);
    const [drawTriangleService, setDrawTriangleService] = useState<DrawTriangleService | null>(null);
    useEffect(() => {
        const canvasDom = document.getElementById('draw-triangle')?.querySelector('canvas');
        try {
            const drawTriangleService = new DrawTriangleService();
            drawTriangleService.init(canvasDom as HTMLCanvasElement);
            setDrawTriangleService(drawTriangleService);
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
            <div className='color-picker-btn'>
                <div style={{ height: '32px', lineHeight: '32px' }}>切换颜色：</div>
                <ColorPicker value={color} onChange={(value: Color) => {
                    drawTriangleService && drawTriangleService.changeColor({
                        r: value.toRgb().r / 255,
                        g: value.toRgb().g / 255,
                        b: value.toRgb().b / 255,
                    })
                    setColor(value);
                }} />
            </div>
            <div className='slider-btn'>
                <div style={{ height: '32px', lineHeight: '32px' }}>移动位置：</div>
                <Slider
                    style={{ width: '600px' }}
                    defaultValue={50}
                    marks={{
                        50: '原位'
                    }}
                    onChange={(value) => {
                        drawTriangleService && drawTriangleService.changePosition(value);
                    }}
                />
            </div>
        </div>
    )
}