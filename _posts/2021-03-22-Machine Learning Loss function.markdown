---

title:  "Machine Learning Loss function"
date:   2021-03-22 21:29:23 +0800
categories: Note CV
toc: true
---

# Machine Learning Loss Function

## Cross-entropy Loss
Suppose we want to  fit a linear classfier. We find a weight matrix $W$ and input $X$, and we want to see how close is the result $XW$ to output $Y$, which is a one-hot representation of class. 

The cross entropy loss is defined as follows. First, we have a classifier score $s = f(x_{i}, W)$. We run it through the softmax function 

$$p_{i} = \dfrac{exp(s_{i})}{\sum_{j}exp(s_{j})}$$

You can think of softmax function as a probability function: the sum of all $p_{i}$ is $1$ and every term is between $0$ and $1$.

Then, we compute the loss based on the probability. 

$$L_{i} = -log(p_{y_{i}})$$

This makes sense because if the probability is close to 1, the loss is close to 0. If the probability is close to 0, the loss is close to infinity.



## Multiclass SVM Loss

