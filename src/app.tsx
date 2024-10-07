import React, { useEffect, useState } from 'react'
import { Box, Newline, Spacer, Text, useApp, useInput } from 'ink'
import { useActiveIndex, useCurrentDir, useFileList, usePrevious } from './hooks.js';
import ActiveText from './activeText.tsx';
import path from 'node:path';

interface Props {
    initialDir: string
}

export type Mode = 'Normal' | 'Insert'

const App = (props: Props) => {
    const app = useApp()
    const [reloadFlag, setReloadFlag] = useState(0)
    const [currentDir, actions] = useCurrentDir(props.initialDir)
    const [lastDir, setLastDir] = useState<string>("")
    const list = useFileList(currentDir, [reloadFlag])
    let initialIndex = Math.min(list.length, 1)

    // we are doing a parent action
    if (lastDir) {
        initialIndex = list.findIndex((fileMeta) => fileMeta.filename === lastDir)
    }
    const [mode, setMode] = useState<Mode>('Normal')
    const activeIndex = useActiveIndex(initialIndex, list.length, mode, [currentDir, initialIndex])
    const [debug, setDebug] = useState<any>()

    useEffect(() => {
        setDebug(`reloadFlag${reloadFlag}, currentDir: ${currentDir}, activeIndex: ${activeIndex}, mode: ${mode}`)
    }, [reloadFlag, currentDir, activeIndex, mode])

    // switch mode
    useInput((_input, key) => {
        if (key.escape) {
            setMode('Normal')
        }
        if (key.return) {
            if (list[activeIndex]?.filename === "..") {
                return
            }
            setMode('Insert')
        }
    })

    useInput((input, key) => {
        if (input === 'q' && mode === 'Normal') {
            app.exit()
            return
        }

        if (input === 'a' && mode === 'Normal') {

        }

        if (key.return) {
            if (list[activeIndex]?.filename === "..") {
                let parentDir = path.basename(currentDir)
                setLastDir(parentDir)
                actions.parent()
                return
            }
        }

        if (input === '-') {
            let parentDir = path.basename(currentDir)
            setLastDir(parentDir)
            actions.parent()
        }
        if (input === '=' && list[activeIndex]?.filename) {
            actions.in(list[activeIndex].filename)
            setLastDir("")
        }
    })

    const reload = () => {
        setReloadFlag(prev => prev + 1)
        setMode('Normal')
    }

    return (<>
        <Box flexDirection="column" borderStyle={"round"} flexGrow={1} height={30}>
            {list.map((fileMeta, index) => {
                const name = fileMeta.type === 'dir' ? fileMeta.filename + '/' : fileMeta.filename
                if (activeIndex === index) {
                    return (<ActiveText key={fileMeta.filename} mode={mode} fileMeta={fileMeta} reload={reload}>{name}</ActiveText>)
                }
                return <Box key={fileMeta.filename}>
                    <Box flexGrow={1} width={100}>
                        <Text>{name}</Text>
                    </Box>
                </Box>
            })}
            <Spacer />
            <Box borderStyle={"double"} flexDirection='column'>

                <Box flexDirection='row'>
                    <Text>q: Exit </Text>
                    <Text> | </Text>
                    <Text>a: Add</Text>
                    <Text> | </Text>
                    <Text> &lt;Enter&gt;: Modify </Text>
                    <Text> | </Text>
                    <Text>-: Go to parent dir </Text>
                    <Text> | </Text>
                    <Text>=: Into dir </Text>
                </Box>
                <Box>
                    <Text color={"gray"}>
                        <Newline />
                        {
                            mode === 'Normal'
                                ? "Tip: You are in normal mode, you can navigate with arrow keys, press <Enter> to modify the filename"
                                : "Tip: You are in insert mode, press Esc to undo the modify, press <Enter> to save the modify"
                        }
                    </Text>
                </Box>
            </Box>
        </Box>
    </>)
}

export default App

