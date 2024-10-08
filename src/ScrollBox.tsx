// copied from <https://github.com/sasaplus1/inks/blob/main/packages/ink-scroll-box/index.tsx>
import type { BoxProps, DOMElement } from 'ink';

import { measureElement, Box } from 'ink';
import * as React from 'react';

export type Props = {
    children: React.ReactNode[];
    /** initial height */
    initialHeight?: number;
    /** children offset */
    offset: number;
} & BoxProps;

/**
 * a box that can be scrolled
 * add border is not recommended
 *
 * @param props - props
 */
export function ScrollBox(props: Props) {
    const { children, initialHeight = 0, offset, ...boxProps } = props;

    const ref = React.useRef<DOMElement>(null);

    const [height, setHeight] = React.useState(initialHeight);

    React.useLayoutEffect(() => {
        if (ref && ref.current) {
            setHeight(measureElement(ref.current).height);
        }
    }, [ref, props.height]);

    return (
        <Box {...boxProps} flexDirection="column" ref={ref}>
            {children.slice(offset, height + offset)}
        </Box>
    );
}
