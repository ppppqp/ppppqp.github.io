---

title:  "Neural Network"
date:   2021-03-23 21:29:23 +0800
categories: Note CV
toc: true
---

# Neural Networks

## Backpropagation

To compute the gradient of each layer, we can use the backpropagation. The basic idea is to use the numerical gradient from previous layer to compute the gradient of this layer's weight and further propogate backward to the original weight matrix.

$$
\dfrac{\delta f}{\delta x} = \dfrac{\delta q}{\delta y} \dfrac{\delta f}{\delta q}
$$

Explictly, it's the downstream gradient equals local gradient times upstream gradient.


## Vector Derivative

Let's consider three cases:
#### 1. $x\in R, y\in R$
 Then $$\dfrac{\delta y}{\delta x}\in R$$ This is the most common case.

#### 2. $x\in R^{N}, y\in R$
Then $$\dfrac{\delta y}{\delta x}\in R^{N}$$ the computation method is $$(\dfrac{\delta y}{\delta x})_{i}= \dfrac{\delta y}{\delta x_{i}}$$ How can we justify this? The fundamental definition of gradient is when $x$ changes a small amount, the amount that $y$ changes. So if each item of $x$ changes a small amount, the amount of $y$ change is another vector. Each item in the vector is just $\dfrac{\delta y}{\delta x_{i}}$ , because all items in $x$ are independent



#### 3. $x\in R^{N}, y\in R^{M}$
Then $$ \dfrac{\delta y}{\delta x}\in R^{N\times M}$$ the computation method is $$(\dfrac{\delta y}{\delta x})_{i,j}= \dfrac{\delta y_{j}}{\delta x_{i}} $$ The matrix is called Jacobian.


## Matrix Derivative



