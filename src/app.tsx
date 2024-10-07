import React, { useEffect, useState } from 'react'
import { Box, Text, useApp, useInput } from 'ink'
import { useActiveIndex, useCurrentDir, useFileList } from './hooks.js';
import ActiveText from './activeText.tsx';

interface Props {
    initialDir: string
}

export type Mode = 'Normal' | 'Insert'

const App = (props: Props) => {
    const app = useApp()
    const [reloadFlag, setReloadFlag] = useState(0)
    const [currentDir, actions] = useCurrentDir(props.initialDir)
    const list = useFileList(currentDir, [reloadFlag])
    const initialIndex = Math.min(list.length, 1)
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

        if (key.return) {
            if (list[activeIndex]?.filename === "..") {
                return
            }
        }

        if (input === '-') {
            actions.parent()
        }
        if (input === '=' && list[activeIndex]?.filename) {
            actions.in(list[activeIndex].filename)
        }
    })

    const reload = () => {
        setReloadFlag(prev => prev + 1)
    }

    return (<>
        <Box flexDirection="column">
            {list.map((fileMeta, index) => {
                const name = fileMeta.type === 'dir' ? fileMeta.filename + '/' : fileMeta.filename
                if (activeIndex === index) {
                    return (<ActiveText key={index} mode={mode} fileMeta={fileMeta} reload={reload}>{name}</ActiveText>)
                }
                return <Box>
                    <Box flexGrow={1} width={100}>
                        <Text key={index}>{name}</Text>
                    </Box>
                </Box>
            })}
            <Text>{debug}</Text>
        </Box>
    </>)
}




export default App

