---
title:  "All About Attention and Transformer"
date:   2021-11-16 21:29:23 +0800
categories: Note ML MLBasics NLP
---

> An indepth discussion of attention mechanism in sequential data analysis

##  Attention is All You Need

The word "transformer" is constantly comming up in many ML fields these days. It all comes from a [paper](https://proceedings.neurips.cc/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf) in NeurlPS, which has been cited 30870 times by the time I write this blog. This stuff is sooo magical and trending that I always want to make clear what it really means. This blog will discuss my recent thoughts and intuitions.


## ❓ What is attention, and what problem it is trying to solve?

### Semantic Parsing
Attention, semantically, is about focusing on something. In another way it also implies NOT focusing on the other things, because the energy one has is limited. Intuitively, when we are read a sentence and trying to understand a word in that sentence, we put different levels of attentions on different words based on their relation. For example, in the sentence "I ate pizza yesterday," we naturally see strong connections between the word "ate" and the word "pizza" because they form an S-O relation syntatically. Another example is in the sentence "This pizza is not too bad", we see the connections between "not" and "bad", which leads to the positive sentiment of this sentence. The relation is important for our understanding. In earlier NLP works, we used to parse those relation with a semantic parser into a tree structure. Attention mechanism is trying to learn those relations in an implicit way.

### Gradient Vanishing and Parallel Computing
An ancient issue about RNN is that the gradient of a cell vanishes as model moves on. As the gradient is passed cell by cell, the more distant two cell is, the less they can affect each other, because the gradient is differentiated too many times during the propogation. An interesting walk around method has been developed, called LSTM, which maintain a long lasting memory on the previous cell and let the cell decide whether to remember or forget. This method was popular before transformer comes out.

Another head-aching issue in RNN based network is that we have to get the output of the previous cell before we compute the next one. In other words, we can not utilize the parallel computing, which is a brilliant invention in computer science, with such structure. This makes the model annoyingly slow to train. 

As said in the paper, the transformer is going to fix all of them 🥳。 


## Attention Mechanism

The most fundamental issue is: how can we represent the relation between different items in a sequence? Suppose a sequence $s = [s_1, s_2, s_3,\cdots, s_n]$. The easiest way is to use a scalar value to represent the relation between $s_i$ and $s_j$, i.e. $R_{i,j} = \text{some scalar}$. This results in a 2D matrix, as we have one value for each pair. When we are reading $s_i$ and wonder which items should we pay attention to, we can look at $R_i$ as reference. We can also have the contextualized representation $s_i$ be

$$ c(s_i) = s_1 R_{i,j}+ s_2R_{i,j}\cdots s_n R_{i,j}$$

It is intuitive because the larger $R[i,j]$ is, we should focus more on $s_j$, so the contextualized representation should have bigger component of $s_j$. We can vectorize the above representation into

$$
\begin{aligned}
 c(\begin{bmatrix}
     s_1\\
     s_2\\
     \vdots\\
     s_n
 \end{bmatrix})
 &=
 \begin{bmatrix}
 s_1R_{1,1}\\
 s_1R_{2,1}\\
 \vdots\\
 s_nR_{n,1}
 \end{bmatrix}
 +
  \begin{bmatrix}
 s_2R_{1,2}\\
 s_2R_{2,2}\\
 \vdots\\
 s_nR_{n,2}
 \end{bmatrix}
 + 
 \cdots
 +
  \begin{bmatrix}
 s_nR_{1,n}\\
 s_nR_{2,n}\\
 \vdots\\
 s_nR_{n,n}
 \end{bmatrix}
 \\  
 &= sR
\end{aligned}$$

> 💥 Bang! This looks very similar to the matrix factorization in recommending system.


### How do we get $R$ ?

A simple way to get $R$ is to make $S$ multiply itself, i.e $R = ss^T$. This is a relatively fixed mapping and it tends to make the diagonal elements large, which also make sense because they are always relevent to themselves, but the negative side is that the attention doesn't change the origin sequence much. If we want this method to work, we need relevant words to have the similar embeddings so that their dot product is big. For example, we need $s_{not}\cdot s_{bad}$ to be large so that $R_{not,bad}$ is large. This imposes many restrictions on our embedding space.

A more sophisticated way is called "Scaled Dot-Product Attention." This does three modifications:

1. **Scaled attention**. It is a simple adaption: we add a scale term for $R$. The intuition is, **as the dimension goes up, the average of $R$ increases**. Therefore, we use a scaled version of attention:
   $$ R_{i,j} = \dfrac{s_i^Ts_j}{\sqrt n}$$

2. **Dot product attention**.
   
