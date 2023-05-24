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
    getItem('渲染立方体', MENU_TYPE.RENDER_CUBE),
    getItem('多资源绑定', MENU_TYPE.MULTI_OBJECTS, null, [
        getItem('创建多个 buffer', MENU_TYPE.MULTI_OBJECTS_BUFFERS),
        getItem('buffer + offset', MENU_TYPE.MULTI_OBJECTS_BUFFERS_WITH_OFFSET),
        getItem('动态 offset', MENU_TYPE.MULTI_OBJECTS_DYNAMIC_OFFSET),
        getItem('实例', MENU_TYPE.MULTI_OBJECTS_INSTANCE),
    ]),
    getItem('贴图', MENU_TYPE.TEXTURE, null, [
        getItem('图片贴图', MENU_TYPE.IMAGE_TEXTURE),
        getItem('canvas 贴图', MENU_TYPE.CANVAS_TEXTURE),
        getItem('视频贴图', MENU_TYPE.VIDEO_TEXTURE),
    ]),
];

export default function Main() {
    const [menuId, setMenuId] = useState(MENU_TYPE.IMAGE_TEXTURE);
    return (
        <div className='main'>
            <div style={{ width: 256, height: '100%' }}>
                <h3 style={{ 'textAlign': 'center' }}>webGPU练习</h3>
                <Menu
                    defaultSelectedKeys={[menuId]}
                    defaultOpenKeys={[MENU_TYPE.MULTI_OBJECTS, MENU_TYPE.TEXTURE]}
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