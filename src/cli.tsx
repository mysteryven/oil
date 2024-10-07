import React from 'react'
import App from './app.tsx';
// import { withFullScreen } from './fullScreen/FullScreenBox.tsx';
import { render } from 'ink';

let currentDir = process.cwd()

render(<App initialDir={currentDir} />)

// withFullScreen(<App initialDir={currentDir} />)



