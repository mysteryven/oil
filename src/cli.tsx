import React from 'react'
import meow from 'meow'
import App from './app.tsx';
import { render } from 'ink';

const cli = meow(
    `
		Usage
		  $ oil

        More example, please see: https://github.com/mysteryven/oil
	`,
    {
        importMeta: import.meta,
    },
);

let currentDir = process.cwd()
render(<App initialDir={currentDir} />)




