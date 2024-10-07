import React from 'react'
import App from './app.tsx';
import { withFullScreen } from './fullScreen/FullScreenBox.tsx';

let currentDir = process.cwd()

withFullScreen(<App initialDir={currentDir} />, {
    debug: true
}).start();




