---
title:  "[NLP] Word2Vec"
date:   2021-08-17 21:29:23 +0800
categories: Note ML
---

> A brief intro to word2vec paper and the context.


The model developed by google, Word2Vec, gave its first show in 2013. It used a unsupervised learning model to train vector representation for words. 


## Word Vector

For every word, we can use a vector to represent it. The most intuitive way is **one-hot representation**. We gave every word a dimension and if for each word, the value on its own dimension is 1. The rest is 0.

The sparce representation has two drawbacks:
1. It is vulnerable to dimensional disaster
2. We can not characterize the similarity between words
3. Strong sparcity. Little information can be extracted as the size grows larger

To solve the above problem, we turn to **distributed representation**. It maps each word to a less lengthy vector (to a lower-dimensional space). A vector can be seen as a point in such space. Therefore, we can apply the concept of distance to the similarity between words.

Many methods can be applied to obtain word vectors, such as LSA and LDA. We can also use neural network structure to obtain word vectors, just like the above example.

## Word2Vec

### Intro
The paper "Efficient Estimation of Word Representations in Vector Space" introduced an architecture that "can be used for learning high-quality word vectors from huge data sets". The expectation of this model is to represent word in vectors so that similar words tend to be close to each other, but words can have **multiple degree of similarity**(in syntactic aspect, it means words that have similar endings). Beyond that, the word vector support algebraic operations: vector("king") - vector("man") + vector("woman") is close to vector("quene").

{% include figure image_path="/assets/images/word2vec/cbow.jpeg" alt="this is a placeholder image" caption="strcuture" %}


### Context

The authors of word2Vec admitted that they directly extend the architecture of NNLM by focusing on the first step where word vectors were learnt(NNLM has two steps, the first step is to learn word vectors and the second is to train NNLM).

Other models like LSA and LDA has their own drawbacks. LSA can not preserve the linear regularities among words very well. LDA is computationally very expensive on large data sets.

###  Statistical Language Model

The statistical language model is constructed based on a corpus. Consider a sentence that contains $T$ words, denoted as $W = (w_{1}, w_{2}, ..., w_{T})$ . Then the probability of such sentence is descrbied by the joint probability of each words. 

$$p(W) = p(w_{1}, w_{2},...w_{T})$$

By Bayes theory, we can further transform it into

$$p(W) = p(w_{1})p(w_{2}|w_{1})p(w_{3}|w_{1}, w_{2}),...,p(w_{T}|w_{1},...w_{T-1})$$

And all the probabilities in the above equation is given by the language model. The problem is, how to calculate these parameters?

#### N-gram Model

According to Bayes theory, we have

$$p(w_{k}|w_{1},...,w_{k-1}) = \dfrac{p(w_{1},...w_{k})}{p(w_{1},...,w_{k-1})}$$

When our corpus is large enough, We can approximate it with

$$\dfrac{count(w_{1},...w_{k})}{count(w_{1},...,w_{k-1})}$$


However, the computation complexity is too large for long sentences. n-gram model makes an assumption that the probability of a word to occur is only related to the previous $n-1$ words. By experiment, $n=3$ is the optimal size. If n gets larger, there's a trade off in the increasing computation complexity and extent of accuracy improvement.

There's another trade off in distinguishability and reliability. If $n$ gets larger, the probabilities are more specific and thus more distinguisable. However, the size of instances is smaller that it reduces the reliability.
#### Neural Probabilistic Language Model(NNLM)

This model applied neural network to solve the probability of the next word given first $n$ words. The MLP provides three layers:

* Input Layer: concatenate all previous $n$ word embeddings (vectors)
* Hidden Layer: using $tanh$ as activation. From embeddings to probabilities of each word.
* Output Layer: softmax to get the true probabilities.

At the input layer,  $N$ previous words are encoded into one hot vector using the vocabulary. 
The word embeddings (word vectors) are also the models parameter. Then the one hot input is projected by an $N\times D$ projection matrix, fed to the hidden layer afterwards. The advantages of such model over n-gram are
1. **The similarity between words can be represented by word vectors.** For example, if in some corpus, the sentence "A dog is running in the room" occurred 10000 times, but "A cat is running in the room" occurred only 1 time, n-gram will think the probability of the first sentence is larger than the second one. However, by neural network model, as the sentence is constructed by words, when learning "A dog is running in the room", the probability of "A cat is running in the room " will also increase.
2. **There's no "no instance" issue because it is based on word vector rather than frequency**

However, the problems are the computation costs. For a common choice of $N=10$, typical size of $P$ is 500 to 2000, while hidden layer has size of 500 to 1000. Matrix multiplication becomes very tedious. The solution to this problems are: **hierarchical softmax** and **avoiding normalized models by using models that are not normalized during training**.

The word2Vec uses hierarchical softmax(vocabulary represented as a Huffman binary tree).



#### Recurrent Neural Net Language Model(RNNLM)

Recurrent neural network is designed to get rid of context length($N$). It does not have a projection layer, but only contain hidden and output layer. The time-delayed connections allows the recurrent neural network form short term memory.

### New Log-linear Models

Two architectures are proposed in the paper to minimize the computational complexity. Note that most of the complexity is caused by the non-linear hidden layer in the model.
#### CBOW(Continuous Bag of Word Model)

CBOW is the structure in the case where we know the context $w_{t-2}$, $w_{t-1}$, $w_{t+1}$, $w_{t+2}$ of word $w_{t}$. It is similar to NNLM, but with the non-linear hidden layer removed and projection layer shared for all words(not just a projection layer, but a parameter with regard to the vocabulary). It is BOW because the order of words doesn't influence the projection. It is called CBOW because it uses **continuous distributed representation of the context**.

We input $C$ one-hot vectors as the context of the target word. Then we propagate through a linear unit. Notice that the product of a one-hot vector with the weight matrix is actually one row of the matrix. After propogate through the weight matrix, we have $C$ distributed vectors corresponding to the $C$ rows of the weight matrix. Then we sum them up and take the average.

The result from the hidden unit then passes to the output unit, undergoing another linear transformation. The result is processed through softmax and the cross entropy loss is computed.

{% include figure image_path="/assets/images/word2vec/cbow_structure.jpeg" alt="this is a placeholder image" caption="strcuture" %}



#### Skip-gram

Skip-gram is the strucuture in the case where we know a word and want to get the probabilities of other words. It tries to maximize classification of a word based on another word in the same sentence. We use the current word as an input to a log-linear classifier with continuous projection layer, and predict words within a certain range before and after the current word. The input-to-hidden is the same as CBOW, but only having one context. The hidden-to-output is different. It is changed into the sum of $C$ loss functions.


{% include figure image_path="/assets/images/word2vec/skipgram_structure.jpeg" alt="this is a placeholder image" caption="strcuture" %}




### Results

The trained model can perform tasks in different levels of difficulty:
1. big-biggest, small-smallest similarity.
2. vector(biggest)-vector(big)+vector(small) is close to vector(smallest)
3. France is to Paris as German is to Berlin.

They also tested the model on different datasets. As it is less important, I will not list them here.