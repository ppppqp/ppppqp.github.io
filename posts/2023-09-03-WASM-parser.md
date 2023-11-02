---
title:  'WASM 101 | Binary Structure'
date:   '2023-09-03'
author: 'Retep' 
tag: 'Tech'
language: 'EN'
noSSR: 0
---


## Meta-Intro

WASM is an interesting virtual instruction set that offers many charming features, like cross-platform portability, simplicity, great performance and security. 

## Intro
This blog will introduce the starting point of our journey: a WASM binary. WASM ships in binary, which makes it efficient and secure (at least harder to reverse engineer than Javascript.) The binary structure is well-designed and by studying the structure, we get a taste of how WASM works.

WASM binary can be compiled from other programming language, like C, by a WASM compiler. We can simply get a WASM binary from [WasmFiddle](https://wasdk.github.io/WasmFiddle/): simply build the example program (check Appendix!) and download the WASM file.

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
The next 4 bytes (i.e. `01 00 00 00`) are version numbers. They indicate that the file is encoded in WASM 1.0 specification.

## Sections
Then it comes to the actual contents. A webassembly module can be divided into 12 sections: Custom, Types, Functions, Tables, Memories, Globals, Element Segments, Data Segments, Start Function, Code, Exports and Imports. Some sections are optional.

The structure for each section is:
* 1 byte as section id
* 4 bytes as section byte count N
* N bytes of content

### Type
The Type section contains the type information (a.k.a signature) for all functions, i.e, it enumerates the "(parameter types, return type)" pairs of all functions in this module. When a function want to declare its type, it only need to specify an index into the Type section.



```bash
00000000 00 61 73 6d 01 00 00 00  01 8a 80 80 80 00 02 60  |.asm...........`|
                                   ^
```
`01` is the section id. It implies the begin of Type section.


```bash
00000000 00 61 73 6d 01 00 00 00  01 8a 80 80 80 00 02 60  |.asm...........`|
                                      ^  ^  ^  ^
```
`8a 80 80 80 00` is the [LEB-128](https://en.wikipedia.org/wiki/LEB128) representation of the number 10, which represents the content length.

> [!info] Why we need LEB-128
> LEB-128 or Little Endian Base 128 is a variable-length code **compression** to store arbitrary number. In most programming languages a number is represented by a fixed number of bytes, e.g. 4 bytes for integer in C. 
> However, if I want to represent the number `6`, the binary representation is `00 00 00 06`, which means the upper three bytes are wasted. If I want to represent the `2147483648`, which is greater than `7f ff ff ff`, 4 bytes are not enough in this case. 
> That's why we want variable-length representation: better information density and wider range.


```bash
00000000 00 61 73 6d 01 00 00 00  01 8a 80 80 80 00 02 60  |.asm...........`|
                                                     ^  ^ 
00000010 01 7f 01 7f 60 00 01 7f  03 83 80 80 80 00 02 00  |....`...........|
          ^  ^
```
The next 10 bytes, represents the actual type information. The first `02` says there are two entities in type section (i.e. we have two function types in total). `60` says this entity is a "function type", mainly for the validation purposes. The following `01` says the number of parameters is 1 so we read another byte `7f` to get this single parameter type. `7f` stands for `i32`. Since all input parameters are read, we are good to read the number of return values: `01` and its type is also `7f`. So essentially it defines a function type `i32 => i32`, which is the type of our `fib` function!

Then we follow the same procedure and find the next function type is `void => i32`. This is because the input parameter length is `0` and we have one output parameter `7f`.

### Function
The Function section contains all the function declarations in an array. The entries of the array is just indices to the Type section array.

Type section store the signature, Code section stores the actual implementation, and Function section associates both together. 

```bash
00000010  01 7f 01 7f 60 00 01 7f  03 83 80 80 80 00 02 00  |....`...........|
                                    ^  ^  ^  ^  ^  ^  ^  ^
00000020  01 04 84 80 80 80 00 01  70 00 00 05 83 80 80 80  |........p.......|
           ^  
```
We found the next byte `03`, which represents the section id of Functions. The following `83 80 80 80 00` represents the number `3`. The next `02` indicates that there are two functions (`fib` and `main`, naturally.) `00` and `01` are indices into the Type section, which means the first function has type `i32 => i32` and the second function has type `void => i32`.

### Table
Table section contains a vector of tables. A table is a vector of opaque values of a particular reference type (can be either function reference or external reference, i.e. the reference provided by the embedder.) A table can grow in runtime, so a limit of its size can be specified. The minimum is required and maximum is optional. 

$$tabletype ::= limits\ reftype$$

$$limits ::= \{\min{u32},\max{u32^?}\}$$

$$reftype ::= funcref\ |\ externref$$
```bash
00000020  01 04 84 80 80 80 00 01  70 00 00 05 83 80 80 80  |........p.......|
              ^  ^  ^  ^  ^  ^  ^   ^  ^  ^
```
`04` stands for the section id for Table, and there are 4 bytes in this section. `01` means there is only one table entry. `70` represents that the type for this table is $funcref$. The next two `00`s represent limit flag and limit initial respectively. Limit flag specifies whether the table has a maximal size, and limit initial is just the minimal size. In conclusion, we have a single table that stores a vector of function reference with 0 minimal size and no maximal size.

### Memory

The memory section defines a vector of linear memories (a vector of raw uninterpreted bytes.) A memory can be initialized through Data section. It can also grow and has limits.

$$memtype ::= limits$$

```bash
00000020  01 04 84 80 80 80 00 01  70 00 00 05 83 80 80 80  |........p.......|
                                             ^  ^  ^  ^  ^
00000030  00 01 00 01 06 81 80 80  80 00 00 07 97 80 80 80  |................|
           ^  ^  ^  ^
```
`05` stands for the section id for Memory, and there are 3 bytes in this section. Same as the Table section above, there are only 1 memory vector, has no maximal size, and has a minimal size of 1. 


### Global
The component of a module defines a vector of global variables. Each global stores a single value of the given global type. It also specifies whether a global is immutable or mutable. Moreover, each global is initialized with a typed value given by a constant initializer expression $expr$.


$$global ::= \{\text{type}\ globaltype, \text{init}\ expr\}$$


$$globaltype ::= mut\ valtype$$

$$mut ::= const\ |\ var$$

```bash
00000030  00 01 00 01 06 81 80 80  80 00 00 07 97 80 80 80  |................|
                       ^  ^  ^  ^   ^  ^  ^
```
In this program no global variables are used, so the size of Global section is 0.


### Export
Export defines a set of exports that become accessible to the host environment once the module has been instantiated. From the definition below we can see each export entry consists of a name and a export description, which can be an index into Function, Table, Memory or Global.

$$export := \{\text{name}\ name, \text{desc}\ exportdesc\}$$


$$\begin{align*}exportdesc &::= \text{func}\ funcidx \\ &|\ \text{table}\ tableidx \\ &|\ \text{mem}\ memidx \\ &|\ \text{global}\ globalidx \end{align*}$$


```bash
00000030  00 01 00 01 06 81 80 80  80 00 00 07 97 80 80 80  |................|
                                             ^  ^  ^  ^  ^
00000040  00 03 06 6d 65 6d 6f 72  79 02 00 03 66 69 62 00  |...memory...fib.|
           ^  ^  ^  ^  ^  ^  ^  ^   ^  ^  ^  ^  ^  ^  ^  ^
00000050  00 04 6d 61 69 6e 00 01  0a d7 80 80 80 00 02 c6  |..main..........|
           ^  ^  ^  ^  ^  ^  ^  ^  
```

`07` stands for the section id for Export section, and there are 23 bytes in this section. `03` means there are 3 globals. `06` is the character count for string 'memory' and the followed 6 numbers are just the ASCII encoding of 'memory'. `02` means the export entry is a memory index, and the following `00` is the actual index. So putting pieces together, we are exporting the first memory vector in Memory section and name it as `memory`(for the host environment.)

Following the same rule to process the rest, we will get a function exported named `fib`, which points to the index 0 of the Function section, and the same with `main`.

### Start
Start section is an optional section: it specifies the entry function for the whole wasm module. 

$$ start ::= \{\text{func}\ funcidx\}$$

In the above example there's no entry function specified.


### Element
The initial contents of a table is uninitialized. Element segments can be used to initialize a subrange of a table from a static vector of elements.

$$ \begin{align*}elem &:= \{\text{type}\ reftype,\ \\ &\text{init}\ vec(expr),\ \text{mode}\ mode\}\end{align*}$$

$$\begin{align*} elemmode &::= \text{passive} \\ &|\text{active}\{\text{table}~\text{tableidx},~\text{offset}~\text{expr}\} \\ &|\text{declarative}\end{align*}$$

### Code

Code section consists of a vector of code entries that are pairs of value type vectors and expressions. They represent the locals and body field of the functions in the component of a module.

```bash
00000050  00 04 6d 61 69 6e 00 01  0a d7 80 80 80 00 02 c6  |..main..........|
                                    ^  ^  ^  ^  ^  ^  ^  ^
00000060  80 80 80 00 01 02 7f 41  01 21 02 02 40 20 00 41  |.......A.!..@ .A|
           ^  ^  ^  ^  ^  ^  ^  ^   ^  ^  ^  ^  ^  ^  ^  ^
00000070  01 72 41 01 46 0d 00 20  00 41 7e 6a 21 00 41 01  |.rA.F.. .A~j!.A.|
           ^  ^  ^  ^  ^  ^  ^  ^   ^  ^  ^  ^  ^  ^  ^  ^
00000080  21 02 03 40 20 00 41 01  6a 10 00 20 02 6a 21 02  |!..@ .A.j.. .j!.|
           ^  ^  ^  ^  ^  ^  ^  ^   ^  ^  ^  ^  ^  ^  ^  ^
00000090  20 00 41 01 72 21 01 20  00 41 7e 6a 21 00 20 01  | .A.r!. .A~j!. .|
           ^  ^  ^  ^  ^  ^  ^  ^   ^  ^  ^  ^  ^  ^  ^  ^
000000a0  41 01 47 0d 00 0b 0b 20  02 0b 86 80 80 80 00 00  |A.G.... ........|
           ^  ^  ^  ^  ^  ^  ^  ^   ^  ^  ^  ^  ^  ^  ^  ^
000000b0  41 05 10 00 0b                                    |A....|
           ^  ^  ^  ^  ^
```
This whole bunch of bytes are all dedicated to the Code section, which has an id of 10. `02` means there will be two function definitions. `c6 80 80 80 00` indicates the body size (70) of the first function definition. Then the local variables, grouped in (number, type), are specified. `01` means there will be only 1 type of variable, and `02 7f` represents two `i32` variables (which is all local variable we need since there is only 1 type of local variable). The rest of the bytes (body size - bytes taken by local variables) are instructions.

From the above example we see there is only two `i32` variables for the first function and no variable for the second function.

## Epilogue
So we have successfully parsed a wasm binary. Next blog we will introduce how the pieces come together in runtime.


## Appendix
### `Fib` in C++
The source code of fib in c++ that I used to compile to wasm.
```cpp
int fib(int n){
  if(n == 0 || n == 1) return 1;
  return fib(n-1) + fib(n-2);
}
int main(){
  return fib(5);
}
```
