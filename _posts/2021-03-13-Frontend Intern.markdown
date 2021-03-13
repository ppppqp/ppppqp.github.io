---

title:  "Frontend Interview Problem Set 1"
date:   2021-03-13 14:29:23 +0800
categories: Front-end Note Intern
toc: true
---


## 1. Cookie的利弊
* Cookie: 小型文本文件，网站为了辨别用户身份，进行session跟踪而储存在用户本地终端上的数据，有用户的客户端计算机暂时或永久保存的信息。
* 一个Web 站点可能会为每一个访问者产生一个唯一的ID, 然后以 Cookie 文件的形式保存在每个用户的机器上。如果使用浏览器访问 Web, 会看到所有保存在硬盘上的 Cookie。在这个文件夹里每一个文件都是一个由“名/值”对组成的文本文件,另外还有一个文件保存有所有对应的 Web 站点的信息。

利：
* 分担服务器存储的负担
* 持久保存用户信息
* 扩展性和可用性
  * 通过编程，控制cookie中session对象的大小
  * 通过安全传输技术，减少cookie被破解的可能性
  * cookie中存放不敏感数据

局限性：
* 最大大约4096字节。
* 每个domain最多只有20条cookie。
* 安全性问题：拦截者并不需要直到cookie的意义，只要照原样发送cookie就可以了。

---
<input type = "checkbox"></input>
## 2. 浏览器本地储存是怎样的
* 在较高版本的浏览器中，js提供了sessionStorage和globalStorage。在HTML5中提供了localStorage来取代globalStorage。
* html5中的Web Storage包括了两种存储方式：sessionStorage和localStorage。
  * sessionStorage用于本地存储一个会话（session）中的数据，这些数据只有在同一个会话中的页面才能访问并且当会话结束后数据也随之销毁。因此sessionStorage不是一种持久化的本地存储，仅仅是会话级别的存储。
  * 而localStorage用于持久化的本地存储，除非主动删除数据，否则数据是永远不会过期的。
---
<input type = "checkbox"></input>
## 3. Web storage和cookie的区别
* Web Storage的概念和cookie相似，区别是它是为了更大容量存储设计的。Cookie的大小是受限的，并且每次你请求一个新的页面的时候Cookie都会被发送过去，这样无形中浪费了带宽，另外cookie还需要指定作用域，不可以跨域调用。
* 除此之外，Web Storage拥有setItem,getItem,removeItem,clear等方法，不像cookie需要前端开发者自己封装setCookie，getCookie。
* 但是Cookie也是不可以或缺的：***Cookie的作用是与服务器进行交互，作为HTTP规范的一部分而存在 ，而Web Storage仅仅是为了在本地“存储”数据而生***
---
<input type = "checkbox"></input>
## 4. display:none和visibility:hidden
* display:none  隐藏对应的元素，在文档布局中不再给它分配空间，它各边的元素会合拢，就当他从来不存在。
* visibility:hidden  隐藏对应的元素，但是在文档布局中仍保留原来的空间。
  
---
<input type = "checkbox"></input>
## 5. CSS中 link 和@import 的区别是？
1. `link`属于HTML标签，而`@import`是CSS提供的;

2. 页面被加载的时，`link`会同时被加载，而`@import`引用的CSS会等到页面被加载完再加载;

3. import只在IE5以上才能识别，而link是HTML标签，无兼容问题;

---
<input type = "checkbox"></input>
## 6. position的absolute与fixed共同点与不同点:
* 共同点：
  1. 改变行内元素的呈现方式，display被置为inline-block；
  2. 让元素脱离普通流，不占据空间；
  3. 默认会覆盖到非定位元素上
* 不同点：\
  absolute的”根元素“是可以设置的，而fixed的”根元素“固定为浏览器窗口。
当你滚动网页，fixed元素与浏览器窗口之间的距离是不变的。

___
<input type = "checkbox"></input>
## 7. CSS盒子模型:
* 盒子模型：
  * 内容(content)：盒子内容的大小
  * 填充(padding)：content到border的距离
  * * 边框(border)：边框
  * 边界(margin)：边框到父元素或其他元素的距离


  ![box](images/box.jpeg)

___
 <input type = "checkbox"></input> 
## CSS 选择符有哪些？哪些属性可以继承？优先级算法如何计算？ CSS3新增伪类有那些？

