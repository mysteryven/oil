import { AppProps, Key } from "ink";

export function listenKeyboardInput(input: string, key: Key, app: AppProps) {
    if (key.shift && input === 'b') {
        app.exit()
        return
    }
}
