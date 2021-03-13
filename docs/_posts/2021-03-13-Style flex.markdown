---
layout: post
title:  "CSS-Flex"
date:   2021-03-13 12:29:23 +0800
categories: Front-end Note
---

<!-- TOC -->

- [Flex 布局](#flex-布局)
  - [1. flex布局原理](#1-flex布局原理)
  - [2. flex布局父项常见属性](#2-flex布局父项常见属性)
    - [1. 主轴和侧轴方向：`flex-direction`](#1-主轴和侧轴方向flex-direction)
    - [2. 这只主轴上子元素的排列方式：`justify-content`](#2-这只主轴上子元素的排列方式justify-content)
    - [3. 通过`flex-wrap`设置是否换行](#3-通过flex-wrap设置是否换行)
    - [4. 通过`align-items`设置侧轴上元素的排列方式(使用与单行)](#4-通过align-items设置侧轴上元素的排列方式使用与单行)
    - [5. 通过`align-content`设置侧轴上元素的排列方式（适用于多行）](#5-通过align-content设置侧轴上元素的排列方式适用于多行)
  - [flex 布局子项常见属性](#flex-布局子项常见属性)
    - [1. flex子项占的份数`flex`](#1-flex子项占的份数flex)
    - [2. align-self: 控制子项在**侧轴**的排列方式（单个项目）](#2-align-self-控制子项在侧轴的排列方式单个项目)
    - [3. order控制项目的排列顺序](#3-order控制项目的排列顺序)

<!-- /TOC -->
# Flex 布局

|传统布局| flex|
|---|---|
|布局繁琐| 操作方便， 布局简单|
|兼容性好|PC端支持较差|
|不能在移动端很好的布局 |支持移动端|

## 1. flex布局原理
* flex: flexible box的缩写，“弹性布局”，任何一个容器都可以指定为flex布局。
* 父元素设定为flex布局后，子元素的`float`，`clear`和`vertical-align`属性会失效。
* 采用flex布局的元素叫做flex容器(flex container)，子元素称为flex项目(flex item)。
* **原理： 通过给父盒子添加flex属性来控制子盒子的位置和排列方式。**
```css
  div{
    display:flex;
    justify-content: space-around;
  }
```
## 2. flex布局父项常见属性
### 1. 主轴和侧轴方向：`flex-direction`
  * 默认主轴方向： x轴，水平向右(row)
  * 默认侧轴方向： y轴，水平向下(col)

```html
<div>
  <span></span>
  <span></span>
  <span></span>
  <!-- 三个span按行排列 -->
</div>
```
```css
  div{
    display:flex;
    justify-content: space-around;
    flex-direction: row;//(也是默认的，不写也可)
    //flex-direction: column;主轴设置为y轴，按列排列
  }
```
### 2. 这只主轴上子元素的排列方式：`justify-content`
   
  |属性|描述|
  |---|---|
  |`flex-start`|向主轴开始对齐|
  |`flex-end`|向主轴末端对齐|
  |`center`|向中间对齐|
  |`space-around`|平分剩余空间|
  |`space-between`|两边贴边，剩下的平分|


### 3. 通过`flex-wrap`设置是否换行
   
  flex布局中，默认子元素不换行，如果装不下，会缩小子元素的宽度。
  ```css
  flex-wrap: nowrap(默认不换行)
  flex-wrap: wrap(换行)
  ```

### 4. 通过`align-items`设置侧轴上元素的排列方式(使用与单行)

只有在单行时可以使用
  |属性|描述|
  |---|---|
  |`flex-start`|向主轴开始对齐|
  |`flex-end`|向主轴末端对齐|
  |`center`|向中间对齐|
  |`stretch`|子元素平分父元素高度|

  ```css
  align-items: flex-start//和justify content选项一样
  align-items: flex-end
  align-items: center
  align-items: stretch
  ```
### 5. 通过`align-content`设置侧轴上元素的排列方式（适用于多行）

  |属性|描述|
  |---|---|
  |`flex-start`|向侧轴开始对齐|
  |`flex-end`|向侧轴末端对齐|
  |`center`|向中间对齐|
  |`space-around`|平分剩余空间|
  |`space-between`|两边贴边，剩下的平分|
  |`stretch`|子元素平分父元素高度|
```css
  flex-wrap: wrap;//此时有换行
  align-content: flex-start
```


## flex 布局子项常见属性
### 1. flex子项占的份数`flex`
flex属性定义子项目分配的剩余空间（container长宽减去元素的固定长宽），用flex来表示占多少份数
```css
  flex: 1;//将剩下空间分成一份给他
```


### 2. align-self: 控制子项在**侧轴**的排列方式（单个项目）
使得某个单个项目与其他有不一样的对齐方式
```css
div:nth-child(2){
  align-self:flex-end
}
```

### 3. order控制项目的排列顺序
交换两个项目的顺序
```css
div:nth-child(2){
  order:-1;
}
```