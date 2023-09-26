---
title:  'WASM 101 | Binary Structure'
date:   '2023-09-03'
author: 'Retep' 
tag: 'Tech'
language: 'EN'
noSSR: 0
---


## Meta-Intro

Recently I have spent my spare time exploring WASM(Web Assembly). It is an interesting virtual instruction set that offers many charming features, like cross-platform portability, simplicity, great performance and security. In the following series of blogs we will build a WASM runtime step by step.

## Intro
This blog will introduce the starting point of our journey: a WASM binary. It can be compiled from any source, like a C program, by a WASM compiler. We can simply get a WASM binary from [WasmFiddle](https://wasdk.github.io/WasmFiddle/): simply build the example program and download the WASM file.

We can peek into the binary file:
```bash
~ » hexdump -C fib.wasm
00000000  00 61 73 6d 01 00 00 00  01 8a 80 80 80 00 02 60  |.asm...........`|
00000010  01 7f 01 7f 60 00 01 7f  03 83 80 80 80 00 02 00  |....`...........|
00000020  01 04 84 80 80 80 00 01  70 00 00 05 83 80 80 80  |........p.......|
00000030  00 01 00 01 06 81 80 80  80 00 00 07 97 80 80 80  |................|
00000040  00 03 06 6d 65 6d 6f 72  79 02 00 03 66 69 62 00  |...memory...fib.|
00000050  00 04 6d 61 69 6e 00 01  0a d7 80 80 80 00 02 c6  |..main..........|
00000060  80 80 80 00 01 02 7f 41  01 21 02 02 40 20 00 41  |.......A.!..@ .A|
00000070  01 72 41 01 46 0d 00 20  00 41 7e 6a 21 00 41 01  |.rA.F.. .A~j!.A.|
00000080  21 02 03 40 20 00 41 01  6a 10 00 20 02 6a 21 02  |!..@ .A.j.. .j!.|
00000090  20 00 41 01 72 21 01 20  00 41 7e 6a 21 00 20 01  | .A.r!. .A~j!. .|
000000a0  41 01 47 0d 00 0b 0b 20  02 0b 86 80 80 80 00 00  |A.G.... ........|
000000b0  41 05 10 00 0b                                    |A....|
000000b5

```
Looks nonsense to us. Let's break it down.

## Meta-info

### Magic Bytes
```bash
00000000 00 61 73 6d 01 00 00 00  01 8a 80 80 80 00 02 60  |.asm...........`|
          ^  ^  ^  ^
```
The first 4 bytes (i.e. `00 61 73 6d`) are magic bytes. They indicate that the file is a "WASM" binary representation.

### Version Number
```bash
00000000 00 61 73 6d 01 00 00 00  01 8a 80 80 80 00 02 60  |.asm...........`|
                      ^  ^  ^  ^
```
The next 4 bytes (i.e. `00 61 73 6d`) are version numbers. They indicate that the file is encoded in WASM 1.0 specification.

## Sections
Then it comes to the actual contents. A webassembly module can be divided into 10 sections: Types, Functions, Tables, Memories, Globals, Element Segments, Data Segments, Start Function, Exports and Imports.

The structure for each section is:
* 1 byte as section id
* 4 bytes as section byte count N
* N bytes of content

### Types
The Type section contains the type information for all functions, i.e, it enumerates the "(parameter types, return type)" pairs of all functions in this module. When a function want to declare its type, it only need to specify an index into the Type section.

```bash
00000000 00 61 73 6d 01 00 00 00  01 8a 80 80 80 00 02 60  |.asm...........`|
                                   ^
```
`01` is the section id. It implies the begin of Type section.


```bash
00000000 00 61 73 6d 01 00 00 00  01 8a 80 80 80 00 02 60  |.asm...........`|
                                      ^  ^  ^  ^
```
`8a 80 80 80` is the [LEB-128](https://en.wikipedia.org/wiki/LEB128) representation of the number 6, which represents the content length.



```bash
00000000 00 61 73 6d 01 00 00 00  01 8a 80 80 80 00 02 60  |.asm...........`|
                                                  ^  ^  ^ 
00000010 01 7f 01 7f 60 00 01 7f  03 83 80 80 80 00 02 00  |....`...........|
          ^  ^
```
The next 5 bytes, represents the actual type information. The first `00 01` says there is only 1 entity. `60` says this entity is a "function type", mainly for the validation purposes. The following `00` says the number of parameters is 0 so we can skip the parameters. `01` says the number of return value is 1, and the type is identified by `7f`, which stands for `i32` . So what is it exactly? It defines a function type `void => i32`, which is the type of our `main` function!

### Functions
```bash
00000010  01 7f 01 7f 60 00 01 7f  03 83 80 80 80 00 02 00  |....`...........|
```
We found the next byte `03`, which represents the section id of Functions. The following `83 80 80 80` represents the number `3`