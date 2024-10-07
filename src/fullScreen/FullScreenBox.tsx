import React from 'react'
import { Box, type DOMElement, useInput } from "ink";
import { type ComponentPropsWithoutRef, forwardRef } from "react";

export type BoxProps = ComponentPropsWithoutRef<typeof Box>;

const FullScreenBox = forwardRef<DOMElement, BoxProps>(
    function FullScreenBox(props, ref) {
        useInput(() => { }); // prevent input from rendering and shifting the layout
        const { height, width } = useScreenSize();
        return <Box ref={ref} height={height} width={width} {...props} />;
    },
);

import { useStdout } from "ink";
import { useCallback, useEffect, useState } from "react";

export function useScreenSize() {
    const { stdout } = useStdout();
    const getSize = useCallback(
        () => ({ height: stdout.rows, width: stdout.columns }),
        [stdout],
    );
    const [size, setSize] = useState(getSize);

    useEffect(() => {
        function onResize() {
            setSize(getSize());
        }
        stdout.on("resize", onResize);
        return () => {
            stdout.off("resize", onResize);
        };
    }, [stdout, getSize]);

    return size;
}

import { type Instance, render } from "ink";

type InkRender = typeof render;
type WithFullScreen = (...args: Parameters<InkRender>) => {
    instance: Instance;
    start: () => Promise<void>;
    waitUntilExit: () => Promise<void>;
};

async function write(content: string) {
    return new Promise<void>((resolve, reject) => {
        process.stdout.write(content, (error) => {
            if (error) reject(error);
            else resolve();
        });
    });
}

async function cleanUpOnExit(instance: Instance) {
    await instance.waitUntilExit();
    await write("\x1b[?1049l"); // exit alternate buffer
}

export const withFullScreen: WithFullScreen = (node, options) => {
    const instance = render(null, options);
    const exitPromise = cleanUpOnExit(instance);
    function waitUntilExit() {
        return exitPromise;
    }

    return {
        instance: instance,
        start: async () => {
            await write("\x1b[?1049h"); // enter alternate buffer
            instance.rerender(<FullScreenBox>{node}</FullScreenBox>);
        },
        waitUntilExit,
    };
};
