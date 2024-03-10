---
title: "WASM101 | 运行时"
date: "2024-03-09"
author: "Retep"
tag: "Tech"
language: "CN"
noSSR: 0
---

上个博客中介绍了 WASM 的二进制文件里的一坨坨字节是如何组成有意义的模块的。这次进入主题：WASM 的运行时——如何在电脑里运行这些字节？我们先从最基本的计算模型入手。

## 计算模型

WASM 的计算模型是堆栈机。

> [!info]计算模型
> 计算模型(computational model)描述了如何根据一组输入值(CPU 指令)计算输出。

计算模型可以分为堆栈机(Stack machine)、累加器(Accumulator)和寄存器机(Register machine)。完成特定任务，由于计算模型不同，CPU 指令集也会产生相应的变化。

### 堆栈机
堆栈机是一种以栈作为主要数据结构的计算模型，它依赖于后进先出（LIFO）的原则来管理数据。堆栈机会维护一个栈，所有的操作数都默认从栈顶取出。比如我们需要计算 1+2 的值，对应到堆栈机的指令是：

```plaintext
PUSH 1 // 将1压入栈
PUSH 2 // 将2压入栈
ADD    // 将2推出栈，将1推出栈，计算add，将结果3压入栈
```

堆栈机相比累加器和寄存器机，有很多优点：

- **零地址或少地址指令**：堆栈机的指令通常不包含操作数的地址(0-operand instruction set)，因为操作数是从栈顶连续弹出的。
- **简化的指令集**：由于使用了栈来存储数据，堆栈机的指令集通常比寄存器机的简单。
- **高效函数调用**：递归和函数调用在堆栈机种很自然，因为每个函数调用的局部变量和返回地址可以自然地存储在栈中。


可以通过一个简单的WASM程序看到其堆栈机的计算模型：
```plaintext
(i32.add
	(i32.const 1) ; 压入常数1到栈顶
	(i32.const 2) ; 压入常数2到栈顶
) ; 执行i32.add指令，计算栈顶两个元素的和
```

<swiper-container>
  <image-with-caption src="/images/2024-03-09-WASM-branch-cn/add_1.png" caption="压入常数1到栈顶" width="100%"></image-with-caption>  
  <image-with-caption src="/images/2024-03-09-WASM-branch-cn/add_2.png" caption="压入常数2到栈顶" width="100%"></image-with-caption>  
  <image-with-caption src="/images/2024-03-09-WASM-branch-cn/add_3.png" caption="执行i32.add指令，计算栈顶两个元素的和" width="100%"></image-with-caption>  
</swiper-container>


### 累加器

累加器使用一个特殊的寄存器（累加器）来存储结果。计算 1+2 的值，对应到累加器的指令是：

```plaintext
LOAD 1  // 将1加载到累加器
ADD 2   // 将累加器中的值与2相加，由于只有一个寄存器，不需要
STORE   // 将累加器中的值3存入内存
```

### 寄存器机

寄存器机使用一个多个寄存器来存储结果。计算 1+2 的值，对应到累加器的指令是：

```plaintext
LOAD R1, 1     // 将1加载到寄存器R1
LOAD R2, 2     // 将2加载到寄存器R2
ADD R3, R1, R2 // 将R1，R2中的值相加，并将结果存储到寄存器R3
```


## 值类型

下一个问题是，堆栈机中的栈会存放哪些元素？首先介绍 WASM 所定义的值(value)的类型，总共有以下三类：

- 数字类型(number)
  - `i32`
  - `i64`
  - `f32`
  - `f64`
- 向量类型(vector)
  - `v128`
