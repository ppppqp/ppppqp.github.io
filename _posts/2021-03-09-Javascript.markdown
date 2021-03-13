---

title:  "Javascript笔记"
date:   2021-03-09 22:29:23 +0800
categories: Javascript Note Frontend
toc: true
---


# JS
## 1. 数据类型
js的变量数据类型是程序在运行过程中，根据等号右边的值来确定的。
变量的数据类型是可变的。
简单数据类型：`Number`, `Boolean`, `String`, `Undefined`, `Null`
### 1.1 Number
1. 数字的进制：
   
|数字前面加|表示|
|---|---|
|0|八进制|
|0x|十六进制|

``` javascript
var num = 012;
```

1. 数字最大值：`Number.MAX_VALUE`;
2. 非数字`NaN`

`isNaN(x)`: 若x为数字，返回true，否则返回false


### 1.2 String
1. 双引号，单引号都行，嵌套的话交错就可以
2. 检测字符串长度：`str.length`
3. 字符串拼接：
   ```javascript
   const str = "my age is " + 18;//"my age is18"

   var variable = undefined;
   console.log(variable + "18");// "undefined18"
   console.log(variable + 18);//"NaN"

   variable = null;
   console.log(variable + "18");//"null18"
   console.log(variable + 18)//"18"
   ```

### 1.3 获取变量类型
1. `typeof`
   ```javascript
   var num = 18;
   console.log(typeof num);//number

   var str = "string";
   console.log(typeof str);//string

   var flag = true;
   console.log(typeof flag);//boolean

   var vari = undefined;
   console.log(typeof vari);//undefined

   var timer = null;
   consolg.log(typeof timer);//object
   ```


### 1.4 数据类型转换
#### 1.4.1转换成字符串
way|description|example
---|---|---
`toString()`|转换字符串|`var str = num.toString()`
`String()`|强制转换|`String(num)`
`+`|和字符串拼接|`num + ''`

#### 1.4.2转换成数字
way|description|example
---|---|---
`parseInt(string)`|字符串转换成整数（可用于去掉单位）|`parseInt('3.94')//3`
`parseFloat(string)`|字符串转换成浮点数|`parseInt('3.94')//3.94`
`Number()`|强制转换|`Number('12')`
`-,*,/`|和数字计算|`'12'-0`, `'123'-'120'`

#### 1.4.3转换boolean
可以通过`Boolean()`转换，其中：
* `''`
* `0`
* `NaN`
* `null`
* `undefined`
  为`false`，其余为`true`
```javascript

```



## 2. 数组
## 2.1 数组创建
1. 利用new
   ```javascript
   var arr = new Array();
   ```

2. 利用数组字面量
    ```javascript
    var arr = [];
    var arr = [12, "13", false]
    ``` 

 ## 2.2 遍历数组
 ```javascript
 for(let i = 0; i < arr.length; i++){
   console.log(arr[i]);
 }
 ```

 ## 2.3 数组新增元素

1. 修改length长度
   ```javascript
  arr.length = 5;//多出来的值是undefined
   ```

2. 索引
   ```javascript
  console.log(arr.length)//3
  arr[3] = 3;//直接给没有值的索引号加上值，类似map
   ```



## 3. 函数
### 3.1 函数声明
1. 命名函数
```javascript
function fun(){

}
```
2. 匿名函数
```javascript
var fun = function(){

}
fun()
```

### 3.2 函数形式参数和实参不匹配
```javascript
function getSum(num1,num2){
  return num1+num2;
}
getSum(1,2,3);//3
getSum(1);//NaN(1+undefined)
```

### 3.3 使用arguments获取实参
arguments是一个伪数组，内置在所有函数中
* 有length属性
* 索引获取
* 没有数组的一些方法入push
  
```javascript
getSum(1,2,3);
getSum(){
  console.log(arguments);//[1,2,3]
}
```


### 3.4 作用域
#### 3.1 作用域
1. 全局作用域
   一个js文件或者script标签中
2. 局部作用域
   某个函数中
3. 块级作用域：if, for等等的作用域(let)


#### 3.2 变量
```javascript
function fn(aru){//aru是局部变量
  var num1 = 10//局部变量，函数外不能使用
  num2 = 20;//全局变量
}
```

全局变量只有在浏览器关闭才会销毁，占内存资源

#### 3.3作用域链
```javascript
var num = 10;//0级链
function fun(){
  var num = 20;//1级链
  function fun2(){
    //2级链
    console.log(num);//20
    //链式查找，从上一级作用域看是哪个scope里的，遇到的第一个就是
  }
}
```

