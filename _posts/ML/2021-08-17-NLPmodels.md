---
title:  "[NLP] Word2Vec"
date:   2021-08-17 21:29:23 +0800
categories: Note ML
---


The model developed by google, Word2Vec, gave its first show in 2013. It used a unsupervised learning model to train vector representation for words. 

## Background

###  Statistical Language Model

The statistical language model is constructed based on a corpus. Consider a sentence that contains $T$ words, denoted as $W = (w_{1}, w_{2}, ..., w_{T})$ . Then the probability of such sentence is descrbied by the joint probability of each words. 

$$p(W) = p(w_{1}, w_{2},...w_{T})$$

By Bayes theory, we can further transform it into

$$p(W) = p(w_{1})p(w_{2}|w_{1})p(w_{3}|w_{1}, w_{2}),...,p(w_{T}|w_{1},...w_{T-1})$$

And all the probabilities in the above equation is given by the language model. The problem is, how to calculate these parameters?

### N-gram Model

According to Bayes theory, we have

$$p(w_{k}|w_{1},...,w_{k-1}) = \dfrac{p(w_{1},...w_{k})}{p(w_{1},...,w_{k-1})}$$

When our corpus is large enough, We can approximate it with

$$\dfrac{count(w_{1},...w_{k})}{count(w_{1},...,w_{k-1})}$$


However, the computation complexity is too large for long sentences. n-gram model makes an assumption that the probability of a word to occur is only related to the previous $n-1$ words. By experiment, $n=3$ is the optimal size. If n gets larger, there's a trade off in the increasing computation complexity and extent of accuracy improvement.

There's another trade off in distinguishability and reliability. If $n$ gets larger, the probabilities are more specific and thus more distinguisable. However, the size of instances is smaller that it reduces the reliability.


### Neural Probabilistic Language Model

This model applied neural network to solve the probability of the next word given first $n$ words. The MLP provides three layers:

* Input Layer: concatenate all previous $n$ word embeddings (vectors)
* Hidden Layer: using $tanh$ as activation. From embeddings to probabilities of each word.
* Output Layer: softmax to get the true probabilities.

The word embeddings (word vectors) are also the models parameter. The advantages of such model over n-gram are
1. **The similarity between words can be represented by word vectors.** For example, if in some corpus, the sentence "A dog is running in the room" occurred 10000 times, but "A cat is running in the room" occurred only 1 time, n-gram will think the probability of the first sentence is larger than the second one. However, by neural network model, as the sentence is constructed by words, when learning "A dog is running in the room", the probability of "A cat is running in the room " will also increase.
2. **There's no "no instance" issue because it is based on word vector rather than frequency**


## Word Vector

For every word, we can use a vector to represent it. The most intuitive way is **one-hot representation**. We gave every word a dimension and if for each word, the value on its own dimension is 1. The rest is 0.

The sparce representation has two drawbacks:
1. It is vulnerable to dimensional disaster
2. We can not characterize the similarity between words
3. Strong sparcity. Little information can be extracted as the size grows larger

To solve the above problem, we turn to **distributed representation**. It maps each word to a less lengthy vector (to a lower-dimensional space). A vector can be seen as a point in such space. Therefore, we can apply the concept of distance to the similarity between words.

Many methods can be applied to obtain word vectors, such as LSA and LDA. We can also use neural network structure to obtain word vectors, just like the above example.

## Word2Vec

Word2Vec is a light-weighted neural network. It only includes input, hidden layer and output. The structure is related to the input and output.
{% include figure image_path="/assets/images/word2vec/cbow.jpeg" alt="this is a placeholder image" caption="strcuture" %}

### CBOW

CBOW is the structure in the case where we know the context $w_{t-2}$, $w_{t-1}$, $w_{t+1}$, $w_{t+2}$ of word $w_{t}$.

We input $C$ one-hot vectors as the context of the target word. Then we propagate through a linear unit. Notice that the product of a one-hot vector with the weight matrix is actually one row of the matrix. After propogate through the weight matrix, we have $C$ distributed vectors corresponding to the $C$ rows of the weight matrix. Then we sum them up and take the average.

The result from the hidden unit then passes to the output unit, undergoing another linear transformation. The result is processed through softmax and the cross entropy loss is computed.
{% include figure image_path="/assets/images/word2vec/cbow_structure.jpeg" alt="this is a placeholder image" caption="strcuture" %}


### Skip-gram

Skip-gram is the strucuture in the case where we know a word and want to get the probabilities of other words. The input-to-hidden is the same as CBOW, but only having one context. The hidden-to-output is different. It is changed into the sum of $C$ loss functions.

{% include figure image_path="/assets/images/word2vec/skipgram_structure.jpeg" alt="this is a placeholder image" caption="strcuture" %}
