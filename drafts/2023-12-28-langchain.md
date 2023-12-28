

🌰LangChain In a NutShell
LangChain的背景，基本概念
What is LangChain?
LangChain是一个的框架，旨在帮助开发人员使用语言模型构建端到端的应用程序。它提供了一套工具、组件和接口，可简化创建由LLM 和聊天模型提供支持的应用程序的过程。LangChain 可以轻松管理与语言模型的交互，将多个组件链接(chain)在一起，并集成额外的资源，例如 API 和数据库。
官网：
https://www.langchain.com/
GitHub:
https://github.com/langchain-ai/langchain
已经有了ChatGPT，为什么要开发LangChain?
换句话说，有什么任务是ChatGPT做不了但是LangChain能做的？
数据
我们想通过LLM得到关于我们自己数据的一些洞察，但数据量很大，超过了max input token的限制或者上下文记忆的限制，无法直接喂给LLM。如果我们希望使用LLM的能力则需要对文本进行预处理和存储，比如文本分段，数据库存储等等。LangChain提供了这一系列能力。
与客观世界交互
假设我们想实现一个天气主播chatbot，可以通过对话获知关于当天天气的信息。通过ChatGPT是实现不了的，因为
1. ChatGPT的训练数据是陈旧的，其中不包含最新的天气信息
2. ChatGPT无法通过访问网站的方式获取最新的天气信息。
LangChain为LLM赋能去实现一些外部任务，比如运行代码或者访问网站，以此来构建有这些需求的chatbot。
抽象
在开发时会遇到的问题是每个LLM host的API参数都不一致，往往切换一个模型就需要重新开发一遍接口。LangChain通过抽象成类实现了各个LLM的实现之间的切换（类似huggingface中切换不同模型，只需要无痛plug&play）

Concepts
Langchain是如何设计抽象的？
LLM：大语言模型
LangChain中将LLM抽象成一个类，来适配各种各样的LLM实现(OpenAI ChatGPT, Google PaLM, etc). 可以在LangChain中直接用最朴素的方式与LLM对话，过程就和让一个LM autoregressive地生成next token prediction一样。
import { OpenAI } from "langchain/llms/openai";

const llm = new OpenAI({
  temperature: 0.9,
});

const result = await llm.predict("What would be a good company name for a company that makes colorful socks?");
// "Feetful of Fun"
🧩Schema
LangChain中对Message的抽象，定义了三种Message
- 👶 HumanMessage：人类的input
- 🖲️ SystemMessage：作为LLM的instruction的input
- 🤖 AIMessage：LLM的output
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, ChatMessage, SystemMessage } from "langchain/schema";
const chat = new ChatOpenAI({
  temperature: 0
});
const result = await chat.predictMessages([
  new SystemMessage("You are a helpful assistant that translates English to French."),
  new HumanMessage("Translate this sentence from English to French. I love programming.")
]);

/*
  AIMessage {
    content: "J'adore la programmation."
  }
*/
 predict(m) 等价于 predictMessages([HumanMessage(m)])

🕸️Prompt Templates
将用户的input嵌入一个固定的prompt模版中形成prompt，继而传递给语言模型。Prompt Template 有助于将用户输入和其他动态信息转换为适合语言模型的格式。
What does it remind you of? Yes, 'template ${literal}' !
import { PromptTemplate } from "langchain/prompts";

const prompt = PromptTemplate.fromTemplate("What is a good name for a company that makes {product}?");

const formattedPrompt = await prompt.format({
  product: "colorful socks"
});
⛓️Chain
Chain就是两个动作的集合，即将input先传入PromptTemplate，然后再传入LLM，得到输出。
// Chain = LLM(Prompt Templates(user input))

import { OpenAI } from "langchain/llms/openai";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";

const llm = new OpenAI({});
const prompt = PromptTemplate.fromTemplate("What is a good name for a company that makes {product}?");

const chain = new LLMChain({
  llm,
  prompt
});