### 3.5预解析
```javascript
//先使用，在声明
console.log(num);//undefined
var num = 10;

fn()//a
function fn(){
  console.log('a');
}

fun()//fun is not a function
var fun = function(){
  console.log('a')
}

```
预解析：
1. 所有声明变量和函数提升到作用域的最前面
2. 代码执行，从上往下

变量预解析（变量提升）：把所有有变量声明提升到作用域最前面，不提升声明
函数预解析（函数提升）：把所有函数声明提升到作用域最前面，不调用函数



## 4. 对象
### 4.1 创建对象的三种方式
#### 4.1.1 字面量
对象字面量：
```javascript
var obj = {
  name : "name",
  age : 18,
  sex: "male",
  sayHi: function(){
    console.log("hi");
  }
}
obj.name;
obj["age"];
```

#### 4.1.2 new Object
```javascript
var obj = new Object();
obj.name = "name";//加一个name属性
```


#### 4.1.3 构造函数

1. 构造函数首字母大写
2. 不用return
3. 用new
```javascript
function Obj(name, age){
  this.name = name;
  this.age = age;
  this.sayHi = function(){
    console.log("hi");
  }
}
var a = new Obj("name",18);
console.log(typeof ldh);//obj
```


new关键字的执行过程
1. 在内存中创建一个空对象
2. this指向刚才创建的空对象
3. 执行构造函数的代码，给空对象添加属性和方法
4. 返回这个新对象


### 4.2 遍历对象

for...in

``` javascript
for(let k in obj){//变量用k/key
  console.log(k); //"name", "age", "sex"
  console.log(obj[k]);//"pink", 18, "male"
}
```

### 4.3 JS内置对象
#### 4.3.1 Math 数学对象
不是构造函数
|method|description|eg
|---|---|---|
`Math.PI`|圆周率
`Math.max()`|求最大值|`Math.max(1,2,3)`
`Math.abs()`|绝对值|`Math.abs(-1)`/`Math.abs("-1")`
`Math.floor()`|向上取整|
`Math.ceil()`|向下取整|
`Math.round()`|四舍五入|其他数字四舍五入，.5当作ceil
`Math.random()`|返回一个随机的小数$\in$[0,1)|



### 4.3.2 日期对象
是构造函数
```javascript
var today = new Date()//无参数，返回当前时间
var date1 = new Date(2019,10,01);//11月！
var date2 = new Date("2019-10-1 8:12:45");

```

|method|description|eg
|---|---|---|
`date.getFullYear()`|年份|
`date.getMonth()`|月份（记得差1）
`date.getDate()`|日期|
`date.getDay()`|星期|
`date.getHours`|小时|
`valueOf()`|得到timestamp（距离1970-1-1的毫秒数）
`getTime()`|同上



### 4.3.3 数组对象

```javascript
var arr1 = new Array(3);//长度为2
var arr2 = new Array(2,3);//内容为[2,3]
```


检测是否为数组：
```javascript
console.log(arr instanceof Array)
Array.isArrary(arr)
```
|method|description|eg
|---|---|---|
`Array.isArray`|是否是数组| `Array.isArrary([1,2,3])`
`push`|在数组末尾添加一个或多个数组元素,返回新数组的长度|`arr.push(4,5,"pink");`
`unshift`|在数组开头添加一个或多个元素，返回行数组的长度|`arr.unshift(4,5,"pink");`
`pop`|在数组末尾删除一个数组元素，返回pop的元素|`arr.pop();`
`shift`|在数组开头删除一个数组元素，返回shift的元素|`arr.shift();`
`reverse`|翻转数组|`arr.reverse()`
`sort`|排序|`arr.sort(compareFun())`
`indexOf()`|返回元素索引，若不存在返回-1|`arr.indexOf(1)`
`lastIndexOf()`|同上
`toString`｜转换成字符串|`arr.toString`
`join`|可以加分隔符|`arr.join(',')`
`splice()`|


### 4.3.4字符串对象
字符串的不可变：

```javascript
var str = "andy";
str = "red"//这里andy还是存在的，red重新开辟了一个空间，str指向这个空间

```


