import * as React from 'react';
import { MENU_TYPE } from './constant';
import './content.css';
import Init from './content-component/init/init';
import DrawTriangle from './content-component/draw-triangle';

interface IContentProps {
    menuId: string;
}

export default function ShowerContent(props: IContentProps) {
    const { menuId } = props;
    return (
        <div className='content'>
            {menuId === MENU_TYPE.INIT ? <Init></Init> : null}
            {menuId === MENU_TYPE.DRAW_TRIANGLE ? <DrawTriangle></DrawTriangle> : null}
        </div>
    )
}