- 引用类型(ref) - `ref.null t` - `ref funcaddr` - `ref.extern externaddr`
  **数字类型**是最简明的，有 32 位/64 位的整形/浮点型。数字类型没有正负之分，其含义有操作数决定。**向量类型**由 128 位的整数/浮点数组成。它是后期为了支持 SIMD 新增的类型，可以对整数/浮点数组进行 SIMD 操作来提高计算性能，通常会用在多媒体处理，加密算法和科学计算等场景。**引用类型**是为了帮助 WASM 操作复杂的数据结构(比如宿主的对象)。引用类型分为三种：`funcref`是函数引用，允许将函数作为参数传递或存储在数据结构中。`externref`是外部引用，这个类型可以引用任何宿主的对象。`null t` 表示`t`类型（`t`为函数引用/外部引用）的空引用。





## 分支

**标签(Label)** 让我们能够跳转到代码的某一位置，从而实现分支/循环/函数调用等等能力。我们在很多编程语言中都会用到标签来实现跳转，比如以下 Javascript 的例子：

```js
let str = "";

loop1: for (let i = 0; i < 5; i++) {
  if (i === 1) {
    continue loop1; // specify to continue the statement labeld as loop1
  }
  str = str + i;
}

console.log(str);
// Expected output: "0234"
```

标签在 WASM 同样也是标注了代码的某个位置，配合操作数实现控制流。具体来说，每个标签类型包含了一段连续的代码，可以通过开始位置和结束位置表示(即一个`start_pos`和一个`end_pos`)。标签分为以下两种用法：

- **Block**: 用来标识一个代码块，如果中途有`br`指令则会继续执行`end_pos`后面的指令
- **Loop**: 用来标识一个循环，如果中途有`br`指令则会重新回到`start_pos`。




由上面可见，同样一个 branch 到一个标签，block 标签和 loop 标签的行为是不一样的。这是因为 WASM 的`br`并不会直接跳到代码的某处，而是通过读取在栈中储存的标签来实现。在栈中，block 标签和 loop 标签会告诉`br`，当 branch 到自己时，应该跳转到哪个代码位置。

```plaintext
(block $my_block
	br $my_block
)
// <- br jumps to here


(loop $my_loop // <- br jumps to here
	br $my_loop
)

```

> [!info]
> 循环(loop)，选择(if)底层都是由分支(branch)实现的。

