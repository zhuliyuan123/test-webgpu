import { createRoot } from 'react-dom/client';
import * as React from 'react';
import Main from './component';


if (document.getElementById('app')) {
    const root = createRoot(document.getElementById('app') as HTMLElement);
    root.render(<Main></Main>)
}
