---
title:  "Collaborative Filtering"
date:   2021-11-16 8:29:23 +0800
categories: Note ML MLBasics Filtering
mermaid: true
---
> Tell me what kind of stuff do "I" like?



The figures in this posts are credited to Professor Sindu Kutty.


## A Brief Intro

We are now diving into the field of recommendation system.


## Problem Setup
Suppose we have two types of entities: $n$ users and $m$ items. Then, our problem is to find an $n\times m$ matrix $Y$ where the $Y_{i,j}$ means the preference of user $i$ over the item $j$. We may know some of the terms in the matrix. Our ultimate goal is to fill every terms in the matrix based on what we've already known. 

There are basically two ways to approach this:

### Matrix Factorization

Given the matrix $Y$ with empty cells, we try to find a low rank $\hat Y$ with no empty cells. According to the theorem:

Let $\hat Y \in \mathbb{R}^{n\times m}$ and $\text{rank}(\hat Y) = r$. Then there is $U \in \mathbb{R}^{r\times m}$ such that $\hat Y = UV^{T}$

For example, if we are building a movie recommendation system, we may want to build correlation between the customer and the movie name. However, by matrix factorization, we may discover latent variables, which can be moive categories like "comedy" or "action", that serves as a bridge between the customers and the moives. Instead of finding user-moive matrix $Y$, we can first find user-feature matrix $U$ and moive-feature matrix $V$ so that $U\cdot V^T = \hat Y \approx Y$ . If the customerA likes comedy with $0.3$ and action with $0.5$, while movieB is $0.6$ of comedy and $0.4$ of the action, we can say that customerA and moiveB has $0.3\cdot 0.6 + 0.5 \cdot 0.4 = 0.38$

{% include figure image_path="/assets/images/ML/collaborative_filtering1.png" alt="this is a placeholder image" caption="" %}

Since we want $\hat Y$ to be as close to $Y$ as possible, it's natural taht we use a least squared loss function with L2 regularization:

$$ J(\hat Y) = \dfrac{1}{2}\sum_{(a,i) \in D} (Y_{ai} - \hat Y_{ai})^2 + \dfrac{\lambda}{2} \sum(\hat Y_{ai})^2

where $D$ is the set containing all index pairs of the known terms in $Y$. Replacing $U,V$ gives us

$$\begin{aligned} J(U,V) &= \dfrac{1}{2}\sum_{(a,j)\in D} (Y_{ai} - [UV^T]_{ai})^2 + \dfrac{\lambda}{2}\sum(U_{ak})^2 + \dfrac{\lambda}{2}\sum_{i,k}(V_{ik})^2 \\
&= \dfrac{1}{2}\sum_{(a,i) \in D} (Y_{ai} - \bar u^{(a)}\cdot \bar v^{(i)})^2 + \dfrac{\lambda}{2}\sum_{a}\lVert \bar u^{a} \rVert^2 + \dfrac{\lambda}{2}\sum_i\lVert v^{(i)} \rVert^2
\end{aligned}$$

Since we have two variables to optimize, it is natural to use coordinate descent. Plus, this optimization problem is a typical ridge regression.

### Algorithm in Steps

1. Initialize item features $\bar v^{(1)}, \cdots, \bar v^{(m)}$ to small random values
2. Iterate until convergence
   1. Fix $\bar v^{(1)}, \cdots, \bar v^{(m)}$. Solve for $\bar u^{(1)}, \cdots, \bar u^{(n)}$ that minimize the loss function.
   2. Fix $\bar u^{(1)}, \cdots, \bar u^{(n)}$. Solve for $\bar v^{(1)}, \cdots, \bar v^{(m)}$ that minimize the loss function.

For example, if we have the following problem
{% include figure image_path="/assets/images/ML/collaborative_filtering_example.png" alt="this is a placeholder image" caption="" %}

The steps to solve this problem is:

$$\begin{aligned}
J(U,V) &= \dfrac{1}{2}\sum_{(a,i) \in D} (Y_{ai} - \bar u^{(a)}\cdot \bar v^{(i)})^2 + \dfrac{\lambda}{2}\sum_{a}\lVert \bar u^{a} \rVert^2 + \dfrac{\lambda}{2}\sum_i\lVert v^{(i)} \rVert^2\\
&= \dfrac{1}{2}((5 - u^{(1)}v^{(1)})^2 + (7 - u^{(1)}v^{(3)})^2) + \dfrac{\lambda}{2}\lVert u^{(1)} \rVert^2\\
&= \dfrac{1}{2}((5 - 4u^{(1)})^2 + (7 - 5u^{(1)})^2) + \dfrac{\lambda}{2}\lVert u^{(1)} \rVert^2\\
\end{aligned}$$

Taking the derivative of $u^{(1)}$ gives us

$$\begin{aligned}
\nabla_{u^{(1)}}J &= 0.5(-8u^{(1)}(5-4u^{(1)}) -10u^{(1)}(7 - 5u^{(1)})) + u^{(1)} = 0\\
u^{(1)} & = 1.31
\end{aligned}$$

### Nearest Neighbor Prediction


