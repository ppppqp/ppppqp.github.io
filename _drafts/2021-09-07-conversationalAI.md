---
title:  "Thoughts on Conversational AI"
date:   2021-09-03 21:28:23 +0800
categories: Note ML
---


> Conversational AI上的一些思考，本章持续更新


因为选了Conversational AI的课，为了期末project，学习了一些相关实现和应用（没错，我就是engineer，不是scientist😥 ）

## What is Conversational AI

> The term conversational AI describes a set of technologies that enables devices and apps such as chatbots to converse with people using their natural languages.

简单来说就是通过对话方式实现交互，理解的AI。

## Typical Architecture

{% include figure image_path="/assets/images/ML/conversational-ai-arch.png" alt="this is a placeholder image" caption="Conversational AI Arch" %}


以我目前的了解看来，workflow应该如下：
1. 语音转文字（没什么花头）
2. 文字 embedding（用现有的model，huggingface）
3. NLU（主要工作量，rasa）
4. 数据查询（主要工作量，后端）
   * 网页爬数据自己组建数据库
   * 通过开放API查询
5. 文字生成（不清楚，huggingface？）
6. 文字转语音（没什么花头）
