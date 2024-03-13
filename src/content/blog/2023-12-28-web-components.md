---
title: "Web Components定制博客"
description: 'Lorem ipsum dolor sit amet'
pubDate: 'Jul 08 2022'
heroImage: '/blog-placeholder-3.jpg'
tag: 'Tech'
---


写博客的时候，遇到了一些定制化需求。比如我想在博客顶部加上一个可交互的组件；比如我想给图片加上自定义的注释；比如我想让图片并排排版。这些使用markdown实现都比较困难。

## 前言：Markdown静态网页生成

我的博客的方案是使用`markdown`格式输入内容，通过SSG(Static Site Generation)生成`html`文件。具体来说，在`lib/posts.js`中使用 [remark](https://github.com/remarkjs/remark)将`markdown`字符串转化成对应的`html`字符串，再通过`dangerouslySetInnerHTML`注入到博客中。[rehype](https://github.com/rehypejs/rehype?tab=readme-ov-file#plugins)也有丰富的[插件生态](https://github.com/rehypejs/rehype/blob/HEAD/doc/plugins.md#list-of-plugins)，可以满足绝大多数的需求（比如为图片加注释就可以通过[这个](https://github.com/josestg/rehype-figure)实现）。但仍然有一些问题，比如
- 找到插件后很少能称心如意，还是需要调整样式。
- 对于比较定制化的需求（比如并排图片，或者图片的收起展开），找不到对应的插件
- 更极端一点，插入一个只用一次的高度定制化的组件，比如[WASM101](/posts/2023-11-02-WASM-parser-cn)中顶部的可交互组件，要如何最无痛地实现。

没错，这篇博客重点就是**灵活且无痛**。不用找插件，不用学习markdown parser的逻辑，不用试图在字符串中绞尽脑汁地匹配然后注入，实现**可以复用与组合，高度定制，随意插入的博文组件和排版**。


## 可能的解决方案
### 简单但受限的NextJS原生方案
虽然是Markdown写作转换成html，但最终每一个页面在Nextjs中也是作为一个`Page`组件来实现的(`pages/posts/[id].js`)。所以一个简单的方案就是在这个组件内部加上一个`Custom`组件做对应的路由，匹配博文的标题然后渲染对应的组件。一开始WASM101就是这样实现的。

```js
// components/Custom/index.js
import WasmViz from "./wasmViz";

export default function Custom(props){
  switch (props.id) { 
    case '2023-09-03-WASM-parser': {
      return <WasmViz />
    }
    default: return null;
  }
}
```

```js
// pages/posts/[id].js
export default function Post({postData}){
  //...
  const content = (
      <Layout>
      <Head>
        <title>{postData.title}</title>
        {scripts}
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        // insert custom component between the article title and body
        <Custom id={postData.id}/> 
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  )
  //...
}
```

这样好处是开发体验和实现一个正常的React Component完全相同，但致命缺陷是只能在文章的开头或者结尾插入。

### 一次性组件：DOM节点挂载React
第二个方案是在markdown中插入dom节点挂载React。[rehype-raw](https://github.com/rehypejs/rehype-raw)可以保留markdown中的html元素。比如正常的加粗使用的是单星号`*Bold*`，rehype可以编译为`<em>Bold</em>`。如果使用了`rehype-raw`，我们可以直接在markdown中写`<em>Bold</em>`，效果和使用单星号一致。利用这个特性我们可以在markdown中插入dom节点作为React的挂载点来挂载一次性组件。

```markdown
---
title: "WASM 101 | 二进制格式"
date: "2023-11-02"
author: "Retep"
tag: "Tech"
language: "CN"
noSSR: 0
---

<div id="wasm-viz"></div> %% 挂载React %%

## Meta-Intro

WASM（WebAssembly）是一个虚拟指令集，具备了跨平台可移植性、简单性、出色的性能和安全性，在高性能/分布式计算/嵌入式中都有很大的前景（会取代Docker吗？）。
```

这样我们可以写一个自定义组件，然后选择dom节点挂载。
```js
// components/Custom/wasmViz.js

function WasmViz() {
  // my react component
}

import { render } from "react-dom";
export function load(){
  const domNode = document.getElementById('wasm-viz')
  if(domNode){
    render(<WasmViz />, domNode); // 没错，哥们用的还是React17🤡
  }
}
```

由于博文在Nextjs中都是SSG的，服务端处理不了`document.getElementById`，所以我们把它包裹在一个`load`函数中，在客户端异步渲染。

```js
// pages/posts/[id].js
export default function Post({ postData }) {
  useEffect(() => {
    import('../../components/Custom/wasmViz').then(({load}) => {
      load();
      // console.log(ret);
    });
  }, []);
  //...
}
```

### 可复用组件：Web Components
DOM节点挂载React简单，开发体验也不错，可以实现大部分的需求。但问题是多处挂载React，性能较差。相比高度定制化的一次性组件，对于可复用组件通常我们并不需要用到React的状态管理，只需要像remark一样生成一个局部的样式和dom子树就够了。这个时候主角[Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)出场🎸。Web Components可以允许我们定义自己的`html` tag，配合上`rehype-raw`，就实现了利用浏览器（而不是React）解释自定义组件的效果。

比如我们想实现一个图片加注释的自定义组件。预期的效果是在markdown文件中加入这个标签：

```html
<image-with-caption 
  src="/path/to/image.jpg" 
  caption="New York Too Cold"
>
</image-with-caption>
```
就可以插入一个这样的图片：
<image-with-caption src="/images/2023-12-28-web-components/Snoopy-Puffer.webp" caption="New York Too Cold">
</image-with-caption>


首先我们需要注册`image-with-caption`这个tag。
步骤是：
- 声明一个`ImageWithCaption`的类来实现`HTMLElement`
- 构造函数中初始化
- 读取`src`和`caption`
- 通过`innerHTML`来构造对应的`html`模版，注入对应属性
- 注册`image-with-caption`

```js
export function load() {
  class ImageWithCaption extends HTMLElement {
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
      const src = this.getAttribute("src");
      const caption = this.getAttribute("caption");

      const template = document.createElement("template");
      template.innerHTML = `
      <style>
        .container {
          display: flex;
          flex-direction: column; 
          justify-content: center;
          align-items: center;      
        }
        img {
          width:15rem; 
          margin-left: auto;
          margin-right: auto; 
        }
        .caption {
          font-size: 0.8rem;
          color: #aaa;
        }
      </style>
      <div class="container">
        <img src=${src}></img>
        <div class="caption">${caption}</div>
      </div>
    `;
      this.shadow.append(template.content.cloneNode(true));
    }
  }
  customElements.define("image-with-caption", ImageWithCaption);
}
```

当然，我们也需要在客户端异步加载这个`load`函数，方式与[DOM节点挂载React](/posts/2023-12-28-web-components#一次性组件dom节点挂载react)一致。Web Components的好处有很多
- 首先是性能上由于使用了浏览器的原生能力，比React快很多。
- 其次使用了[shadow dom](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)以后可以将样式局部化，心智负担相比安装plugin再魔改更少。
- 最后，由于Web Components的[`slot`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot)特性，我们可以做多层嵌套，实现自定义组件的自由组合。比如多列排版和图片注释的组件组合起来也非常方便。

```html
<inline-wrapper>
	<image-with-caption 
    src="/path/to/image1" 
    caption="1"
  ></image-with-caption>
	<image-with-caption 
    src="/path/to/image2" 
    caption="2">
  </image-with-caption>
  	<image-with-caption 
    src="/path/to/image3" 
    caption="3">
  </image-with-caption>
</inline-wrapper>
```

<inline-wrapper>
	<image-with-caption src="/images/2023-12-28-web-components/snoopy1.jpeg" caption="1" width="80%"></image-with-caption>
	<image-with-caption src="/images/2023-12-28-web-components/snoopy2.jpeg" caption="2" width="80%"></image-with-caption>
  <image-with-caption src="/images/2023-12-28-web-components/snoopy3.jpeg" caption="3" width="80%"></image-with-caption>
</inline-wrapper>

## 结语
可以探索的topic还有很多，比如可组合性，用了shadow dom后样式的继承问题，用Web Components来写可交互组件，博客的玩出花😈