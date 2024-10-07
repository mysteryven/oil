import { useState, useEffect, useRef } from 'react'

import fs from 'node:fs'
import path from 'node:path'
import { useInput } from 'ink'
import { Mode } from './app.js'

const isValidPath = (pathLike: string): boolean => {
    return fs.existsSync(pathLike)
}

const isFile = (pathStr: string): boolean => {
    return fs.lstatSync(pathStr).isFile()
}

export const useCurrentDir = (initialDir: string) => {
    const [currentDir, setCurrentDir] = useState(initialDir)

    return [
        // will always be a exist dir
        currentDir,
        {
            // Go to parent dir, return false if it's root of filesystem
            parent: (): boolean => {
                let parentDir = path.dirname(currentDir)
                if (parentDir === currentDir) {
                    return false
                }
                setCurrentDir(parentDir)
                return true
            },
            // Go to child dir, return false if it's not a dir or doesn't exist
            in: (dirOrFile: string): boolean => {
                if (!isValidPath(dirOrFile)) {
                    return false
                }
                if (isFile(dirOrFile)) {
                    return false
                }

                setCurrentDir((prev) => {
                    return path.join(prev, dirOrFile)
                })

                return true
            }
        }
    ] as const
}

export interface FileMeta {
    // dirname or filename
    filename: string,
    // full file path
    path: string,
    // "..", non-file, non-dir should be 'other'
    type: 'file' | 'dir' | 'other'
}

// Return all list in current dir
// before using it make sure the dir is a existing dir! if you use the path 
// returned by the `useCurrentDir`, you don't need worry about this.
export const useFileList = (dir: string, deps: any[]) => {
    let [list, setList] = useState<FileMeta[]>([])

    useEffect(() => {
        if (!isValidPath(dir)) {
            return
        }
        let files = fs.readdirSync(dir)
        let arr: FileMeta[] = [
            { filename: '..', path: '..', type: 'other' }
        ]
        arr.push(
            ...files.map((file) => {
                let fullPath = path.join(dir, file)
                let type: 'file' | 'dir' | 'other' = 'other'
                let status = fs.statSync(fullPath)
                if (status.isDirectory()) {
                    type = 'dir'
                } else if (status.isFile()) {
                    type = 'file'
                } else {
                    type = 'other'
                }
                return {
                    filename: file, type, path: fullPath
                }
            })
        )
        setList(arr)
    }, [dir, ...deps])

    return list
}

// listen the keyboard keydown and keyup, return the active index,
// when press keydown on last item, it will back to the first one,
// when press keyup on first item, it will go to the last one.
export const useActiveIndex = (initialIndex: number, length: number, mode: Mode, deps: any[]) => {
    const [currentIndex, setIndex] = useState(initialIndex)
    useInput((input, key) => {
        if (mode === 'Insert') {
            return
        }
        if (key.upArrow || input === 'k') {
            setIndex((prev) => {
                if (prev === 0) {
                    return length - 1
                }
                return prev - 1
            })
        }
        if (key.downArrow || input === 'j') {
            setIndex((prev) => {
                if (prev === length - 1) {
                    return 0
                }
                return prev + 1
            })
        }
    })

    useEffect(() => {
        setIndex(initialIndex)
    }, deps)

    return currentIndex
}

export const usePrevious = <T>(value: T): T | undefined => {
    const ref = useRef<T>()
    useEffect(() => {
        ref.current = value
    }, [value])
    return ref.current
}
