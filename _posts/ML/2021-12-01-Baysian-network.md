---
title:  "Baysian Network"
date:   2021-11-16 8:29:23 +0800
categories: Note ML MLBasics Regression
mermaid: true
---

> A probabilistic model to reason.


The figures in this posts are credited to Professor Sindu Kutty.


## A Brief Intro
Baysian network is a model for probability relationship. By capturing the relations, it saves the number of parameters and make it easier to learn and infer.




## Problem Setup


Suppose $n$ data points are sampled from a mixture of $k$ gaussian distributions, whose means and variances are $\mu_1, \mu_2, \cdots, \mu_k$ and $\sigma_1^2, \sigma_2^2, \cdots, \sigma_k^2$, in a rate of $\gamma_1, \cdots, \gamma_k$. We represent these parameters as $\theta$.
   $$\theta = [\gamma_1, \cdots, \gamma_k,\mu_1, \mu_2, \cdots, \mu_k,\gamma_1, \cdots, \gamma_k]$$
That means $$P(x \lvert \sigma) = \sum_{j=1}^k\gamma_jP(x\vert\mu_j, \sigma_j^2)$$

where
$$P(x\vert \mu, \sigma) = \dfrac{1}{(2\pi\sigma_j^2)^{d/2}}\exp{-\dfrac{1}{2\sigma_j^2}\lVert x - \mu_j \rVert^2}$$

Assume the distribution assignmets of $k$ data points are represented by a latent variable $z = [z_1, z_2, \cdots, z_n]$ where $z_i \in {1,2,\cdots, k}$, signifying the corresponding distribution the $i$th data point is sampled from.

Both $z$ and $\theta$ are unknown to us. We want to find a MLE of the data points on those two variables, that is, find the $\theta$ s.t. using it creates the maximum likelihood of observing the dataset. Note that $z$ does not appear as a term to optimize because **z comes with the data, not with the distribution**. $z$ helps us to estimate $\theta$, but knowing $z$ itself doesn't help us understand the distribution. So $z$ is called a "hidden variable". Our objective is:

$$
\begin{aligned}
 &\underset{\theta}{\max} \sum_{i=1}^n \log P(x_i\vert \theta)\\
&=\underset{\theta}{\max} \sum_{i=1}^n \log \sum_{z_i} P(x_i, z_i\vert \theta)
\end{aligned}
$$



## Ideas

We can get our inspiration from the K-means clustering. We have two unknowns, $\theta$ and $z$. They kinda wrangle together, so we can not directly optimize on any one of them. However, once we know $z$, it is easy for us to get $\theta$, because the problem simply reduce to the MLE of two separate gaussian distributions, with their own data. Once we know $\theta$, we can also better assign the $z$, since we know the probability of each point to occur in each distribution. Therefore, it's natural to approach the optimal by **coordinate descend (or ascend, since it is a maximization problem)**

The following figures can give you a good sense of the procedure:


{% include figure image_path="/assets/images/ML/EM1.png" alt="this is a placeholder image" caption="Start with an unlabeled dataset" %}

{% include figure image_path="/assets/images/ML/EM2.png" alt="this is a placeholder image" caption="Randomly guess parameters" %}

{% include figure image_path="/assets/images/ML/EM3.png" alt="this is a placeholder image" caption="Approach the optimal by optimizing one parameter at a time" %}


## Algorithm in Steps

EM algorithm is, by its name, divided into two iterative steps, the "E" step and the "M" step.

**In E Step**, we use the current estimate of mixture model to assign data points to distributions.
* Fix $\theta$
* For each point $x_i$ and each distribution $j$, calculate $P(j\vert i) = \dfrac{\gamma_i N(x_i\vert \mu_j, \sigma_j^2)}{\sum_t\gamma_t N(x_i\vert \mu_t, \sigma_t^2)}$. The interpretation given the mixture model, what is the probability of $x_i$ to be sampled from $j$th distribution, or more intuitively, **what portion of $x_i$ could come from $j$th distribution**.



**In M step**, we use the current assignment to re-estimate each model separately.
* Fix $z$
* For each distribution, re-estimate its parameter. For the $j$th distribution, first calculate the normalization term $\hat n_j$ and the magnitude term $\hat \gamma_j$
  $$\hat n_j = \sum_{i=1}^n$$
  $$\hat \gamma_j = \sum_{i=1}^n p(j\vert i)$$ 

Then, calculate the parameter $\hat \mu_j$ and $\hat \sigma_j^2$ with

$$\hat \mu_j = \dfrac{1}{\hat n_j}\sum_{i=1}^n p(j\vert i)x_i$$
$$\sigma_j^2 = \dfrac{1}{d\hat n_j}\sum_{i=1}^n p(j\vert i) \lVert x_i - \hat \mu_j\rVert^2$$

where $d$ is the dimension of the random variable.