CSS 选择符：
1. id选择器(# myid)
2. 类选择器(.myclassname)
3. 标签选择器(div, h1, p)
4. 相邻选择器(h1 + p)
5. 子选择器(ul > li)
6. 后代选择器(li a)
7. 通配符选择器( * )
8. 属性选择器(a[rel = "external"])
9. 伪类选择器(a: hover, li:nth-child)

可继承的样式：
1. font-size
2. font-family
3. color
4. text-indent

不可继承的样式：
1. border
2. padding
3. margin
4. width
5. height

优先级算法：
1. 优先级就近原则，同权重情况下样式定义最近者为准;
2. 载入样式以最后载入的定位为准;
3. !important >  id > class > tag  
4. important 比 内联优先级高，但内联比 id 要高

CSS3新增伪类举例：
`p:first-of-type` 选择属于其父元素的首个 <p> 元素的每个 <p> 元素。
`p:last-of-type`  选择属于其父元素的最后 <p> 元素的每个 <p> 元素。
`p:only-of-type ` 选择属于其父元素唯一的 <p> 元素的每个 <p> 元素。
`p:only-child`    选择属于其父元素的唯一子元素的每个 <p> 元素。
`p:nth-child(2)`  选择属于其父元素的第二个子元素的每个 <p> 元素。
`:enabled :disabled` 控制表单控件的禁用状态。
`:checked`        单选框或复选框被选中。

---
<input type = "checkbox"></input>
## 列出display的值，说明他们的作用。position的值， relative和absolute分别是相对于谁进行定位的？

display 的值的作用：
1. block 象块类型元素一样显示。
2. inline 缺省值。象行内元素类型一样显示。
3. inline-block 象行内元素一样显示，但其内容象块类型元素一样显示。
4. list-item 象块类型元素一样显示，并添加样式列表标记。

position 的值的定位区别：
1. absolute 生成绝对定位的元素，相对于 static 定位以外的第一个祖先元素进行定位。
2. fixed 生成固定定位的元素，相对于浏览器窗口进行定位（老IE不支持）。
3. relative 生成相对定位的元素，相对于其在普通流中的位置进行定位。
4. static 默认值。没有定位，元素出现在正常的流中（忽略 top, bottom, left, right z-index 声明）。
5. inherit 规定从父元素继承 position 属性的值。
 ___
<input type = "checkbox"></input>
## 10. CSS3有哪些新特性？
1. CSS3实现圆角（border-radius），阴影（box-shadow），
2. 对文字加特效（text-shadow、），线性渐变（gradient），旋转（transform）
3. transform:rotate(9deg) scale(0.85,0.90) translate(0px,-30px) skew(-9deg,0deg);// 旋转,缩放,定位,倾斜
4. 增加了更多的CSS选择器  多背景 rgba
5. 在CSS3中唯一引入的伪类是 ::selection.
6. 媒体查询，多栏布局
7. border-image
___
<input type = "checkbox"></input>
## 11.为什么要初始化CSS样式
因为浏览器的兼容问题，不同浏览器对有些标签的默认值是不同的，如果没对CSS初始化往往会出现浏览器之间的页面显示差异。
当然，初始化样式会对SEO有一定的影响，但鱼和熊掌不可兼得，但力求影响最小的情况下初始化。
___
<input type = "checkbox"></input>
<h2 > <font color = blue>12. 对BFC规范的理解？</font></h2>

BFC，块级格式化上下文，一个创建了新的BFC的盒子是独立布局的，盒子里面的子元素的样式不会影响到外面的元素。在同一个 BFC 中的两个毗邻的块级盒在垂直方向（和布局方向有关系）的 margin 会发生折叠。

W3C CSS 2.1 规范中的一个概念，它决定了元素如何对其内容进行布局，以及与其他元素的关系和相互作用。

___
<input type = "checkbox"></input>
## 13. 解释下 CSS sprites，以及你要如何在页面或网站中使用它。

CSS Sprites 其实就是把网页中一些背景图片整合到一张图片文件中，再利用 CSS 的"background-image"，"background-repeat"，"background-position" 的组合进行背景定位，background-position 可以用数字能精确的定位出背景图片的位置。这样可以减少很多图片请求的开销，因为请求耗时比较长；请求虽然可以并发，但是也有限制，一般浏览器都是6个。对于未来而言，就不需要这样做了，因为有了 http2。

___
<input type = "checkbox"></input>
 ## 14. 说说你对语义化的理解？

1. 去掉或者丢失样式的时候能够让页面呈现出清晰的结构
2. 有利于SEO：和搜索引擎建立良好沟通，有助于爬虫抓取更多的有效信息：爬虫依赖于标签来确定上下文和各个关键字的权重；
3. 方便其他设备解析（如屏幕阅读器、盲人阅读器、移动设备）以意义的方式来渲染网页；
4. 便于团队开发和维护，语义化使得网页更具可读性，是进一步开发网页的必要步骤，遵循W3C标准的团队都遵循这个标准，可以减少差异化。

___
<input type = "checkbox"></input>
## 15. Doctype作用? 严格模式与混杂模式如何区分？它们有何意义?

1. `<!DOCTYPE> `声明位于文档中的最前面，处于` <html> `标签之前。告知浏览器以何种模式来渲染文档。 
2. 严格模式的排版和 JS 运作模式是  以该浏览器支持的最高标准运行。
3. 在混杂模式中，页面以宽松的向后兼容的方式显示。模拟老式浏览器的行为以防止站点无法工作。
4. DOCTYPE不存在或格式不正确会导致文档以混杂模式呈现。 


___
<input type = "checkbox"></input>

<h2 > <font color = blue>16. 你知道多少种Doctype文档类型？</font></h2>
1. 该标签可声明三种 DTD 类型，分别表示严格版本、过渡版本以及基于框架的 HTML 文档。
2. HTML 4.01 规定了三种文档类型：Strict、Transitional 以及 Frameset。
3. XHTML 1.0 规定了三种 XML 文档类型：Strict、Transitional 以及 Frameset。
4. Standards （标准）模式（也就是严格呈现模式）用于呈现遵循最新标准的网页，而 Quirks（包容）模式（也就是松散呈现模式或者兼容模式）用于呈现为传统浏览器而设计的网页。

___
<input type = "checkbox"></input>

<h2 > <font color = blue>17. HTML与XHTML——二者有什么区别</font></h2>

最主要的不同：

* XHTML 元素必须被正确地嵌套。
* XHTML 元素必须被关闭。
* 标签名必须用小写字母。
* XHTML 文档必须拥有根元素。


___
<input type = "checkbox"></input>

<h2 > <font color = blue>18. html常见兼容性问题？</font></h2>

1. png24位的图片在iE6浏览器上出现背景
解决方案：做成PNG8，也可以引用一段脚本处理.

2. 浏览器默认的margin和padding不同
解决方案：加一个全局的 *{margin:0;padding:0;} 来统一。

5. IE下，可以使用获取常规属性的方法来获取自定义属性，也可以使用 getAttribute() 获取自定义属性；Firefox下,只能使用getAttribute()获取自定义属性
解决方法：统一通过getAttribute()获取自定义属性

6. IE下，event对象有 x、y 属性，但是没有 pageX、pageY属性; Firefox下，event对象有 pageX、pageY 属性，但是没有 x、y 属性
解决方法：（条件注释）缺点是在IE浏览器下可能会增加额外的HTTP请求数。

7. Chrome 中文界面下默认会将小于 12px 的文本强制按照 12px 显示
解决方法：可通过加入 CSS 属性 -webkit-text-size-adjust: none; 解决

8. 超链接访问过后 hover 样式就不出现了，被点击访问过的超链接样式不在具有 hover 和 active 了
解决方法：改变CSS属性的排列顺序 L-V-H-A

___

<input type = "checkbox"></input>

<h2 > <font>20. 解释下浮动和它的工作原理？清除浮动的技巧</font></h2>

浮动元素脱离文档流，不占据空间。浮动元素碰到包含它的边框或者浮动元素的边框停留。

1. 使用空标签清除浮动。
这种方法是在所有浮动标签后面添加一个空标签 定义css clear:both. 弊端就是增加了无意义标签。

2. 使用overflow。
给包含浮动元素的父标签添加css属性 overflow:auto; zoom:1; zoom:1用于兼容IE6。

3. 使用after伪对象清除浮动。
该方法只适用于非IE浏览器。具体写法可参照以下示例。使用中需注意以下几点。一、该方法中必须为需要清除浮动元素的伪对象中设置 height:0，否则该元素会比实际高出若干像素；

可以给父元素设置`overflow：auto`或者`hidden`

___

<input type = "checkbox"></input>

<h2 > <font>21. IE 8以下版本的浏览器中的盒模型有什么不同</font></h2>
IE8以下浏览器的盒模型中定义的元素的宽高包括内边距和边框

___

<input type = "checkbox"></input>

<h2 > <font color = blue>22. DOM操作——怎样添加、移除、移动、复制、创建和查找节点。</font></h2>
1. 创建新节点

```
createDocumentFragment() // 创建一个DOM片段
createElement() // 创建一个具体的元素
createTextNode() // 创建一个文本节点
```

1. 添加、移除、替换、插入
  
```
appendChild()
removeChild()
replaceChild()
insertBefore() // 在已有的子节点前插入一个新的子节点
```

1. 查找
```
getElementsByTagName() // 通过标签名称
getElementsByName() // 通过元素的Name属性的值(IE容错能力较强，会得到一个数组，其中包括id等于name值的)
getElementById() // 通过元素Id，唯一性
```

___

<input type = "checkbox"></input>

<h2 > <font color = blue>23. html5有哪些新特性、移除了那些元素？如何处理HTML5新标签的浏览器兼容问题？如何区分 HTML 和 HTML5？</font></h2>


新特性：
HTML5 现在已经不是 SGML 的子集，主要是关于图像，位置，存储，多任务等功能的增加。
1. 拖拽释放(Drag and drop) API 
2. 语义化更好的内容标签（header,nav,footer,aside,article,section）
3. 音频、视频API(audio,video)
4. 画布(Canvas) API
5. 地理(Geolocation) API
6. 本地离线存储 localStorage 长期存储数据，浏览器关闭后数据不丢失；
7. sessionStorage 的数据在浏览器关闭后自动删除
8. 表单控件，calendar、date、time、email、url、search  
9. 新的技术webworker, websocket, Geolocation

移除的元素：
1. 纯表现的元素：basefont，big，center，font, s，strike，tt，u；
2. 对可用性产生负面影响的元素：frame，frameset，noframes；

支持HTML5新标签：
1. IE8/IE7/IE6支持通过 document.createElement 方法产生的标签，可以利用这一特性让这些浏览器支持 HTML5 新标签，浏览器支持新标签后，还需要添加标签默认的样式（当然最好的方式是直接使用成熟的框架、使用最多的是html5shiv框架）：
```html
<!--[if lt IE 9]> 
<script> src="http://html5shiv.googlecode.com/svn/trunk/html5.js"</script> 
<![endif]--> 
```
如何区分： 
DOCTYPE声明新增的结构元素、功能元素


___

<input type = "checkbox"></input>

<h2 > <font color = blue>24. iframe的优缺点？</font></h2>
优点：
1. 解决加载缓慢的第三方内容如图标和广告等的加载问题
2. Security sandbox
3. 并行加载脚本

缺点：
1. iframe会阻塞主页面的Onload事件
2. 即时内容为空，加载也需要时间
3. 没有语意
 ___

<input type = "checkbox"></input>

<h2 > <font color = blue>25.如何实现浏览器内多个标签页之间的通信?</font></h2>
调用 localstorge、cookies 等本地存储方式


___

<input type = "checkbox"></input>

<h2 > <font color = blue>26.webSocket 如何兼容低浏览器？?</font></h2>
Adobe Flash Socket 、 ActiveX HTMLFile (IE) 、 基于 multipart 编码发送 XHR 、 基于长轮询的 XHR


___

<input type = "checkbox"></input>

<h2 > <font color = blue>27.线程与进程的区别?</font></h2>

1. 一个程序至少有一个进程,一个进程至少有一个线程
2. 线程的划分尺度小于进程，使得多线程程序的并发性高
3. 另外，进程在执行过程中拥有独立的内存单元，而多个线程共享内存，从而极大地提高了程序的运行效率
4. 线程在执行过程中与进程还是有区别的。每个独立的线程有一个程序运行的入口、顺序执行序列和程序的出口。但是线程不能够独立执行，必须依存在应用程序中，由应用程序提供多个线程执行控制 
5. 从逻辑角度来看，多线程的意义在于一个应用程序中，有多个执行部分可以同时执行。但操作系统并没有将多个线程看做多个独立的应用，来实现进程的调度和管理以及资源分配。这就是进程和线程的重要区别


___
<input type = "checkbox"></input>

<h2 > <font color = blue>28.你如何对网站的文件和资源进行优化？?</font></h2>

期待的解决方案包括：
1. 文件合并
2. 文件最小化/文件压缩
3. 使用 CDN 托管
4. 缓存的使用（多个域名来提供缓存）
5. 其他


___
<input type = "checkbox"></input>

<h2 > <font color = blue>29请说出三种减少页面加载时间的方法</font></h2>

1. 优化图片 
2. 图像格式的选择（GIF：提供的颜色较少，可用在一些对颜色要求不高的地方） 
3. 优化CSS（压缩合并css，如 margin-top, margin-left...) 
4. 网址后加斜杠（如 www.campr.com/ 目录，会判断这个目录是什么文件类型，或者是目录。） 
5. 标明高度和宽度（如果浏览器没有找到这两个参数，它需要一边下载图片一边计算大小，如果图片很多，浏览器需要不断地调整页面。这不但影响速度，也影响浏览体验。 
当浏览器知道了高度和宽度参数后，即使图片暂时无法显示，页面上也会腾出图片的空位，然后继续加载后面的内容。从而加载时间快了，浏览体验也更好了） 
6. 减少http请求（合并文件，合并图片）