// Run is a convenience method for chains with prompts that require one input and one output.
const result = await chain.run("colorful socks");
多个子Chain可以被链接成一个大Chain (通过SimpleSequentialChain 这个类）。Chain帮助我们将一些小的组件组合起来完成更复杂的功能。
有点像Unix中的pipeline
This content is only supported in a Feishu Docs
Output Parsers
Output Parsers 负责将语言模型响应构建为更有用的格式。它们实现了两种主要方法：一种用于提供格式化指令，另一种用于将语言模型的响应解析为结构化格式。这使得在您的应用程序中处理输出数据变得更加容易。

🐱Embeddings & Vector Stores
Embeddings指文本在向量空间的投影。LangChain对embedding也做了抽象，所以可以自由地使用不同的embedding实现。
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

/* Create instance */
const embeddings = new OpenAIEmbeddings();

/* Embed queries */
const res = await embeddings.embedQuery("Hello world");
/*
[
   -0.004845875,   0.004899438,  -0.016358767,  -0.024475135, -0.017341806,
    0.012571548,  -0.019156644,   0.009036391,  -0.010227379, -0.026945334,
    0.022861943,   0.010321903,  -0.023479493, -0.0066544134,  0.007977734,
   0.0026371893,   0.025206111,  -0.012048521,   0.012943339,  0.013094575,
   -0.010580265,  -0.003509951,   0.004070787,   0.008639394, -0.020631202,
  -0.0019203906,   0.012161949,  -0.019194454,   0.030373365, -0.031028723,
   0.0036170771,  -0.007813894, -0.0060778237,  -0.017820721, 0.0048647798,
   -0.015640393,   0.001373733,  -0.015552171,   0.019534737, -0.016169721,
    0.007316074,   0.008273906,   0.011418369,   -0.01390117, -0.033347685,
    0.011248227,  0.0042503807,  -0.012792102, -0.0014595914,  0.028356876,
    0.025407761, 0.00076445413,  -0.016308354,   0.017455231, -0.016396577,
    0.008557475,   -0.03312083,   0.031104341,   0.032389853,  -0.02132437,
    0.003324056,  0.0055610985, -0.0078012915,   0.006090427, 0.0062038545,
      0.0169133,  0.0036391325,  0.0076815626,  -0.018841568,  0.026037913,
    0.024550753,  0.0055264398, -0.0015824712, -0.0047765584,  0.018425668,
   0.0030656934, -0.0113742575, -0.0020322427,   0.005069579, 0.0022701253,
    0.036095154,  -0.027449455,  -0.008475555,   0.015388331,  0.018917186,
   0.0018999106,  -0.003349262,   0.020895867,  -0.014480911, -0.025042271,
    0.012546342,   0.013850759,  0.0069253794,   0.008588983, -0.015199285,
  -0.0029585673,  -0.008759124,   0.016749462,   0.004111747,  -0.04804285,
  ... 1436 more items
]
*/
使用Embedding的好处是，可以自由地进行向量的数值操作，比如存储和通过相似度查询。一个常见的pipeline是
This content is only supported in a Feishu Docs
LangChain提供的存储方式
  - In Memory：存在内存中
  - AnalyticDB
  - Chroma
  - Elasticsearch
  - ...
相似度查询的metric
  - Cosine
  - Intersection
  - Motyka
  - ...

🧠Memory
对于一个对话式AI(conversational AI)来说不可缺少的部分，但例如OpenAI的API是无状态的，所以记忆上下文能力成为一个通用的需求。LangChain提供了以下抽象：
[Image]
ChatMessageHistory
一个底层的类，可以看到就是记录了一系列用户和LLM的chatMessage
LangChain 主要通过聊天界面与语言模型进行交互。ChatMessageHistory 类负责记住所有以前的聊天交互数据，然后可以将这些交互数据传递回模型、汇总或以其他方式组合。这有助于维护上下文并提高模型对对话的理解。
import { ChatMessageHistory } from "langchain/memory";

const history = new ChatMessageHistory();
await history.addUserMessage("Hi!");
await history.addAIChatMessage("What's up?");
const messages = await history.getMessages();
console.log(messages);

/*
  [
    HumanMessage {
      content: 'Hi!',
    },
    AIMessage {
      content: "What's up?",
    }
  ]
*/
BufferMemory
一个基础的类，在ChatMessageHistory上构建，用来为Chain实现记忆功能。
import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

const model = new OpenAI({});
const memory = new BufferMemory(); 
// This chain is preconfigured with a default prompt
const chain = new ConversationChain({ llm: model, memory: memory });
//在chain中使用BufferMemory
const res1 = await chain.call({ input: "Hi! I'm Jim." });
console.log({ res1 }); // {response: " Hi Jim! It's nice to meet you. My name is AI. What would you like to talk about?"}
const res2 = await chain.call({ input: "What's my name?" });
console.log({ res2 }); // {response: ' You said your name is Jim. Is there anything else you would like to talk about?'}
// 可见LLM记住了之前的对话内容
除此之外，LangChain还实现了很多别的Memory类型
- BufferWindowMemory等等（见上图）: 只保存最近的k个interactions
- ConversationSummaryMemory （见上图）: 在对话的过程中逐步创建一个对话的summary。可以应用于长对话，来保证关于对话的记忆不会占用太多的token。
👶: Hi! I'm Jim.
🤖: ...
👶: What's my name?
🤖: ...

memory: {
    chat_history: 'Jim introduces himself to the AI and the AI greets him and offers assistance. The AI addresses Jim by name and asks how it can assist him.'
}
- EntityMemory：保存关于实体(entity)的记忆。
比如如下对话：
👶: Hi! I'm Jim.
🤖: ...
👶: I work in sales. What about you?
🤖: ...
👶: My office is the Utica branch of Dunder Mifflin. What about you?
🤖: ...
memory:{
    entities: {
        Jim: 'Jim is a human named Jim who works in sales.',
        Utica: 'Utica is the location of the branch of Dunder Mifflin where Jim works',
        'Dunder Mifflin': Dunder Mifflin has a branch in Utica
    }
}
- VectorStoreRetrieverMemory： 将memory存在VectorDB中，并在调用的时候query前K个最有关的对话。
🛠️Tools
LLM用来与现实世界交互的工具。比如chatGPT plugin, AWS Lambda,  Web browser, Bing, Youtube, Gmail等等。这些都可以统一通过Tool的抽象来在LangChain中被使用。
interface Tool {
  call(arg: string): Promise<string>;
  name: string;
  description: string;
}
🕵️‍♀️Agent
Agent 是在 LangChain 中推动决策制定的实体。他可以根据用户输入决定调用哪个工具来完成特定任务和一系列LLM的调用。简单来说，Agent可以理解为“借助工具完成特定任务的LLM应用”，比如Creative Assistant就可以看作一个Agent：它通过与用户进行对话生成指令来搜索素材库或者生成脚本，以此满足需求。Agent是LangChain热度比较高的feature。当然也有别的Agent API，比如AgentGPT: Autonomous AI in your browser 🤖，但LangChain的优势在于强大的工具能力和抽象。
Agent Types | 🦜️🔗 Langchain

---
Landscape
LangChain也在积极地做一些生态建设
[Image]
LangChain Expression Language
The quickest way to prototype the brains of your LLM application
https://blog.langchain.dev/langchain-expression-language/
Hightlight
低代码
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

model = ChatOpenAI()
prompt = ChatPromptTemplate.from_template("tell me a joke about {foo}")
chain = prompt | model

chain.invoke({"foo": "bears"})
>>> AIMessage(content="Why don't bears ever wear shoes?\n\nBecause they have bear feet!", additional_kwargs={}, example=False)
[Image]
Templates
LangChain Templates offers a collection of easily deployable reference architectures that anyone can use
https://blog.langchain.dev/langchain-templates/
[Image]
LangServe
https://blog.langchain.dev/introducing-langserve/
a hosted version of LangServe for one-click deployments of LangChain applications.
[Image]
highlight
- significantly easier to go from prototype to production and get a production ready API
How does it work
integrated with FastAPI and uses pydantic for data validation.
1. create our chain
"""A conversational retrieval chain."""

from langchain.chains import ConversationalRetrievalChain
from langchain.chat_models import ChatOpenAI
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS

vectorstore = FAISS.from_texts(
    ["cats like fish", "dogs like sticks"],
    embedding=OpenAIEmbeddings()
)
retriever = vectorstore.as_retriever()

model = ChatOpenAI()

chain = ConversationalRetrievalChain.from_llm(model, retriever)
2. pass that chain to add_routes
#!/usr/bin/env python
"""A server for the chain above."""

from fastapi import FastAPI
from langserve import add_routes

from my_package.chain import chain

app = FastAPI(title="Retrieval App")

add_routes(app, chain)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8000)
That's it, this gets you a scalable web server

