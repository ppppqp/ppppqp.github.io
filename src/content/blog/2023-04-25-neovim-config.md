---
title:  'Minimal Neovim Configuration'
pubDate:   '2023-04-25'
author: 'Retep' 
tag: 'Tech'
language: 'EN'
noSSR: 0
description: ''
---

As a fan of minimalist I am sometimes fed up with VScode for its clumsiness and latency. Also as a broke young guy I can't afford a better laptop. In seek for better coding experience, the only solution I have is to find another more light-weighted editor. Neovim is just cool enough.

## Install Neovim

Less is more. Why bother building from source when you can do `brew install nvim`?

## Install Vim-Plug
A plugin manager is an essential. On the [README](https://github.com/junegunn/vim-plug) the author kindly provides the installation script for neovim: 

```bash
sh -c 'curl -fLo "${XDG_DATA_HOME:-$HOME/.local/share}"/nvim/site/autoload/plug.vim --create-dirs \
       https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim'
```

Note that the data directory is set to `$HOME/.local/share`. This will be the place where all the plugin sit.

## Basic Vim Settings
```plaintext
"enable code syntax highlight
syntax on

"configure tabs
set tabstop=2
set shiftwidth=4

"enable line number
set number

"how the line your cursor on
set cursorline

"show matching brackets
set showmatch

"show search result in highlight
set hlsearch

"search with case insensitive
set smartcase
```


## Colorscheme

The barebone Neovim seems pretty lousy. First lets pick a colorscheme for it. [Tokyo Night](https://github.com/folke/tokyonight.nvim) looks cool. We first specify that we want this plugin in `$HOME/.config/nvim/init.vim`:
```plaintext
call plug#begin()
Plug 'folke/tokyonight.nvim', { 'branch': 'main' }
call plug#end()

colorscheme tokyonight
```
Then we enter `:PlugInstall` in neovim to install the plugin. `colorscheme tokyonight` will turn on this scheme everytime neovim starts.

## File Tree View
This is also essential: I don't want to type `ls` and `cd` all the time. Add NERDtree to the plugin list. There's a few more customization:
1. Map Ctrl-t to toggle the tree view.
2. If starting neovim with a file specified, move the cursor to its window.
3. If file tree is the only window remaining, exit neovim.
4. `<ENTER` will now open file in a new tab , without overwriting the current window.
```plaintext
Plug 'preservim/nerdtree', { 'on': 'NERDTreeToggle' }

...

nnoremap <C-t> :NERDTreeToggle<CR>
let NERDTreeMapOpenInTab='<ENTER>'
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * NERDTree | if argc() > 0 || exists("s:std_in") | wincmd p | endif
autocmd BufEnter * if tabpagenr('$') == 1 && winnr('$') == 1 && exists('b:NERDTree') && b:NERDTree.isTabTree() | quit | endif
```

## AutoComplete/LSP
[deoplete.vim](https://github.com/Shougo/deoplete.nvim) is cool. There are mainly three steps for a Mac user:
1. Install this plugin with `Plug 'Shougo/deoplete.nvim', { 'do': ':UpdateRemotePlugins' }`
2. Install `pynvim` globally using `pip3 install --user pynvim`
3. Add `let g:deoplete#enable_at_startup = 1` to `init.vim`.


I also tried [YouCompleteMe](https://github.com/ycm-core/YouCompleteMe) but it was not working. The documentation also does not cover many details on neovim so I gave it up.

## Future Steps
The above three is good enough to provide a basic editing experience as VScode. Other supports like git diff view are not supported currently, though. I may look into it later.


![](/images/2023-04-25-nvim-config/screenshot.png)
> I mean, isn't it beautiful?