___
<input type = "checkbox"></input>

<h2 > <font color = blue>31.什么是 FOUC（无样式内容闪烁）？你如何来避免 FOUC？
</font></h2>

FOUC - Flash Of Unstyled Content 文档样式闪烁

```<style type="text/css" media="all">@import "../fouc.css";</style> ```

而引用CSS文件的@import就是造成这个问题的罪魁祸首。IE会先加载整个HTML文档的DOM，然后再去导入外部的CSS文件，因此，在页面DOM加载完成到CSS导入完成中间会有一段时间页面上的内容是没有样式的，这段时间的长短跟网速，电脑速度都有关系。
解决方法简单的出奇，只要在```<head>之间加入一个<link>或者<script>元素就可以了```


___
<input type = "checkbox"></input>

<h2 > <font color = blue>32.null和undefined的区别？
</font></h2>

null是一个表示"无"的对象，转为数值时为0
undefined是一个表示"无"的原始值，转为数值时为NaN

当声明的变量还未被初始化时，变量的默认值为undefined
null用来表示尚未存在的对象，常用来表示函数企图返回一个不存在的对象

undefined表示 “缺少值”，就是此处应该有一个值，但是还没有定义。典型用法是：
1. 变量被声明了，但没有赋值时，就等于 undefined
2. 调用函数时，应该提供的参数没有提供，该参数等于 undefined
3. 对象没有赋值的属性，该属性的值为 undefined
4. 函数没有返回值时，默认返回 undefined

