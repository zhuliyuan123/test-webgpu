import * as React from 'react';
import { MENU_TYPE } from './constant';
import './content.css';
import Init from './content-component/init/init';
import DrawTriangle from './content-component/draw-triangle';
import RenderCube from './content-component/render-cube';
import MultiObjectBuffer from './content-component/multi-object/buffers';
import MultiObjectBufferWithOffset from './content-component/multi-object/buffers-with-offset';
import MultiObjectDynamicOffset from './content-component/multi-object/dynamic-offset';
import MultiObjectInstance from './content-component/multi-object/instance';

interface IContentProps {
    menuId: string;
}

export default function ShowerContent(props: IContentProps) {
    const { menuId } = props;
    return (
        <div className='content'>
            {menuId === MENU_TYPE.INIT ? <Init></Init> : null}
            {menuId === MENU_TYPE.DRAW_TRIANGLE ? <DrawTriangle></DrawTriangle> : null}
            {menuId === MENU_TYPE.RENDER_CUBE ? <RenderCube></RenderCube> : null}
            {menuId === MENU_TYPE.MULTI_OBJECTS_BUFFERS ? <MultiObjectBuffer></MultiObjectBuffer> : null}
            {menuId === MENU_TYPE.MULTI_OBJECTS_BUFFERS_WITH_OFFSET ? <MultiObjectBufferWithOffset /> : null}
            {menuId === MENU_TYPE.MULTI_OBJECTS_DYNAMIC_OFFSET ? <MultiObjectDynamicOffset /> : null}
            {menuId === MENU_TYPE.MULTI_OBJECTS_INSTANCE ? <MultiObjectInstance /> : null}
        </div>
    )
}