|method|description|eg
|---|---|---|
`Array.isArray`|是否是数组| `Array.isArrary([1,2,3])`
`indexOf()`|返回元素索引，若不存在返回-1|`arr.indexOf(1,2)`从索引2开始往后查找
`lastIndexOf()`|同上
`charCodeAt(index)`｜索引位置上的字符的ascii|`arr.toString
`substr(pos, count)`|截取起始位置(index)，取几个、
`replace()`|把某几个字符替换成(只替换提一个)|`console.log(str.replace('a','b'))`
`split(separater)`|把字符转换为数组|`str.split(',')`



### 4.4. 内存分配&参数传递
简单数据类型:string, number, boolean, undefined, null
复杂数据类型: Object, Array, Date


| |简单数据类型|复杂数据类型
---|---|---
储存区域|栈|数据在堆，地址在栈
参数传递|pass by value|pass by reference



## 5.WebAPI


### 5.1 DOM
文档对象模型，处理HTML的编程接口。

#### 5.1.1 获取元素
|method|description|eg
|---  | -- | ---|
`getElementById(id)`|通过id(string)获取,返回该元素,找不到返回`null`| 
`getElementsByTagName(name)`|通过tagname获取，返回所有的满足的对象的数组|调用的object就是父元素
`getElementsByClassName(className)`|通过classname(string)获取,返回所有的满足的对象的数组|
`querySelector(selector)`|通过selector获取，返回指定选择器的第一个元素对象|`document.querySelector(".box")`
`querySelectorAll(selector)`|通过selector获取，返回指定选择器的所有元素对象|

```javascript
document.body;//body对象
document.documentElement;//html对象
```


#### 5.1.2 事件
事件三要素：事件源（按钮），事件类型（点击），事件处理程序
```javascript
var btn = document.getElementbyId('btn');
btn.onclick = function(){
  alert("aha!");
}
```
注册事件：
##### 1. 传统方式
特点： 唯一性，对同一个元素只能有同一个处理程序
```javascript
btn.onclick();
btn.onclick() = null;//解绑
```
##### 2. 方法监听注册方式
可以添加多个处理程序
```javascript
//addEventListener(type, lisenter[, useCapture]);
//type: mouseover, click...
btn.addEventListener("click",function(){

})
function fn(){}
btn.removeEventListenr("click", fn)//不能是匿名函数
//多个处理程序，每个都会执行

```
##### 3. DOM事件流：
 ![]({{site.url}}/images/030902/event.jpg)
onclick等等只能得到冒泡阶段。
第三个参数为true，为捕获阶段,从document从上往下开始查看是否有监听函数
第三个参数是flase或省略，是冒泡阶段
```javascript
//son.addEventListener("click", function(){}, true);
```






#### 5.1.3 改变元素内容/属性

改变元素内容
```javascript
div.innerText = "button"//<div> button </div>，不识别html标签
div.innerHTML = "<strong> button </strong>"//保留空格，识别html标签
/*type, value, checked, selectd, dsiabled*/
btn.onclick = function(){
  this.disabled = true;
  input.value = "clicked";//改变表单的文本
}
```

获得样式/属性

```javascript
/*style, class*///样式属性——————————————
div.style.backgroundColor = "pruple";
div.style.width = "50px";//行内样式，权重高
div.className = "change";//类名改为change

```

事件类型

```javascript
text.onfocus = function(){
  //输入框获得焦点
}

text.onblur = funciton(){
  //失去焦点
}

div.onmouseover = function(){
  //鼠标经过
}

div.onmouseout = function(){
  //鼠标离开
}
```

获取自定义属性
规范： 自定义属性以data-开头
``` javascript
div.setAttribute("data-index")
div.getAttribute("data-index")
//H5新增
//dataset是一个集合，存放了所有以data开头的自定义属性
//div.dataset.index
```


#### 5.1.4节点操作
获取元素：
1. 可以用selector
2. 可以用节点层级关系


节点一般有基本属性
1. nodeType
   1. 元素节点：1
   2. 属性节点：2
   3. 文本节点：3
2. nodeName
3. nodeValue

##### 1. 父级节点：
```javascript
//得到离元素最近的父级节点
parent = div.parentNode;
```
##### 2. 子节点：
```javascript
//得到div所有的子节点
child = div.childNodes;
//需要筛选文本类型(1是元素节点)
child.filter((d)=>d.nodeType == 1)


//更简单的方法，得到子元素节点,不用筛选
child = div.children;


//获取第一个子节点
firstChild = div.firstChild;
//获取最后一个子节点
lastChild = div.lastChild


//更简单的方法,获得第一个子元素节点
firstChild= div.firstElementChild;
lastChild= div.lastElementChild;
//或者
firstChild = div.children[0];
```


##### 3. 兄弟节点
```javascript
//下一个兄弟节点
nextSibling = div.nextSibling;
prevSibling = div.previousSibling;