null表示“没有对象”，即该处不应该有值。典型用法是：
1. 作为函数的参数，表示该函数的参数不是对象
2. 作为对象原型链的终点


___
<input type = "checkbox"></input>

<h2 > <font color = blue>33.new操作符具体干了什么呢?
</font></h2>


1. 创建一个空对象，并且 this 变量引用该对象，同时还继承了该函数的原型
2. 属性和方法被加入到 this 引用的对象中
3. 新创建的对象由 this 所引用，并且最后隐式的返回 this


___
<input type = "checkbox"></input>

<h2 > <font color = blue>34.对JSON 的了解？
</font></h2>

JSON(JavaScript Object Notation) 是一种轻量级的数据交换格式。它是基于JavaScript的一个子集。数据格式简单, 易于读写, 占用带宽小。


___
<input type = "checkbox"></input>

<h2 > <font color = blue>35.js延迟加载的方式有哪些？
</font></h2>

1. defer和async
2. 动态创建DOM方式（创建script，插入到DOM中，加载完毕后callBack）
3. 按需异步载入js



___
<input type = "checkbox"></input>

<h2 > <font color = blue>35.js延迟加载的方式有哪些？
</font></h2>

document.write 只能重绘整个页面

innerHTML 可以重绘页面的一部分


___
<input type = "checkbox"></input>