在二进制中，并不会有实际的`$my_block`这样的标识符。相反，[`br`](https://webassembly.github.io/spec/core/exec/instructions.html#xref-syntax-instructions-syntax-instr-control-mathsf-br-l)的会接收一个参数`l`，代表弹出的 label 数量。
比如如下代码：

```plaintext
(loop // level 1 for this br
  (block // level 0 this br
    br 1
  )
)
```

可以看到`br`接受了一个参数`1`, 这意味着它要弹出两个 label，第一个是内部的 block，第二个是外部的 loop。所以这复现了上述 javascript 例子中的内部`if`(作为内部 block)执行外部`loop`的`continue`指令。

<swiper-container>
  <image-with-caption src="/images/2024-03-09-WASM-branch-cn/loop_1.png" caption="声明了一个类型为loop的块。向栈内压一个labe，包含了arity=0表明这个块没有返回值，range=(1,5)表明这个块的起始位置是1，终止位置是5，continuation=1表明当branch到这个label时，跳到位置为1的指令（实现loop）。" width="100%"></image-with-caption>  
  <image-with-caption src="/images/2024-03-09-WASM-branch-cn/loop_2.png" caption="声明了一个类型为block的块。向栈内压一个labe，包含了arity=0表明这个块没有返回值，range=(2,4)表明这个块的起始位置是2，终止位置是4，continuation=5表明当branch到这个label时，跳到位置为5的指令（实现block）。" width="100%"></image-with-caption>  
  <image-with-caption src="/images/2024-03-09-WASM-branch-cn/loop_3.png" caption="branch指令，由于参数是1，表明我们需要弹出一个label，然后branch到下一个label的continuation位置。由于栈中弹出的第一个label的arity是0，所以无需任何处理。如果arity=n!=0，则表明此时在该label上仍有n个值。需要把这n个值一并弹出。" width="100%"></image-with-caption>  
  <image-with-caption src="/images/2024-03-09-WASM-branch-cn/loop_4.png" caption="弹出一个label后下一个label的continuation标明了跳转代码的位置。" width="100%"></image-with-caption>  
</swiper-container>

## 循环

下面是一个数到三的循环，包含了算数，逻辑计算，循环，变量等等内容，为本片博客的内容做个总结。

```plaintext
(module
  (func $count_to_three
    (local $i i32)  ; 定义一个名为$i的本地变量，用于计数

    ;; 设置初始的计数器值为0
    (local.set $i (i32.const 0))

    ;; 开始循环结构
    (loop $loop_label          ; **这里定义了一个label标签来标示循环的顶部**


      ;; 增加计数器的值
      (local.get $i)            ; 获取$i的当前值
      (i32.const 1)             ; 准备增加的值
      (i32.add)                 ; 执行加法
      (local.set $i)            ; 更新$i的值

      ;; 判断计数器的值是否已经达到上限
      (local.get $i)            ; 获取$i的当前值
      (i32.const 3)
      (i32.lt_s)                ; 检查$i是否小于3

      ;; **如果$i小于3，则跳转到标签 $loop_label 指向的循环顶部，继续循环**
      (br_if $loop_label)

      ;; 当计数器的值达到3时，循环结束
    )
  )
)
```
<swiper-container>
  <image-with-caption src="/images/2024-03-09-WASM-branch-cn/count3_1.png" caption="声明了一个类型为loop的块。向栈内压一个labe，包含了arity=0表明这个块没有返回值，range=(1,10)表明这个块的起始位置是1，终止位置是10，continuation=1表明当branch到这个label时，跳到位置为1的指令（实现loop）" width="100%"></image-with-caption>  
  <image-with-caption src="/images/2024-03-09-WASM-branch-cn/count3_2.png" caption="从local variable向量中读取$i" width="100%"></image-with-caption>  
  <image-with-caption src="/images/2024-03-09-WASM-branch-cn/count3_3.png" caption="压入1" width="100%"></image-with-caption>  
  <image-with-caption src="/images/2024-03-09-WASM-branch-cn/count3_4.png" caption="执行$i+1，压入栈" width="100%"></image-with-caption>
  <image-with-caption src="/images/2024-03-09-WASM-branch-cn/count3_5.png" caption="$i=$i+1" width="100%"></image-with-caption>  
  <image-with-caption src="/images/2024-03-09-WASM-branch-cn/count3_6.png" caption="从local variable向量中读取$i" width="100%"></image-with-caption>
  <image-with-caption src="/images/2024-03-09-WASM-branch-cn/count3_7.png" caption="压入3" width="100%"></image-with-caption>  
  <image-with-caption src="/images/2024-03-09-WASM-branch-cn/count3_8.png" caption="弹出栈顶两个元素，进行大小比较。注意，先弹出的是第二个operand，后弹出的是第一个operand，所以这里是1?<3" width="100%"></image-with-caption>
  <image-with-caption src="/images/2024-03-09-WASM-branch-cn/count3_9.png" caption="比较结果是true，所以执行branch" width="100%"></image-with-caption>  
  <image-with-caption src="/images/2024-03-09-WASM-branch-cn/count3_10.png" caption="跳转到label指定位置，重新开始循环" width="100%"></image-with-caption>
  <image-with-caption src="/images/2024-03-09-WASM-branch-cn/wait.jpg" caption="a few moments later" width="100%"></image-with-caption>  
  <image-with-caption src="/images/2024-03-09-WASM-branch-cn/count3_11.png" caption="经过三轮循环，此时$i=3，比较结果是false" width="100%"></image-with-caption>
  <image-with-caption src="/images/2024-03-09-WASM-branch-cn/count3_12.png" caption="branch不执行" width="100%"></image-with-caption>  
  <image-with-caption src="/images/2024-03-09-WASM-branch-cn/count3_13.png" caption="推出循环" width="100%"></image-with-caption>                 
</swiper-container>