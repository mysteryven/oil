import { Text, Box, useInput } from 'ink'
import type { Mode } from './app.tsx';
import { useEffect, useState } from 'react';
import React from 'react';
import TextInput from 'ink-text-input';
import type { FileMeta } from './hooks.ts';
import fs from 'node:fs'
import path from 'node:path'

type TextProps = Parameters<typeof Text>[0] & { mode: Mode, fileMeta: FileMeta, reload: () => void }

const ActiveText = (props: TextProps) => {
    const [query, setQuery] = useState('');
    const mode = props.mode
    const value = props.fileMeta.filename
    const handleRenameFile = () => {
        props.reload()
        const oldPath = props.fileMeta.path
        const newPath = path.dirname(oldPath) + '/' + query
        fs.renameSync(oldPath, newPath)
    }

    useEffect(() => {
        setQuery(value)
    }, [value])

    useInput((_input, key) => {
        if (mode === 'Normal') {
            return
        }
        if (key.return) {
            handleRenameFile()
        }
    })


    return <Box borderRightColor={"white"}>
        {
            mode === 'Insert'
                ? <TextInput value={query} onChange={setQuery} />
                : <Text inverse {...props}>{props.children}</Text>
        }
    </Box>
}

export default ActiveText