<h2 > <font color = blue>36.call() 和 .apply() 的作用？
</font></h2>动态改变某个类的某个方法的运行环境



___
<input type = "checkbox"></input>

<h2 > <font color = blue>37.哪些操作会造成内存泄漏？
</font></h2>
内存泄漏指任何对象在您不再拥有或需要它之后仍然存在。
垃圾回收器定期扫描对象，并计算引用了每个对象的其他对象的数量。如果一个对象的引用数量为 0（没有其他对象引用过该对象），或对该对象的惟一引用是循环的，那么该对象的内存即可回收。

1. setTimeout 的第一个参数使用字符串而非函数的话，会引发内存泄漏。
2. 闭包
3. 控制台日志
4. 循环（在两个对象彼此引用且彼此保留时，就会产生一个循环）


___
<input type = "checkbox"></input>

<h2 > <font color = blue>37.如何判断当前脚本运行在浏览器还是node环境中？
</font></h2>

通过判断 Global 对象是否为window，如果不为window，当前脚本没有运行在浏览器中。即在node中的全局变量是global ,浏览器的全局变量是window。 可以通过该全局变量是否定义来判断宿主环境

___
<input type = "checkbox"></input>

<h2 > <font color = blue>44.你有哪些性能优化的方法？
</font></h2>

