import * as React from 'react';
import { useState } from 'react';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import './index.css';
import { MENU_TYPE } from './constant';
import ShowerContent from './content';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}


const items: MenuItem[] = [
    getItem('初始化', MENU_TYPE.INIT),
    getItem('画一个三角形', MENU_TYPE.DRAW_TRIANGLE),
    getItem('进行3D渲染', MENU_TYPE.RENDERING_3D),
];

export default function Main() {
    const [menuId, setMenuId] = useState(MENU_TYPE.INIT);
    return (
        <div className='main'>
            <div style={{ width: 256, height: '100%' }}>
                <h3 style={{ 'textAlign': 'center' }}>webGPU练习</h3>
                <Menu
                    defaultSelectedKeys={[menuId]}
                    mode="inline"
                    inlineCollapsed={false}
                    items={items}
                    onSelect={({ key }) => {
                        setMenuId(key as MENU_TYPE);
                    }}
                />
            </div>
            <ShowerContent menuId={menuId}></ShowerContent>
        </div>
    )
}