[Image]
- Built-in (optional) tracing to LangSmith, just add your API key as an environment variable
- Support for hosting multiple chains in the same server under separate paths
- All built with battle-tested open-source Python libraries like FastAPI, Pydantic, uvloop and asyncio.
LangSmith
How to build production level LLM app? 如何证明/评估llm应用是否已经达到production level？
https://www.langchain.com/langsmith
LangSmith是一个all in one的llm app调试-部署-评估平台（at beta stage）。和MLflow - A platform for the machine learning lifecycle很类似。
Tracing：可以以日志的形式记录llm的每一次互动，总结应用的使用情况，记录llm和工具的调用。还可以在playground里调试prompt并实时查看效果。对于agent，LangChain有很多隐式的llm调用，通过tracing可以看到其中的所有调用。
[Image]

[Image]

Evaluation: llm中有很多难题，比如输出的不确定性，安全（prompt injection），响应延迟等等。LangSmith提供了一个统一的评估方案。
创建数据集：一个输入字符串数组，每个元素作为对llm的一个test case
评估方式(evaluator): LangSmith中提供了多种evaluator
- QA evaluator：最常见的，基于问答准确性的评估
- Criteria evaluator: 比较有创新性的，基于准则的评估。可以选择的准则有：creativity（是否有创新性），conciseness（是否精练），relevance（是否相关），coherence（是否一致）等等，也可以自定义一个criteria。本质上也是基于prompt的 "Is this response imaginative? Response Y if they are, N if they are not"
[Image]
[Image]


