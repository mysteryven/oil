import { Text, Box, useInput } from 'ink'
import React, { useEffect, useState } from 'react';
import TextInput from 'ink-text-input';
import path from 'node:path'
import { ensureDirSync, ensureFileSync, moveSync } from 'fs-extra'
import { EMPTY } from './constant.ts';
import type { Mode } from './app.tsx';
import type { FileMeta } from './hooks.ts';

type TextProps = Parameters<typeof Text>[0] & {
    mode: Mode,
    fileMeta: FileMeta,
    reload: () => void,
    currentDir: string
}

const ActiveText = (props: TextProps) => {
    const [newFilename, setNewFilename] = useState('');
    const mode = props.mode
    const oldFilename = props.fileMeta.filename
    const addOrModify = oldFilename === EMPTY ? 'Add' : 'Modify'

    // need keep sync when active item change
    useEffect(() => {
        setNewFilename(oldFilename)
    }, [oldFilename])

    useInput((_input, key) => {
        if (mode === 'Normal') {
            return
        }

        if (key.return) {
            if (addOrModify === 'Modify') {
                handleRenameFile()
            } else {
                handleAddFile()
            }
        }
    })

    /** functions */
    const handleRenameFile = () => {
        props.reload()
        const oldPath = props.fileMeta.path
        const newPath = path.dirname(oldPath) + '/' + newFilename
        moveSync(oldPath, newPath)
    }

    const handleAddFile = () => {
        props.reload()
        const newPath = path.join(props.currentDir, newFilename)

        if (newPath.endsWith('/')) {
            ensureDirSync(newPath)
        } else {
            ensureFileSync(newPath)
        }
    }

    return <Box borderRightColor={"white"} height={1} overflowX="hidden">
        {
            mode === 'Insert'
                ? <TextInput value={newFilename} onChange={setNewFilename} placeholder='Please input' />
                : <Text inverse {...props}>{props.children}</Text>
        }
    </Box>
}

export default ActiveText