1. 减少http请求次数：CSS Sprites, JS、CSS 源码压缩、图片大小控制合适；网页 Gzip，CDN 托管，data 缓存 ，图片服务器
2. 前端模板 JS + 数据，减少由于HTML标签导致的带宽浪费，前端用变量保存 AJAX 请求结果，每次操作本地变量，不用请求，减少请求次数
3. 用 innerHTML 代替 DOM 操作，减少 DOM 操作次数，优化 javascript 性能
4. 当需要设置的样式很多时设置 className 而不是直接操作 style
5. 少用全局变量、缓存DOM节点查找的结果。减少 IO 读取操作
6. 避免使用 CSS Expression（css表达式)又称 Dynamic properties(动态属性)
7. 图片预加载，将样式表放在顶部，将脚本放在底部，加上时间戳


___
<input type = "checkbox"></input>

<h2 > <font color = blue>46.一个页面从输入 URL 到页面加载显示完成，这个过程中都发生了什么？
</font></h2>

分为4个步骤：
1. 当发送一个 URL 请求时，不管这个 URL 是 Web 页面的 URL 还是 Web 页面上每个资源的 URL，浏览器都会开启一个线程来处理这个请求，同时在远程 DNS 服务器上启动一个 DNS 查询。这能使浏览器获得请求对应的 IP 地址。
2. 浏览器与远程 Web 服务器通过 TCP 三次握手协商来建立一个 TCP/IP 连接。该握手包括一个同步报文，一个同步-应答报文和一个应答报文，这三个报文在 浏览器和服务器之间传递。该握手首先由客户端尝试建立起通信，而后服务器应答并接受客户端的请求，最后由客户端发出该请求已经被接受的报文。
3. 一旦 TCP/IP 连接建立，浏览器会通过该连接向远程服务器发送 HTTP 的 GET 请求。远程服务器找到资源并使用 HTTP 响应返回该资源，值为 200 的 HTTP 响应状态表示一个正确的响应。
4. 此时，Web 服务器提供资源服务，客户端开始下载资源。

请求返回后，便进入了我们关注的前端模块
简单来说，浏览器会解析 HTML 生成 DOM Tree，其次会根据 CSS 生成 CSS Rule Tree，而 javascript 又可以根据 DOM API 操作 DOM

___
<input type = "checkbox"></input>

<h2 > <font color = blue>47.javascript对象的几种创建方式
</font></h2>

创建方式：
1. 工厂模式
2. 构造函数模式
3. 原型模式
4. 混合构造函数和原型模式
5. 动态原型模式
6. 寄生构造函数模式
7. 稳妥构造函数模式

继承方法：
1. 原型链继承
2. 借用构造函数继承
3. 组合继承(原型+借用构造)
4. 原型式继承
5. 寄生式继承
6. 寄生组合式继承

___
<input type = "checkbox"></input>

<h2 > <font color = blue>51.javascript对象的几种创建方式
</font></h2>


1. 创建XMLHttpRequest对象,也就是创建一个异步调用对象
2. 创建一个新的HTTP请求,并指定该HTTP请求的方法、URL及验证信息
3. 设置响应HTTP请求状态变化的函数
4. 发送HTTP请求
5. 获取异步调用返回的数据
6. 使用JavaScript和DOM实现局部刷新

