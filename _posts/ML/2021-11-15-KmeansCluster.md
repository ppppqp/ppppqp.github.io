---
title:  "K-means Clustering"
date:   2021-11-15 21:29:23 +0800
categories: Note ML MLBasics Clustering
---

> Birds of a feather flock together.


The figures in this posts are credited to Professor Sindu Kutty.


## A Brief Intro

K-means clustering is an unsupervised learning technique. Sometimes we like to study the distribution of the data with the data itself, that is, without labeling. We may want to see whether the data is clustered into some groups. These kind of problems are called "clustering problems.". K-means is an efficient way to solve the problems.

## Problem Setup
Suppose we have datapoints $x_1, \cdots, x_n$. We will assign those points to $k$ clusters. The assignment can be expressed as $c_1, \cdots, c_n$, where $c_i \in \{1,\cdots,k\}$. The mean corresponding to each clusters are $\mu_1, \cdots, \mu_k$. The objective function for k-means to minimize is the sum of squared distance between each datapoint in a cluster to the center of that cluster:

$$\sum_{i=1}^{n}\lVert x_i - \mu_{c_i}\rVert^2$$


## Algorithm in steps:
1. Randomly initialize the means.
2. Iteratively do the following to steps:
   * For each $i$, reassign x_i to c_i, where c_i = \underset{k}{\text{argmin}}\lVert x_i - \mu_i\rVert^2, that is, the cluster whose the center is closest
   * For each $j$, recomputer \mu_j with the new assignment

{% include figure image_path="/assets/images/ML/kmeans.png" alt="this is a placeholder image" caption="" %}


## Initialization Consideration:

There are several ways to do the initialization: for example, we can initialize on $k$ ramdom datapoints, initialize by picking the next center that is far from the previous assgined center, etc.


## Proof of convergence

The algorithm will converge finally, i.e., the steps no longer changes the assignment.

There are two variables in the objective function: the assignments $c$ and the means $\mu$.
$$J(c,\mu) = \sum_{i=1}^{n}\lVert x_i - \mu_{c_i}\rVert^2$$

In the first step, we fix the mean $\mu$ minimize $J$ by chosing the optimal $c$. In the second step, we fix $c$ and find the optimal $\mu$. So J must be monotonically decreasing. As the possible values of $c$ and $\mu$ is finite, it will converge finally.





