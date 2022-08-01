---
title:  "聊聊Cookie, 同源策略和Web Security"
date:   2022-4-17 08:29:23 +0800
categories: Note common 
toc: true
mermaid: true
---

## 啥是Cookie 🍪 ?
### HTTP是无状态的

当我们发一个HTTP request给服务端的时候，它是不知道这个request的上下文的（比如之前这个client有过什么行为，除非它存到了数据库里，但这样对服务端的压力是非常大的，因为每个连接都需要做一个记录）。但有些情况下，服务端希望能知道这个客户端之前干过什么事情，比如amazon希望知道这个客户端把哪些东西加入到购物车过。这个时候Cookie就起作用了。Cookie本质是一些键值对，存储了这个客户端的一些信息，会跟着HTTP request一起发送给服务端。

### 争议：第三方Cookie
如果这个网站由第三方内容（比如广告）嵌入，当用户点击广告，浏览器在发送请求的时候会连带着Cookie一起发送，这样广告商就可以跟踪用户信息（比如从哪里跳转过来的等等）。第三方Cookie的好处在于，对于多个网站都可以用同一个Cookie，便于管理。

第三方Cookie因为涉及用户信息，一直都有争议。比如Safari，Edge，火狐都禁止了第三方Cookie。

## 