<h1 align="center">oil</h1>

<p align="center">Manage and navigate file system easily from your terminal!</p>

![CleanShot 2024-10-07 at 22 28 20@2x](https://github.com/user-attachments/assets/4f77fca7-27b3-4a2a-8498-cc34be526ac8)

## Motivation

I usually miss `-p` when `mkdir foo/bar/baz` or use `touch` to create a file that directory doesn't exist. I want
to use the [oil]'s way to manage my file system anytime.

## Install

```bash
npm install --global oil-terminal
```

If you don't have npm yet, you can install the [node](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

## Usage

#### navigate

- `<Keyup>` / `j`: Move up.
- `<Keydown>` / `k`: Move down.

#### Add file or directory

Press `a`, if the string ends with `/`, it will add a directory, otherwise it will add a file.

Then press `<Enter>` to make sure your operate.

#### Delete file or directory

Press `d`, then press `y` to make sure your operate.

#### Move to parent directory

Press `-`.

#### Move to child directory

Press `=`

## Credits

Really inspired by [oil]!

Any feedback is welcome!

[oil]: https://github.com/stevearc/oil.nvim
