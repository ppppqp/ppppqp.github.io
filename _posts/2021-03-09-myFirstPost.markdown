---
layout: post
title:  "HTML5新增特性"
date:   2021-03-09 20:29:23 +0800
categories: jekyll update
---
# HTML5 新增特性
只有IE9+能支持！
## 1. HTML5新增语义标签
* `<header>`
* `<nav>`
* `<article>`
* `<section>`
* `<aside>`
* `footer`

```html
  <header>Header</header>
  <nav> Navbar </nav>
  <section> Big DIV</section>
```

## 2. HTML5新增多媒体标签
1. 音频`<audio>`
   尽量使用mp3格式

  |属性|说明|
  | --- | --- |
  |`autoplay = "autoplay"` |是否自动播放(chrome会有问题)|
  |`controls = "controls"` |控制组件|
  |`width`| 和普通盒子一样|
  |`loop = "loop"`| 是否循环|

  ```html
   <audio src = "url" controls = "controls">
    <source src = "music.mp3" type = "music/mp3">
   </audio>
   ```
   
2. 视频`<video>`
  尽量使用mp4格式



  |属性|说明|
  | --- | --- |
  |`autoplay = "autoplay"` |是否自动播放|
  |`muted = "muted"` |对chrome使用muted来强制自动播放|
|`controls = "controls"` |控制组件|
 |`width`| 和普通盒子一样|
  |`loop = "loop"`| 是否循环|
  
   ```html
   <video src = "url" controls = "controls">
    <source src = "movie.mp4" type = "video/mp4">
    <source src = "movie.ogg" type = "video/ogg">
   </video>
   ```


   ## 3. HTML5新增的input类型
  自动检测是否满足格式
  |属性|说明|
  | --- | --- |
  |`type = "email"` |邮箱|
  |`type = "url"` |网址|
  |`type = "date"` |容器|
  |`type = "time"`|时间 |
  |`type = "number"`| 数量|
  |`type = "tel"`| 手机|
  |`type = "search"`| 搜索|
  |`type = "color"`| 颜色|
  |`type = "submit"`| 提交|
  |`required = "required"`|是否一定需要|
  |`placeholder = "see?"`|填写默认展示的字符|
  |`autofocus = "autofocus"`| 自动获得焦点|


