import React, { useEffect, useState } from 'react'
import { Box, Text, useApp, useInput } from 'ink'
import path from 'node:path';
import { useActiveIndex, useCurrentDir, useFileList, useOffset } from './hooks.js';
import ActiveText from './activeText.tsx';
import { EMPTY, OFFSET, PARENT_DIR } from './constant.ts';
import { Helper } from './help.tsx';
import { rmSync } from 'node:fs';
import { ScrollBox } from '@sasaplus1/ink-scroll-box'

interface Props {
    initialDir: string
}

export type Mode = 'Normal' | 'Insert' | 'deleting'


const App = (props: Props) => {
    const app = useApp()
    const [reloadFlag, setReloadFlag] = useState(0)
    const [currentDir, actions] = useCurrentDir(props.initialDir)
    // track the last child dir to re-target active index to last child dir
    // when we are back to parent dir.
    const [lastDir, setChildDir] = useState<string>("")
    const [list, setList] = useFileList(currentDir, [reloadFlag])
    const [mode, setMode] = useState<Mode>('Normal')

    let initialIndex = Math.min(list.length, 1)
    // we are back to a parent dir
    if (lastDir) {
        initialIndex = list.findIndex((fileMeta) => fileMeta.filename === lastDir)
    }
    const [activeIndex, setActiveIndex] = useActiveIndex(initialIndex, list.length, mode, [currentDir, initialIndex])
    const [_debug, setDebug] = useState<any>()
    const offset = useOffset(activeIndex, list.length)

    useEffect(() => {
        setDebug(`reloadFlag${reloadFlag}, currentDir: ${currentDir}, activeIndex: ${activeIndex}, mode: ${mode}`)
    }, [reloadFlag, currentDir, activeIndex, mode])

    // switch mode
    useInput((_input, key) => {
        if (key.escape) {
            setMode('Normal')
            setList(list => {
                return list.filter(file => file.filename !== EMPTY)
            })
            setActiveIndex(index => Math.min(list.length, index - 1))
        }
        if (key.return) {
            if (list[activeIndex]?.filename === PARENT_DIR) {
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
            startAdd()
        }

        if (input === 'd' && mode === 'Normal') {
            startDelete()
        }

        if (input === 'y' && mode === 'deleting') {
            doneDelete()
        }

        if (input === 'n' && mode === 'deleting') {
            setMode('Normal')
        }

        if (key.return) {
            if (list[activeIndex]?.filename === PARENT_DIR) {
                let parentDir = path.basename(currentDir)
                setChildDir(parentDir)
                actions.parent()
                return
            }
        }

        if (input === '-') {
            let parentDir = path.basename(currentDir)
            setChildDir(parentDir)
            actions.parent()
        }
        if (input === '=' && list[activeIndex]?.filename) {
            actions.in(list[activeIndex].absolutePath)
            setChildDir("")
        }
    })

    // After we operate file system, we reload the list again
    const reload = () => {
        setReloadFlag(prev => prev + 1)
        setMode('Normal')
    }

    const startAdd = () => {
        list.splice(activeIndex + 1, 0, { filename: EMPTY, type: 'file', absolutePath: EMPTY })
        setList([...list])
        setActiveIndex((prev) => prev + 1)
        setMode('Insert')
    }

    const startDelete = () => {
        if (list[activeIndex]?.filename === PARENT_DIR) {
            return
        }
        setMode('deleting')
    }

    const doneDelete = () => {
        let fileMeta = list[activeIndex]
        rmSync(fileMeta.absolutePath, { recursive: true, force: true })
        list.splice(activeIndex, 1)
        setList([...list])
        setActiveIndex((prev) => prev - 1)
        reload()
    }

    return (<>
        <Box flexDirection="column" borderStyle={"round"} flexGrow={1}>
            <ScrollBox flexDirection='column' offset={offset} height={OFFSET}>
                {list.map((fileMeta, index) => {
                    const name = fileMeta.type === 'dir' ? fileMeta.filename + '/' : fileMeta.filename
                    if (activeIndex === index) {
                        return (
                            <Box key={fileMeta.filename}>
                                <ActiveText mode={mode} fileMeta={fileMeta} reload={reload} currentDir={currentDir}>
                                    {name}
                                </ActiveText>
                                {
                                    mode === 'deleting' && <Box>
                                        <Text color="grey"> Delete this? </Text>
                                        <Text color="green"> Y[es] </Text>
                                        <Text color="red"> N[o] </Text>
                                    </Box>
                                }
                            </Box>
                        )
                    }

                    return <Box key={fileMeta.filename}>
                        <Box flexGrow={1} width={100}>
                            <Text>{name}</Text>
                        </Box>
                    </Box>
                })}
            </ScrollBox>
            <Helper mode={mode} />
        </Box>
    </>)
}

export default App