🖐️Get Hands Dirty: Building Your Own LLM App
构建一个简单的LangChain应用，探索各种能力
LangChain的使用
Installation
以langchian.js为例，我们来创建一个简单的LLM 应用。
创建一个新的node.js项目，（node.js > 18)
mkdir langchainTest
cd langchainTest
npm init es6 -y
安装langchian
npm install langchain
Basic：LangChain基础能力
使用LangChain的抽象类，可以隐藏调用OpenAI API的复杂度
import { OpenAI } from "langchain/llms/openai";
import "dotenv/config";

const llm = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.9, // Temperature is a parameter of OpenAI ChatGPT, GPT-3 and GPT-4 models that governs the randomness and thus the creativity of the responses. It is always a number between 0 and 1
});

const result = await llm.predict(
  "What would be a good company name for a company that makes colorful socks?"
);
console.log(result);
// Happy Sockery.
通过template定制和管理prompt
import { PromptTemplate } from "langchain/prompts";
import "dotenv/config";

const prompt = PromptTemplate.fromTemplate(
  "What is a good name for a company that makes {product}?"
);

const formattedPrompt = await prompt.format({
  product: "colorful socks",
});

console.log(formattedPrompt);
// What is a good name for a company that makes colorful socks?
LLM Chain：将llm和prompt template结合在一起 
似曾相识的主题 - ref: 语言模型与Prompt技巧 
import 'dotenv/config';
import { OpenAI } from 'langchain/llms/openai';
import { LLMChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';

const llm = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  maxTokens: 3072,
});

const prompt = PromptTemplate.fromTemplate(
  `
  你是Tiktok爆款视频广告脚本写作专家, 请你用一下步骤进行创作, 产出一段拍摄脚本

  在写作Tiktok拍摄脚本方面, 你会以下技能
    1 .开头引入hook吸引观众观看
    2. 在脚本中间部分将卖点融入拍摄主体
    3. 场景中的主要行为(如羽毛球场上主要行为为打羽毛球)需要与产品产生互动
    4. 脚本结尾采用互动式语言与观众建立纽带

  输入规则: 我会按下述格式给予你信息
  拍摄主题:
  拍摄场景:
  拍摄主角:
  产品:
  主要卖点:

  输出规则: 结合我给你输入的信息, 给与你的实例, 以及你掌握的编写技巧, 产出内容, 请严格按照一下格式输出内容, 只需要格式描述的内容, 如果产出其他内容则不输出
  |场景|时长|内容|

  拍摄主题: {title}
  拍摄场景: {scene}
  拍摄主角: {actor}
  产品: {product}
  主要卖点: {feature}
  `
);
const chain = new LLMChain({
  llm,
  prompt,
});

