import React from 'react'
import { withFullScreen } from "fullscreen-ink";
import App from './app.js';

let currentDir = process.cwd()

withFullScreen(<App initialDir={currentDir}  />, {
    debug: true
}).start();




