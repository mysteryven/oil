import { useState, useEffect, useRef } from 'react'

import fs from 'node:fs'
import path from 'node:path'
import { useInput } from 'ink'
import { Mode } from './app.js'
import { OFFSET } from './constant.js'

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

                setCurrentDir(() => {
                    return dirOrFile
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
    absolutePath: string,
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
            { filename: '..', absolutePath: '..', type: 'other' }
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
                    filename: file, type, absolutePath: fullPath
                }
            })
        )

        arr.sort((a, b) => {
            if (a.filename === '..') {
                return -1
            }
            if (b.filename === '..') {
                return 1
            }
            if (a.filename[0] === '.' && b.filename[0] !== '.') {
                return 1
            }
            if (a.filename[0] !== '.' && b.filename[0] === '.') {
                return -1
            }
            // dir first, file second
            if (a.type === 'dir' && b.type === 'file') {
                return -1
            }
            if (a.type === 'file' && b.type === 'dir') {
                return 1
            }


            return a.filename.localeCompare(b.filename)
        })

        setList(arr)
    }, [dir, ...deps])

    return [list, setList] as const
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
                    return prev
                }
                return prev - 1
            })
        }
        if (key.downArrow || input === 'j') {
            setIndex((prev) => {
                // TODO: support infinite scroll
                if (prev === length - 1) {
                    return prev
                }
                return prev + 1
            })
        }
    })

    useEffect(() => {
        setIndex(initialIndex)
    }, deps)

    return [currentIndex, setIndex] as const
}

export const usePrevious = <T>(value: T): T | undefined => {
    const ref = useRef<T>()
    useEffect(() => {
        ref.current = value
    }, [value])
    return ref.current
}

export const useOffset = (currentIndex: number, length: number) => {
    const [offset, setOffset] = useState(0)
    useInput((input, key) => {
        if (key.upArrow || input === 'k') {
            if (offset <= 0) {
                return
            }
            if (offset === -1 && length > OFFSET) {
                setOffset(length - 1)
            }

            setOffset((offset) => offset - 1)
        }

        if (key.downArrow || input === 'j') {
            if (currentIndex === length - 1) {
                return
            }
            if (currentIndex >= OFFSET - 1) {
                setOffset((offset) => offset + 1)
            }
        }
    })

    return offset
}