const result = await chain.call({
  title: '打羽毛球需要什么',
  scene: '羽毛球场',
  actor: '王小羽',
  product: '美的xxx洗衣机',
  feature:
    '拥有速溶预混功能, 假的洗衣液会提前在预混仓充分搅拌, 混合成3倍浓度的精华液, 具有很强的清洁力',
});
console.log(result);
{
  text: '\n' +
    '  |场景1|10s|画面推出，王小羽在羽毛球场上面说：“每次打羽毛球，我都担心衣服脏了可怎么办？”|\n' +
    '  |场景2|5s|画面切换，王小羽在家里，把衣服放进美的xxx洗衣机，并且打开洗衣机，开始洗衣|\n' +
    '  |场景3|5s|画面切换，洗衣机界面，洗衣机正在提醒王小羽释放预混仓的洗衣液，洗衣液混合成3倍浓度的精华液，以更有效的清洁效果|\n' +
    '  |场景4|5s|画面切换，王小羽拿出洗好的衣服，并且说：“美的xxx洗衣机，拥有速溶预混功能，假的洗衣液会提前在预混仓充分搅拌，混合成3倍浓度的精华液，具有很强的清洁力，让我省心和舒心！”|\n' +
    '  |场景5|2s|画面切换，王小羽穿着洗好的衣服，准备继续打羽毛球，并且面向镜头说：“快来美的xxx，让你的生活更加轻松！”|'
}
Agent: 调用工具链完成任务
可以根据ReAct处理一些复杂的任务, 比如我们询问一下San fracisco昨天的气温, 再让他进行一些计算.
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { OpenAI } from "langchain/llms/openai";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import "dotenv/config";

const model = new OpenAI({
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});
const tools = [
  new SerpAPI(process.env.SERPAPI_API_KEY, {
    location: "Austin,Texas,United States",
    hl: "en",
    gl: "us",
  }),
  new Calculator(),
];

const executor = await initializeAgentExecutorWithOptions(tools, model, {
  agentType: "zero-shot-react-description",
  verbose: true,
});

const input =
  "What was the high temperature in SF yesterday in Fahrenheit? What is that number raised to the .023 power?";

const result = await executor.call({
  input,
});

{ result: '1.1030087103157373' }
Agent工作流程示意
This content is only supported in a Feishu Docs
Memory: 聊天记录的存储
可以储存聊天记录，通过这个模式可以轻松地构造一个长期对话，以此为基础搭建一个聊天机器人。
import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
} from "langchain/prompts";
import { BufferMemory } from "langchain/memory";
import "dotenv/config";

const chat = new ChatOpenAI({
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const chatPrompt = ChatPromptTemplate.fromPromptMessages([
  SystemMessagePromptTemplate.fromTemplate(
    "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know."
  ),
  new MessagesPlaceholder("history"),
  HumanMessagePromptTemplate.fromTemplate("{input}"),
]);

// Return the current conversation directly as messages and insert them into the MessagesPlaceholder in the above prompt.
const memory = new BufferMemory({
  returnMessages: true,
  memoryKey: "history",
});

const chain = new ConversationChain({
  memory,
  prompt: chatPrompt,
  llm: chat,
  verbose: true,
});

const res = await chain.call({
  input: "My name is Jim.",
});
console.log(await memory.chatHistory.getMessages());

// Console
[
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: { content: 'My name is Jim.', additional_kwargs: {} },
    lc_namespace: [ 'langchain', 'schema' ],
    content: 'My name is Jim.',
    name: undefined,
    additional_kwargs: {}
  },
  AIMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "Hello Jim! It's nice to meet you. How can I assist you today?",
      additional_kwargs: {}
    },
    lc_namespace: [ 'langchain', 'schema' ],
    content: "Hello Jim! It's nice to meet you. How can I assist you today?",
    name: undefined,
    additional_kwargs: {}
  }
]

const res2 = await chain.call({
  input: 'What is my name?',
});

// Console
console.log(res2);
{
   response: 'Your name is Jim. You mentioned it at the beginning of our conversation. Is there anything specific you would like to know or discuss, Jim?'
}
Output Parser: 定制输出格式
强制LLM的输出满足特定格式。主要有以下几个功能：
- 格式化输出：比如Creative Assistant就存在需要格式化数据来让GUI消费的需求。
- 增强/优化模型输出稳定性：
  - 错误修正（语法，拼写）
  - 风格一致性
  - 内容过滤
