---

title:  "CSS-rem"
date:   2021-03-13 12:29:23 +0800
categories: Front-end Note CSS
toc: true
---


# Rem

## 1.rem基础
  rem(root em)是一个相对单位，类似于em（父元素字体大小）,rem是根元素的字体大小。\
  不同的是rem的基准是***相对于html元素***的字体大小。\
  比如，根元素（html）设置`font-size = 12px` 非根元素设置`width: 2rem`,则换算成`px`表示`24px`。
  由此来达到整体控制所有元素比例的效果。

## 2. media query媒体查询
  * 针对不同的屏幕尺寸设置不同的样式。
  * 重置浏览器的过程中，根据浏览器宽度和高度重新渲染页面

### 1. 媒体查询语法规范
  ```css
  @media mediatype and|not|only (media feature){
    CSS-code;
  }

  @media screen and print and (max-width: 800px){

  }
  @media screen only (){

  }
  ```
 * Media type
    |value|description|
    |---|---|
    |all|所有设备|
    |print|打印机|
    |screen|电脑设备，手机|

* Media feature
  |value|description|
  |---|---|
  |width||
  |max-width|在宽度不大于`max-width`时，设置该样式|
  |min-width|在宽度不小于`min-width`是设置该样式|

### 2. 引入资源
   不同的媒体使用不同的css文件，在`link`中判断尺寸
   ```html
   <link rel = "stylesheet" href = "style320.css" media  = "screen and (min-width: 320px)">
  <link rel = "stylesheet" href = "style640.css" media  = "screen and (min-width: 640px)>"
   ```

## 3.Less介绍
### 1. less介绍
1.  less 变量
   ```less
   @变量名:值
   @color: pink
   background-color: @color
   ```
   变量名的规范：
   * 以@为前缀
   * 不能包含特殊字符
   * 不能以数字开头
   * 大小写敏感

2. Less的编译
   
   less编译生成css文件

3. Less嵌套
   如果是子元素，可直接在父元素里写。
  ```less
  .header{
    width:200px;
    a{
      color: red;
    }
  }
  ```
  伪元素/伪类的嵌套(这样生成的css不会认为hover是a的子元素，而是其一个伪元素)
```  less
a{
    color: red;
    &:hover{
      color: blue
    }
  }
```


4. Less运算
  
  ⚠️注意： 
  * 运算符左右必须敲空格隔开
  * 单位问题：如果两个数都有单位，且单位不同，结果以第一个单位为准
```less
   @border: 5px + 5;
   div{
     width: 200px - 50;
     border: @border solid red;
   }
```
5. Less import
    ```less
    @import "common"
    //将common.less引入
    ```
  ## 4. Rem适配方案
* 让一些不能等比自适应的元素在尺寸改变以后也能适应。
* 使用媒体查询更具不同设备设置html字体大小，然后元素用rem左尺寸单位。



  ### 1. rem+媒体查询+less
  1. 动态设置html标签font-size大小
   * 若设计稿是750px，则把屏幕分成15等份，每一份作为html的字体大小
  ```css
  @media screen and (min-width: 320px){
    html{
      font-size: 21.33px;
    }
  }

  @media screen and (min-width: 640px){
    html{
      font-size: 50px;
    }
  }

  div{
    width: 2rem;
  }
  ```


### 2. flexible.js
   * 不需要写媒体查询，把所有设备划分十等份。
   * 只需要确定好html文字设置好就可以了（根据设计稿的宽度/10）
   * **注意：** 使用cssrem插件的时候需要设置好默认的html的font-size(设置里搜索cssroot)
