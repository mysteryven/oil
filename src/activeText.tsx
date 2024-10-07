import { Text, Box, useInput } from 'ink'
import type { Mode } from './app.tsx';
import { useEffect, useState } from 'react';
import React from 'react';
import TextInput from 'ink-text-input';
import type { FileMeta } from './hooks.ts';
import fs from 'node:fs'
import path from 'node:path'
import { EMPTY } from './constant.ts';

type TextProps = Parameters<typeof Text>[0] & {
    mode: Mode,
    fileMeta: FileMeta,
    reload: () => void,
    currentDir: string
}

const ActiveText = (props: TextProps) => {
    const [query, setQuery] = useState('');
    const mode = props.mode
    const value = props.fileMeta.filename
    const addOrModify = value === EMPTY ? 'Add' : 'Modify'
    const handleRenameFile = () => {
        props.reload()
        const oldPath = props.fileMeta.path
        const newPath = path.dirname(oldPath) + '/' + query
        fs.renameSync(oldPath, newPath)
    }

    const handleAddFile = () => {
        props.reload()
        const newPath = path.join(props.currentDir, value)
        fs.writeFileSync(newPath, '', 'utf8')
    }

    useEffect(() => {
        setQuery(value)
    }, [value])

    useInput((_input, key) => {
        if (mode === 'Normal' || !key.return) {
            return
        }
        if (addOrModify === 'Modify') {
            handleRenameFile()
        } else {
            handleAddFile()
        }
    })


    return <Box borderRightColor={"white"} height={1}>
        {
            mode === 'Insert'
                ? <TextInput value={query} onChange={setQuery} placeholder='Please input' />
                : <Text inverse {...props}>{props.children}</Text>
        }
    </Box>
}

export default ActiveText