import { z } from "zod";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import {
  StructuredOutputParser,
  OutputFixingParser,
} from "langchain/output_parsers";
import "dotenv/config";

const outputParser = StructuredOutputParser.fromZodSchema(
  z.array(
      z.object({
        fields: z.object({
          Name: z.string().describe("The name of the country"),
          Capital: z.string().describe("The country's capital"),
        }),
      })
    ).describe("An array of Airtable records, each representing a country"));

const chatModel = new ChatOpenAI({
  temperature: 0, // For best results with the output fixing parser
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const outputFixingParser = OutputFixingParser.fromLLM(chatModel, outputParser);

// Don't forget to include formatting instructions in the prompt!
const prompt = new PromptTemplate({
  template: `Answer the user's question as best you can:\n{format_instructions}\n{query}`,
  inputVariables: ["query"],
  partialVariables: {
    format_instructions: outputFixingParser.getFormatInstructions(),
  },
});

const answerFormattingChain = new LLMChain({
  llm: chatModel,
  prompt,
  outputKey: "records", // For readability - otherwise the chain output will default to a property named "text"
  outputParser: outputFixingParser,
});

const result = await answerFormattingChain.call({
  query: "List 5 countries.",
});

console.log(JSON.stringify(result.records));

//console
[
  {
    "fields": {
      "Name": "United States",
      "Capital": "Washington, D.C."
    }
  },
  {
    "fields": {
      "Name": "Canada",
      "Capital": "Ottawa"
    }
  },
  {
    "fields": {
      "Name": "Germany",
      "Capital": "Berlin"
    }
  },
  {
    "fields": {
      "Name": "Japan",
      "Capital": "Tokyo"
    }
  },
  {
    "fields": {
      "Name": "Australia",
      "Capital": "Canberra"
    }
  }
]


API Chain：访问API
根据Doc访问API
[Image]
import { OpenAI } from "langchain/llms/openai";
import { APIChain } from "langchain/chains";
import * as fs from "fs";
import "dotenv/config";

const model = new OpenAI({
  modelName: "text-davinci-003",
  openAIApiKey: process.env.OPENAI_API_KEY,
});
const OPEN_METEO_DOCS = fs.readFileSync("OPEN_METEO_DOCS.txt", "utf8");
const chain = APIChain.fromLLMAndAPIDocs(model, OPEN_METEO_DOCS, {
  headers: {
    // These headers will be used for API requests made by the chain.
  },
});

const res = await chain.call({
  question:
    "What is the weather like right now in Munich, Germany in degrees Farenheit?",
});
console.log({ res });
/** console **/
{
  res: {
    output: ' The current weather in Munich, Germany is 70.7°F with a windspeed of 10.8 km/h.'
  }
}
Retrieval QA：根据文章回答问题
RAG(Retrieval-Augmented Generation)：从大量文章中检索相关信息来增强文本生成的质量和准确性。RAG通常被用来回答复杂问题或者生成信息密集的内容。
通过TextSplitters和Vector Store，LangChain可以轻松实现RAG
[Image]

import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain, loadQAStuffChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as fs from "fs";
import "dotenv/config";
import { PromptTemplate } from "langchain";

// Initialize the LLM to use to answer the question.
const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
});
const text = fs.readFileSync("state_of_the_union.txt", "utf8");
const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
const docs = await textSplitter.createDocuments([text]);

// Create a vector store from the documents.
const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

// Initialize a retriever wrapper around the vector store
const vectorStoreRetriever = vectorStore.asRetriever();

const promptTemplate = `Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.

{context}

Question: {question}
Answer in Chinese:`;

const prompt = PromptTemplate.fromTemplate(promptTemplate);

// Create a chain that uses the OpenAI LLM and HNSWLib vector store.
const chain = new RetrievalQAChain({
  combineDocumentsChain: loadQAStuffChain(model, { prompt }),
  retriever: vectorStoreRetriever,
});
const res = await chain.call({
  query: "What did the president say about Justice Breyer?",
});
console.log({ res });

// Conosle
{
  res: {
    text: ' 他表扬了史蒂芬·布雷耶最高法院司法官的生涯，说他是为国家服务的人，是马萨诸塞州的军人、宪法学者和美国最高法院的退休司法官。'
  }
}
Conversational Retrieval QA
根据文章聊天
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { BufferMemory } from "langchain/memory";
import * as fs from "fs";
import "dotenv/config";