//下一个兄弟元素节点
nextSibling = div.nextElementSibling;
```

##### 4. 创建节点/添加节点

```javascript
document.write("<div>123</div>");//如果页面文档流加载完毕，会导致页面全部重绘
```

```javascript
div.innerHTML = "<div>123</div>";
```

```javascript
//创建元素
var child = createElement('li');
//添加元素
node.appendChild(child);
node.insertBefore(child, node.children[0]);
```


##### 5. 删除节点
```javascript
node.removeChild(child)
```

##### 6. 复制节点
```javascript
node.cloneNode()//只复制标签，不复制里面内容
node.cloneNode(true)//完全一样
```



###5.2 BOM
BOM（浏览器对象模型），提供了独立于内容而与浏览器交互的对象。
1. 是访问浏览器窗口的一个接口
2. 是全局对象，任何一个全局变量都会变成`window`的一个属性
3. 
```javascript
window.document;
alert(1);
window.alert(1)
```

#### 5.2.1 窗口加载事件

等浏览器内容全部加载完毕，执行...
```javascript
window.onload = function(){

}
//或者
window.addEventListener('load', function(){


//
document.addEventListener('DOMContentLoaded', function(){

})
//可以等标签加载完就触发不用等图片下载
})
```


#### 5.2.2窗口大小事件
调整窗口大小触发，可以用来完成响应式布局。
与media query等相对应
window.innerWidth: 屏幕尺寸

```javascript
window.addEventListener('resize', function(){
if(window.innerWidth < 800){

}
})

```


#### 5.2.3定时器
setTimeout(),单位毫秒，可以省略默认0
```javascript
//set timeout
var timer2 = setTimeout(callback(){}, 2000)
window.clearTimeout(timer2);//清除timer2
```

setInterval()
```javascript

//set interval： 每间隔一段时间使用这个函数
var timer1 = setInterval(callback(){},2000);
clearInterval(timer1)

