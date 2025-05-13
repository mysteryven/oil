import { Box, Newline, Text } from "ink"
import React from "react"
import { Mode } from "./app"

export const Helper = (props: { mode: Mode }) => {
    const mode = props.mode
    return <Box borderStyle={"double"} flexDirection='column'>
        <Box flexDirection='row'>
            <Text>q: Exit </Text>
            <Text> | </Text>
            <Text>a: Add</Text>
            <Text> | </Text>
            <Text>r: Rename </Text>
            <Text> | </Text>
            <Text>d: Delete</Text>
            <Text> | </Text>
            <Text> | </Text>
            <Text>-: Go to parent dir </Text>
            <Text> | </Text>
            <Text>=/&lt;Enter&gt;: Into dir </Text>
        </Box>
        <Box>
            <Text color={"gray"}>
                <Newline />
                {
                    mode === 'Normal'
                        ? "Tip: You are in normal mode, you can navigate with arrow keys, press R to modify the filename"
                        : "Tip: You are in insert mode, press <ESC> to undo the modify, press <Enter> to save the modify"
                }
            </Text>
        </Box>
    </Box>
}