/* Initialize the LLM to use to answer the question */
const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
});
/* Load in the file we want to do question answering over */
const text = fs.readFileSync("state_of_the_union.txt", "utf8");
/* Split the text into chunks */
const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
const docs = await textSplitter.createDocuments([text]);
/* Create the vectorstore */
const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
/* Create the chain */
const chain = ConversationalRetrievalQAChain.fromLLM(
  model,
  vectorStore.asRetriever(),
  {
    memory: new BufferMemory({
      memoryKey: "chat_history", // Must be set to "chat_history"
    }),
  }
);
/* Ask it a question */
const question = "What did the president say about Justice Breyer?";
const res = await chain.call({ question });
console.log(res);
/* Ask it a follow up question */
const followUpRes = await chain.call({
  question: "Was that nice?",
});
console.log(followUpRes);

// *** Console ***
{
  text: 'The President honored Justice Stephen Breyer, recognizing him as an Army veteran, Constitutional scholar, and retiring Justice of the United States Supreme Court. The President thanked Justice Breyer for his service.'
}

{
  text: "Yes, the President's acknowledgement of Justice Breyer's accomplishments and gratitude for his service was commendable."
}

SQL
访问数据库
import { DataSource } from "typeorm";
import { OpenAI } from "langchain/llms/openai";
import { SqlDatabase } from "langchain/sql_db";
import { SqlDatabaseChain } from "langchain/chains/sql_db";

const datasource = new DataSource({
  type: "sqlite",
  database: "Chinook.db",
});

const db = await SqlDatabase.fromDataSourceParams({
  appDataSource: datasource,
});

const chain = new SqlDatabaseChain({
  llm: new OpenAI({ temperature: 0 }),
  database: db,
});

const res = await chain.run("How many tracks are there?");
console.log(res);

// Console
There are 3503 tracks.
Summarization
文章总结Chain
import { OpenAI } from "langchain/llms/openai";
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as fs from "fs";

// In this example, we use a `MapReduceDocumentsChain` specifically prompted to summarize a set of documents.
const text = fs.readFileSync("state_of_the_union.txt", "utf8");
const model = new OpenAI({ temperature: 0 });
const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
const docs = await textSplitter.createDocuments([text]);

// This convenience function creates a document chain prompted to summarize a set of documents.
const chain = loadSummarizationChain(model, { type: "map_reduce" });
const res = await chain.call({
  input_documents: docs,
});
console.log({ res });

// Console
{
  res: {
    text: " President Biden's State of the Union address highlighted the resilience of the American people and nation, and the global support for Ukraine in the face of autocracy. He proposed a plan to create jobs, modernize infrastructure, and promote environmental justice in America, as well as reduce the cost of prescription drugs, invest in infrastructure and innovation, and combat inflation. He also called for increased competition in the market to reduce costs and protect consumers from exploitation, and for bipartisan support to pass a budget, reduce gun violence, and protect the right to vote. Finally, he announced an expansion of eligibility for benefits to include nine respiratory cancers, and urged Congress to fund ARPA-H, a project to make advances in treating cancer, Alzheimer's, and diabetes."
  }
}



未来？
RAG -> More Context Support & File Input
- OpenAI Dev Day给出的两个新feature，或许会打击到LangChain最重要的usecase 之一：RAG
  - 128,000 tokens of context
  - 可以支持文件上传输入
- 利用OpenAl的新GPT-4V API发布一系列多模态RAG(检索增强生成)模板和教程
在大多数 RAG 应用中，图像中捕获的信息都会丢失。Langchain发布了几个利用GPT-4V API的模版，让用户可以实现多模态RAG：
https://github.com/langchain-ai/langchain/blob/master/cookbook/Multi_modal_RAG.ipynb
[Image]

Agent -> Internet Access & Function calling & Code Interpreter
OpenAI增强了函数调用的能力，可以一次调用多个函数，类似Agent。
OpenAI可以直接使用互联网，也可以允许代码，内置了LangChain的tooling能力。
[Image]
Output Parser -> JSON mode
OpenAI会确保JSON格式输出，也就是LangChain的Output Parser也可替代了。
[Image]
 OpenAI的App Store
一键生成chat bot 对langchain的生态也是很大的打击
[Image]