___
<input type = "checkbox"></input>

<h2 > <font color = blue>52.异步加载和延迟加载
</font></h2>


1. 异步加载的方案： 动态插入 script 标签
2. 通过 ajax 去获取 js 代码，然后通过 eval 执行
3. script 标签上添加 defer 或者 async 属性
4. 创建并插入 iframe，让它异步执行 js
5. 延迟加载：有些 js 代码并不是页面初始化的时候就立刻需要的，而稍后的某些情况才需要的

___
<input type = "checkbox"></input>

<h2 > <font color = blue>58.请解释一下 JavaScript 的同源策略。
</font></h2>

概念：
同源策略是客户端脚本（尤其是Javascript）的重要的安全度量标准。它最早出自Netscape Navigator2.0，其目的是防止某个文档或脚本从多个不同源装载。
这里的同源策略指的是：协议，域名，端口相同，同源策略是一种安全协议，指一段脚本只能读取来自同一来源的窗口和文档的属性。

为什么要有同源限制：
我们举例说明：比如一个黑客程序，他利用Iframe把真正的银行登录页面嵌到他的页面上，当你使用真实的用户名，密码登录时，他的页面就可以通过Javascript读取到你的表单中input中的内容，这样用户名，密码就轻松到手了。


___
<input type = "checkbox"></input>

<h2 > <font color = blue>61.GET和POST的区别，何时使用POST？
</font></h2>


GET：一般用于信息获取，使用URL传递参数，对所发送信息的数量也有限制，一般在2000个字符
POST：一般用于修改服务器上的资源，对所发送的信息没有限制

GET方式需要使用 Request.QueryString 来取得变量的值
POST方式通过 Request.Form 来获取变量的值
也就是说 Get 是通过地址栏来传值，而 Post 是通过提交表单来传值。

在以下情况中，请使用 POST 请求：
1. 无法使用缓存文件（更新服务器上的文件或数据库）
2. 向服务器发送大量数据（POST 没有数据量限制）
3. 发送包含未知字符的用户输入时，POST 比 GET 更稳定也更可靠


___
<input type = "checkbox"></input>

<h2 > <font color = blue>62.哪些地方会出现css阻塞，哪些地方会出现js阻塞？
</font></h2>

js 的阻塞特性：所有浏览器在下载 JS 的时候，会阻止一切其他活动，比如其他资源的下载，内容的呈现等等。直到 JS 下载、解析、执行完毕后才开始继续并行下载其他资源并呈现内容。为了提高用户体验，新一代浏览器都支持并行下载 JS，但是 JS 下载仍然会阻塞其它资源的下载（例如.图片，css文件等）。
由于浏览器为了防止出现 JS 修改 DOM 树，需要重新构建 DOM 树的情况，所以就会阻塞其他的下载和呈现。
嵌入 JS 会阻塞所有内容的呈现，而外部 JS 只会阻塞其后内容的显示，2 种方式都会阻塞其后资源的下载。也就是说外部样式不会阻塞外部脚本的加载，但会阻塞外部脚本的执行。

