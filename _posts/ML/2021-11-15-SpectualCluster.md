---
title:  "Spectral Clustering"
date:   2021-11-16 6:29:23 +0800
categories: Note ML MLBasics Clustering
mermaid: true
---

> They tell you how it works. I tell you why.


The figures in this posts are credited to Professor Sindu Kutty.


## A Brief Intro
In the previous posts we looked at the K-means clustering. It is fast, but also suscpetible to the variations in cluster size, shape, etc. These are some cases when k-means fail to find an optimal solution:
{% include figure image_path="/assets/images/ML/kmeans_fail.png" alt="this is a placeholder image" caption="" %}

The reason is that the k-means is "center based", which means it doesn't care about the size or shape of that cluster: it only care about its center. If a cluster is super large, it is likely that the elements on its edge are closer to other cluster's center. To better capture those features, we introduce spectral clustering here.

In a nut shell, spectural clustering **transforms the data from Cartesian space into a low dimensional similarity space and then clustering in similarity space.** The mapping from Cartesian space to similarity space is done by the similarity matrix.

## Problem Setup
Suppose we have datapoints $x_1, \cdots, x_n$. We will assign those points to $k$ clusters. The assignment can be expressed as $c_1, \cdots, c_n$, where $c_i \in \{1,\cdots,k\}$. We don't assume globular-shaped clusters, which means the mean is not necessarily the center of the cluster. However, we convert the datapoints into a weighted graph, with weight of the edge connecting $x_i$ and $x_j$ being $w_{i,j}$. Then, we view the clustering as a graph partition problem.

{% include figure image_path="/assets/images/ML/spectral_cluter1.png" alt="this is a placeholder image" caption="" %}

We try to find a $k-1$ cuts that minimize the objective function
   
$$\text{cut}(A, \bar A) = \sum_{i\in A, j\in \bar A} w_{i,j}$$

where $A$ and $\bar A$ mean a subgraph and its complement.

This is based on the intuitive to **make the links between the clusters to be weaker (bigger)** However, it doesn't consider the links inside a cluster, so it is suscpetible to the outliers (may easily result in one point per group). 

The ratio cut can also take the links within the cluster into account. It makes **links (distance) inside the cluster to be stronger (smaller)** as well.

$$\text{RatioCut}(A_1, \cdots, A_k) = \dfrac{1}{2}\sum_{i=1}^{k}\dfrac{\text{cut}(A_i, \bar A_i)}{\lvert A_i \rvert}$$


## Algorithm in steps:
1. Get the adjacency matrix $w$ by $w_{i,j} = \text{sim}(x_i, x_j)$. $\text{sim}$ can be any metrics of similarity. Ususally $0 < w_{i,j} < 1, w_{i,i} = 1$
2. Get the degree matrix $D$ by $D_{i,i} = \sum_{j=1}^n w_{i,j}$ and $D_{i,j}= 0$ for $i \neq j$. $D$ is an diagonal matrix.
3. Get graph Laplacian $L = D - W$ 
4. Get the eigenvectors $v$ and eigenvalues $\lambda$ of $L$, that is, $Lv_i = \lambda_i v_i$
5. Map each point to a lower-dimensional representation based on one or more eigenvalues
6. Based on the new representation, do the grouping. 

Some properties of $L$ are:
1. L is symmetric, because $w$ and $D$ are both symmetric
2. L is PSD (positive semi-definite), i.e. for any vector $x$, $xLx^{T} \geq 0$, because $L = B^{T}B$ where $B$ is the incident matrix$ cite:[wiki](https://en.wikipedia.org/wiki/Laplacian_matrix#Incidence_matrix) [StackExchange](https://math.stackexchange.com/questions/997631/why-is-a-graph-laplacian-matrix-positive-semidefinite)
3. With L begin PSD, it has only non-negative eigenvalues.
4. The multiplicity of the eigenvalue 0 is the number of connected components in the graph

We do the grouping by observing the leaps in eigenvalues. For example,  consider the following graph:


<div class="mermaid" style="text-align:center">
graph LR
    A((A)) -- 0.5 --- B((B))
          C((C))
    D((D)) -- 0.25 --- F((F))

</div>

The laplacian matrix can be computed:

$$L = \begin{bmatrix}
0.5 & -0.5 & 0 & 0 & 0\\
-0.5 & 0.5 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0.25 & -0.25 \\
0 & 0 & 0 & -0.25 & 0.25 \\
\end{bmatrix}
$$

The eigenvectors are

$$\begin{bmatrix}
-\dfrac{\sqrt2}{2} & 0 & 0 & 0 & -\dfrac{\sqrt2}{2}\\
-\dfrac{\sqrt2}{2} & 0 & 0 & 0 & \dfrac{\sqrt2}{2} \\
0 & 1 & 0 & 0 & 0 \\
0 & 0 & -\dfrac{\sqrt2}{2} & -\dfrac{\sqrt2}{2} & 0 \\
0 & 0 & -\dfrac{\sqrt2}{2} & \dfrac{\sqrt2}{2} & 0 \\
\end{bmatrix}
$$

The eigen values are 
$$ [0,0,0,0.5,1]$$


It means we have three connected components in the graph. By choosing the first three dimensions of the eigenvectors (because of the huge leap from 0 to 0.5 in the fourth dimension in eigenvalue), we map the points A-E to a similarity place represented by the vectors. i.e.

$$\begin{bmatrix}
A_{sim}\\B_{sim}\\C_{sim}\\D_{sim}\\E_{sim}
\end{bmatrix}
= \begin{bmatrix}
-\dfrac{\sqrt2}{2} & 0 & 0\\
-\dfrac{\sqrt2}{2} & 0 & 0\\
0 & 1 & 0 \\
0 & 0 & -\dfrac{\sqrt2}{2} \\
0 & 0 & -\dfrac{\sqrt2}{2}\\
\end{bmatrix}
$$



We also find the vectors are grouped by othorgonality naturally.



## Why does it work?
In class the instructor only talked about how to perfrom spectural clustering. I am wondering why it works by using the eigenvectors of the laplacian as a representation, and what it has to do with the loss function?

### Why using eigenvectors?
[ref](https://math.stackexchange.com/questions/3853424/what-does-the-value-of-eigenvectors-of-a-graph-laplacian-matrix-mean)

We can formulate eigenvalue-finding as an optimization problem. Let $A$ be a symmetric matrix. The solution to the optimization problem

$$\min x^TAx \ \ \ \text{  subject to }\lVert x \rVert = 1$$

is the eigenvalue of $A$. If we plugin $Ax = \lambda x$ we have $$x^TAx = \lambda$$


### Why looking at the second smallest eigenvalue?
The second eigenvalue and eigenvector is called Fiedler vector. For a graph laplacian, the smallest eigenvalue is always $0$, with its corresponding eigenvector being $[1,1,\cdots,1]$. So to find a second smallest eigenvalue, we solve the following optimization problem:

$$\min x^TLx\ \ \ \text{  subject to }\lVert x \rVert = 1 ,x_1 + x_2 +\cdots + x_n = 0$$

That is, the vector is normal to the trivial solution. The solution can not a vector with all same components with the constraints. Since $L = B^TB$, we can futher replace it into $x^TB^TBx = (Bx)^TBx$, where $B$ is the incident matrix representing the relationship between edges and vertices. Therefore, it essentially transforms into 

$$\min \sum_{i,j\in E}(x_i - x_j)^2 $$

To minimize this equation, **we need the adjacent vertices (connected by an edge) to have small difference in the $x$ representation.** It goes back to our "grouping" intuition: make adjacent vertices similar and remote vertices dissimilar.