//倒计时函数(模拟手机验证码)
var time = 10;
var timer = btn.addEventListener('click', function(){
  if(time == 0){
    clearInterval(timer);
    btn.disabled = false;
    btn.innerHTML = '发送';
  }
  else{
    btn.innerHTML = "还剩下" + timer + "s";
    time--;
  }
}
```

#### 5.2.4 this 指向问题
一般情况下this指向调用它的对象
1. 全局作用域或者普通函数中this指向全局对象window(setTimeout->window)
2. 方法调用中谁调用this指向谁(onclick->btn)
3. 构造函数总this指向构造函数的实例


### 5.3 URL
URL:统一资源定位符
组成：
|组成|说明
|---|---|
protocol|通讯协议（http，ftp）
host|主机（域名）（baidu.com）
port|端口号（：）
path|路径（html文件路径）
query|参数（键值对，用&分割）
fragment|片段（#）

### 5.4 Location对象

包含了网站信息

|location属性|说明
|---|---|
`location.href`|url
`location.host`|主机（域名）
`location.port`|端口号（：）
`location.pathname`|路径（html文件路径）
`location.search`|参数（键值对）
`location.hash`|片段（#）
`location.assign()`|前往url(记录历史)
`location.replace()`|前往url（不记录历史，不能回退）
`location.reload`|刷新
```javascript
//实现页面跳转
btn.addEventListener('click', function(){
  location.href = "http://wwwitcast.cn";
})
//实现页面数据传递(参数)
var params = location.search.substr(1);//去除？符号 "name=ANDY"
var arr = params.split('=');//["name", "ANDY"]
div.innerHTML = arr[1];


```
### 5.5 navigator对象
包含了浏览器信息

|navigator属性|说明
|---|---|
`navigator.userAgent`|浏览器的类型（手机/）

### 5.6 history对象
与历史记录交互

|location属性|说明
|---|---|
`history.back()`|后退
`history.forward()`|前进
`go()`|go(1)前进一步，go（-1）后退一步
`location.pathname`|路径（html文件路径）
`location.search`|参数（键值对）
`location.hash`|片段（#）
`location.assign()`|前往url(记录历史)
`location.replace()`|前往url（不记录历史，不能回退）
`location.reload`|刷新
### 6. js执行机制
Web workder标准，允许js创建多个任务
同步： 上一个项目指向完执行下一个任务，与代码顺序一致
异步：在做一件事的时候做另一件事，

同步任务：放入主线程，进入执行栈
异步任务：（所有的回调函数）放入任务队列
1. 先执行执行执行栈中的同步任务
2. 把回调函数触发的异步任务放入任务队列
3. 同步任务完成，轮询任务队列找异步任务，放入执行栈中


#### 6.1 事件对象
![]({{site.url}}/images/030902/eventloop.png)


#### 6.2 异步
用load模块去加载图片，**等到主任务全部执行完毕**并且图片加载完成之后要么执行resolve，要么执行reject
1. 使用回调函数处理异步操作（onload, onerror）
```javascript
function loadImage(src, resolve, reject){
  let image = new Image();
  iamge.src = src;
  image.onload = resolve(image);//图片执行成功
  image.onerror = reject(image);//图片执行失败
}
loadImage("images/a.jpg", (image)=>{
  console.log("图片加载完成");
  document.body.appendChild(image);//添加图片
},()=>{
  console.log("加载失败");
})
```

2. 通过定时器执行异步操作
```javascript
function interval(callback, delay = 100){
  let id = setInterval = (()=>callback(id)k, delay);
  interval((timeId)=>{
    const div = document.querySeelctor('div');
    let left = parseInt(window.getComputedStyle(div).left);
    div.style.left = left+10+"px";
    if(left >=200) clearInterval(timeId);
  })
}
```

3. 调整任务顺序防止文件依赖问题
先加载的文件依赖后加载的文件，则会出错。
```javascript
load("file1.js", ()=>{
  load("file2.js", ()=>{

  })
})
```
然而完成这样的功能需要大量的嵌套关系。


4. 通过promise


宏任务和微任务：
任务队列：宏任务
promise队列：微任务队列（优先）


* 准备阶段(pending)
* 成功状态(resolved)
* 拒绝状态(rejected)
```javascript
new Promise((resolve, reject)=>{
  resolve();
  reject();
  console.log("task stack");
  //这部分属于主任务，优先级最高
}).then(
  value=>{
    //成功的处理1
    //在微任务队列
  }
  reason=>{
    //拒绝的处理1
  }
)
.then(
  value=>{
    //成功的处理2
  }
  reason=>{
    //拒绝的处理2
  }
)
```


```javascript
let promise = new Promise(resolve =>{
  setTimeout(()=>{
    resolve();//宏任务里的微任务，还是等宏任务先执行再执行
  })
})
```

5. promise状态传递
   如果将promise对象作为参数传递给下一个promise对象的resolve或者reject，则下一个promise对象的状态和传给他的promise对象的状态一致


6. promise.then基本语法
```javascript
promise((resolve,reject)=>{
  resolve();//表示promise成功
}).then(//对上一个状态改变的处理
  ()=>{return 1},//成功的处理
  ()=>{},//失败的处理
  //返回也是一个promise 默认是成功
).then(value=>console.log(value))//对上一个promise的处理, 输出1



.then(()=>{}, ()={}).then
相当与
.then(()=>{
  return Promise()//promise1
})
.then()//对promise1的处理
```

7. promise封装ajax
```javascript
funciton ajax(url){
  return new Promise((resolve, reject)=>{
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();
    xhr.onload = function(){
      if(this.status == 200){
        resolve(JSON.parse(this.response));
      }
      else{
        reject("加载失败");
      }
    }
    xhr.onerror = function(){
      reject("加载失败");
    }
  })
}
```


8. catch
```javascript
new Promise((resolve, reject)=>{
  
}).then(
  value=>console.log(value),
  reason=>console.log(reason.message)//如果有reject处理，就用这个处理
)
.catch(error=>{

})//如果有then没有错误的捕获处理，则使用catch统一对前面的所有promise错误进行处理，
``` 

9. async/await语法糖
在函数前面加上一个`async`，可以返回一个promise对象
`await` 相当于 then
```javascript
async function hd(){
  let name = await do();//暂停代码在该行上，直到返回promise对象
  let person = await doSomething(name);//相当于第二个then，基于第一个then的返回
}
hd.then();

```


### Ajax
步骤： 
1. 创建异步对象
   ```js
   var xmlhttp = new XMLHttpRequest();
   ```
2. 设置请求方式/地址
   ```js
   //(method, url, async(是否异步))
   xmlhttp .open("GET", "url.php", true)
   ```
3. 发送请求
   ```js
   xmlhttp.send();
   ```
4. 监听状态变化
   状态：
    * 0: 请求未初始化
    * 1: 服务器连接已经建立
    * 2: 请求已经接受
    * 3: 请求处理中
    * 4: 请求完成
   ```js
   xmlhttp.onreadystatechange = function (ev){
     if(xml.readyState===4){
      if(xmlhttp.status >=200 && xmlhttp.status <300||xmlhttp.status === 304){
      //http状态码200-300 or 304，响应成功
      alert(xmlhttp.responseText);//得到php的数据 
      }
     }
   }
   ```
5. 处理返回结果(回调函数⬆️)
创建异步对象