CSS 怎么会阻塞加载了？CSS 本来是可以并行下载的，在什么情况下会出现阻塞加载了(在测试观察中，IE6 下 CSS 都是阻塞加载）
当 CSS 后面跟着嵌入的 JS 的时候，该 CSS 就会出现阻塞后面资源下载的情况。而当把嵌入 JS 放到 CSS 前面，就不会出现阻塞的情况了。
根本原因：因为浏览器会维持 html 中 css 和 js 的顺序，样式表必须在嵌入的 JS 执行前先加载、解析完。而嵌入的 JS 会阻塞后面的资源加载，所以就会出现上面 CSS 阻塞下载的情况。

嵌入JS应该放在什么位置？
1. 放在底部，虽然放在底部照样会阻塞所有呈现，但不会阻塞资源下载。
2. 如果嵌入JS放在head中，请把嵌入JS放在CSS头部。
3. 使用 defer（只支持IE）
4. 不要在嵌入的JS中调用运行时间较长的函数，如果一定要用，可以用 setTimeout 来调用

Javascript无阻塞加载具体方式：
1. 将脚本放在底部。`<link>`还是放在head中，用以保证在js加载前，能加载出正常显示的页面。`<script>`标签放在`</body>`前。
2. 阻塞脚本：由于每个`<script>`标签下载时阻塞页面解析过程，所以限制页面的`<script>`总数也可以改善性能。适用于内联脚本和外部脚本。
3. 非阻塞脚本：等页面完成加载后，再加载js代码。也就是，在 window.onload 事件发出后开始下载代码。
4. defer属性：支持IE4和fierfox3.5更高版本浏览器
5. 动态脚本元素：文档对象模型（DOM）允许你使用js动态创建HTML的几乎全部文档内容。代码如下：
```html
<script>
    var script=document.createElement("script");
    script.type="text/javascript";
    script.src="file.js";
    document.getElementsByTagName("head")[0].appendChild(script);
</script>
```
此技术的重点在于：无论在何处启动下载，文件额下载和运行都不会阻塞其他页面处理过程，即使在head里（除了用于下载文件的 http 链接）。

___
<input type = "checkbox"></input>

<h2 > <font color = blue>70.Ajax 是什么？Ajax 的交互模型？同步和异步的区别？如何解决跨域问题？
</font></h2>

Ajax 是什么：
1. 通过异步模式，提升了用户体验
2. 优化了浏览器和服务器之间的传输，减少不必要的数据往返，减少了带宽占用
3. Ajax 在客户端运行，承担了一部分本来由服务器承担的工作，减少了大用户量下的服务器负载。

Ajax 的最大的特点：
1. Ajax可以实现动态不刷新（局部刷新）
2. readyState 属性 状态 有5个可取值： 0 = 未初始化，1 = 启动， 2 = 发送，3 = 接收，4 = 完成

Ajax 同步和异步的区别:
1. 同步：提交请求 -> 等待服务器处理 -> 处理完毕返回，这个期间客户端浏览器不能干任何事
2. 异步：请求通过事件触发 -> 服务器处理（这是浏览器仍然可以作其他事情）-> 处理完毕
ajax.open方法中，第3个参数是设同步或者异步。

Ajax 的缺点：
1. Ajax 不支持浏览器 back 按钮
2. 安全问题 Ajax 暴露了与服务器交互的细节
3. 对搜索引擎的支持比较弱
4. 破坏了程序的异常机制
5. 不容易调试

解决跨域问题：
1. jsonp
2. iframe
3. window.name、window.postMessage
4. 服务器上设置代理页面




___
<input type = "checkbox"></input>

<h2 > <font color = blue>71.js对象的深度克隆代码实现
</font></h2>

```javascript
function clone(Obj) {
    var buf;   
    if (Obj instanceof Array) {
        buf = [];  // 创建一个空的数组
        var i = Obj.length;
        while (i--) {
            buf[i] = clone(Obj[i]);
        }
        return buf;
    } else if (Obj instanceof Object){
        buf = {};  // 创建一个空对象
        for (var k in Obj) {  // 为这个对象添加新的属性
            buf[k] = clone(Obj[k]);
        }
        return buf;
    }else{
        return Obj;
    }
}
```


___
<input type = "checkbox"></input>

<h2 > <font color = blue>74.js数组去重p
</font></h2>

```javascript
//利用filter
[1,1,2,2,3,3,3,3].filter(function(elem, index, self) {
    return index == self.indexOf(elem);
})
```

```javascript
//利用set
var arry =[1,25,15,1,2,15,5,15,25,35,1]
var set =new Set(arry)
console.log([...set])
```


```javascript
//利用hash
Array.prototype.rmRepeat = function(){  
    var res = [],hash={};
    var len=this.length;
    for (var i=0;i<len ;i++) {
        if( !hash.hasOwnProperty('_'+this[i]) )
        {
            hash['_'+this[i]] = 1;
            res.push(this[i]);
        }
    }
    return res;
}

```
```javascript
//利用indexof
  if (typeof array.indexOf !== 'undefined') {
    var arr = [];
    for (var i = 0; i < array.length; i++) {
      if (arr.indexOf(array[i]) === -1) {
        arr.push(array[i]);
      }
    }
    return arr;
  }
```


```javascript
// 利用blueuce
  if (typeof array.blueuce !== 'undefined') {
    return array.blueuce(function(arr, currentValue){
      if (!arr.includes(currentValue)) {
        arr.push(currentValue);
      }
      return arr;
    }, [])
  }

```