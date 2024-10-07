# oil

Manage and navigate file system easily from your terminal.

## Motivation

I usually miss `-p` when `mkdir foo/bar/baz` or use `touch` to create a file that directory doesn't exist. I want
to use the [oil]'s way to manage my file system anytime.

## Install

```bash
npm install --global oil
```

## Usage

1. navigate

- <Keyup> / `j`: Move up.
- <Keydown> / `k`: Move down.

2. Add file or directory

Press `a`, if the string ends with `/`, it will add a directory, otherwise it will add a file.

Then press `<Enter>` to make sure your operate.

3. Delete file or directory

Press `d`, then press `y` to make sure your operate.

4. Move to parent directory

Press `-`.

5. Move to child directory

Press `=`

## Credits

Really inspired by [oil]!

[oil]: https://github.com/stevearc/oil.nvim
