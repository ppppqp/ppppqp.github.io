---
title:  "Matrix Calculus"
date:   2021-09-07 21:29:23 +0800
categories: Note ML
---
[reference1: MIT linear Algebra](https://www.youtube.com/watch?v=oGZK3yGF-6k&list=PL7rilRdYxlDuGCMCzBf7IPak8iO00fjGy&index=1)

[reference2: Youtuber](https://www.youtube.com/watch?v=e73033jZTCI)

[reference3: Matrix Calculus](https://souryadey.github.io/teaching/material/Matrix_Calculus.pdf#:~:text=The%20derivative%20of%20a%20transposed%20vector%20w.r.t%20itself,%28y%20w%20T%20x%29%202%20%3D%20y%202)

In this post, I will introduce the way that I think of matrix calculus, one of the most important concept for linear algebra as well as machine learning.

## 1. What is Derivative?

From my perspective, derivative is the change of A with respect to a small change (perturbation) of B. Mathematically, if $A = f(B)$, $A + \partial A = f(B+\partial B)$, where $\partial A$ and $\partial B$ are small values. If $f$ is derivable, we have a limit value for $\dfrac{\partial A}{\partial B}$ as $\partial B$ approaches 0. The value is called the first derivative of $A$ with respect to $B$.

## 2. Scalar Calculus

In college calculus, we have already explored the scalar calculus thoroughly. I will summerize some rules here so that we can explore the link with matrix calculus.

#### 2.1 Simple Derivative Examples

1. If $f(x) = kx$, then $f^{\prime}(x) = k$
2. If $f(x) = kx^2$, then $f^{\prime}(x) = 2kx$

#### 2.2 Derivative Rules

1. Addition: If $f(x) = g(x) + h(x)$, then $f^\prime(x) = g\prime(x)+h\prime(x)$
2. Multiplication: If $f(x) = g(x) \cdot h(x)$, then $f^\prime(x) = g^\prime(x)h(x) + g(x)h^\prime(x)$


## 3. Matrix Calculus
Matrix calculus is just like scalar calculus, in a more complex form. In scalar calculus, we are only focusing on a problem of $\mathbb{R} \rightarrow \mathbb{R}$. In matrix calculus, we have more situations:

* $\mathbb{R^n}\rightarrow \mathbb{R^m}$
* $\mathbb{R^n\times R^m}\rightarrow \mathbb{R^p}$
* $\mathbb{R^n\times R^m}\rightarrow \mathbb{R^p}\times{\mathbb{R^q}}$

We will talk through them one by one with examples. I expect the trick can be **comprehended** by a "way of thinking", rather than equation memorization.

### 3.1 Scalar by vector

$$ f: \underset{m\times 1}x \rightarrow \underset{1\times 1}{f(x)}$$

Basically, we transform a matrix into a scalar through $f$. The derivative of this type is called **gradient**, denoted as $\nabla_x f$.

$$ \dfrac{\partial f}{\partial x} = \begin{bmatrix}\dfrac{\partial f}{\partial x_1}& \dfrac{\partial f}{\partial x_2} &...&\dfrac{\partial f}{\partial x_m} \end{bmatrix} \\ \nabla_x f = (\dfrac{\partial f}{\partial x})^T$$

Therefore, the gradient is of the same shape as $x$.

We have also learnt gradient in multivariable calculus. Gradient we learnt is a "scalar to vector" concept. If we have a mapping $f \in \mathbb{R}^n \rightarrow \mathbb{R}$, we can also write $y = f(x)$ where $y$ is a scalar and $x$ is an $n$-dimensional matrix.

Then $$\dfrac{\partial y}{\partial x}\in R^{N}$$ the computation method is $$(\dfrac{\partial y}{\partial x})_{i}= \dfrac{\partial y}{\partial x_{i}}$$ How can we justify this? The fundamental definition of gradient is when $x$ changes a small amount, the amount that $y$ changes. So if each item of $x$ changes a small amount, the amount of $y$ change is another vector. Each item in the vector is just $\dfrac{\partial y}{\partial x_{i}}$ , because all items in $x$ are independent

A simple example can be

$$y = ||x||^2$$

If we don't know how to deal with it, the most easy way is to expand it(we take $n=2$ for simplicity):

$$ \begin{align}
    y &= ||\begin{bmatrix}
    x_1\\
    x_2\\
    \end{bmatrix}||^2\\
    &= x_1^2 + x_2^2
\end{align}$$

Therefore, we can write 
$$ \begin{aligned}
    \dfrac{\partial y}{\partial x} &=\begin{bmatrix}
    \dfrac{\partial y}{\partial x_1}\\ \dfrac{\partial y}{\partial x_2}
    \end{bmatrix}\\
    &=\begin{bmatrix}
        2x_1 \\ 2x_2
    \end{bmatrix}\\
    &= 2x
\end{aligned}$$

Actually, you can think of $||x||^2$ as $x \cdot x$, so it echos the behavior of $f(x) = x^2$.
In more general form, we can still do element-wise expansion. As $x^Tx = x \cdot x = \sum_{i=1}^n x_i^2$, we have 

$$\begin{align}
    \dfrac{df}{dx} &= (\dfrac{\sum_{i=1}^n x_i^2}{dx_1}, \dfrac{\sum_{i=1}^n x_i^2}{dx_2},...,\dfrac{\sum_{i=1}^n x_i^2}{dx_n})\\
    &=(2x_1, 2x_2,...2x_n)\\
    &=2x
\end{align}
$$

This expansion method is also applicable to matrix calculus, but we can simplify it with more rules so we don't have to deduce every time.

### 3.2 Vector by Scalar

$$f: \underset{1\times 1}x \rightarrow \underset{n \times 1}{f(x)}$$

In this case, we take a scalar and form into a vector.
$$    \dfrac{\partial f_1}{\partial x}  = \begin{bmatrix}
    \dfrac{\partial f_1}{\partial x}\\\vdots \\ \dfrac{\partial f_n}{\partial x}
\end{bmatrix}$$

Therefore, the derivative is of the same shape as $f(x)$.

### 3.3 Vector by vector

$$f: \underset{m\times 1}x \rightarrow \underset{n \times 1}{f(x)} $$

Then $$ \dfrac{\partial y}{\partial x}\in R^{N\times M}$$ the computation method is $$(\dfrac{\partial y}{\partial x})_{i,j}= \dfrac{\partial y_{j}}{\partial x_{i}} $$ which yields

$$\dfrac{\partial f}{\partial x}=\begin{bmatrix}
    \dfrac{\partial f_1}{\partial x_1} & \cdots & \dfrac{\partial f_1}{\partial x_m}\\
    \vdots & \ddots & \vdots\\
    \dfrac{\partial f_n}{x_1} & \cdots & \dfrac{\partial f_n}{\partial x_m}
\end{bmatrix}$$

The matrix is called Jacobian.

Let's also see an example. consider $f = Ax$ where $A$ is a 2 by 2 matrix and $x$ is a 2 dimensional vector. 

Denote $$\begin{aligned}
    A &= \begin{bmatrix}
        a_{11} & a_{12}
        \\
        a_{21} & a_{22}
    \end{bmatrix}\\
    x &= \begin{bmatrix}
    x_1\\
    x_2\\
    \end{bmatrix}\\
\end{aligned}
$$

We can have
$$ \begin{align}
    y &= \begin{bmatrix}
        a_{11} & a_{12}
        \\
        a_{21} & a_{22}
    \end{bmatrix} \begin{bmatrix}
    x_1\\
    x_2\\
    \end{bmatrix}\\
    &= \begin{bmatrix}
        a_{11}x_1+a_{12}x_2\\
        a_{21}x_1+a_{22}x_2
    \end{bmatrix}
\end{align} $$

We apply our differentiation rule between vectors. It gives us


$$ \begin{align}
    \dfrac{\partial y}{\partial x}  &= \begin{bmatrix}
        a_{11} & a_{12}
        \\
        a_{21} & a_{22}
    \end{bmatrix} = A
\end{align}$$
Which echos $f(x) = kx$


### 3.5 Scalar by matrix

$$f: \underset{n\times n}{X}\rightarrow \underset{1\times 1}{f(X)}$$

$$\dfrac{\partial f}{\partial X} = \begin{bmatrix}
    \dfrac{\partial f}{\partial X_{1,1}} & \cdots & \dfrac{\partial f}{\partial X_{m,1}}\\ \vdots & \ddots & \vdots \\ \dfrac{\partial f}{\partial X_{1,n}} & \cdots &  \dfrac{\partial f}{\partial X_{m,n}}
\end{bmatrix}$$

### 3.6 Matrix by Scalar

$$F: \underset{1\times 1}{x}\rightarrow \underset{p\times q}{F(X)}$$


$$\dfrac{\partial f}{\partial x} = \begin{bmatrix}
    \dfrac{\partial F_{1,1}}{\partial x} & \cdots & \dfrac{\partial F_{1,q}}{\partial x}\\ \vdots & \ddots & \vdots \\ \dfrac{\partial F_{p,1}}{\partial x} & \cdots &  \dfrac{\partial F_{p,q}}{\partial x}
\end{bmatrix}$$

### 3.7 Vector by matrix

$$f: \underset{m\times n}{X}\rightarrow \underset{p\times q}{f(X)}$$

The derivative is a $ p \times n \times m $ tensor. It is the same shape with the $n\times m $ matrix in 3.5, but with $f$ replaced by $F$ (i.e scalar replaced by vector). Therefore, each element in the matrix is a $p$- dimensional vector. 

### 3.8 Matrix by Vector

$$F: \underset{m\times 1}{X}\rightarrow \underset{p\times q}{F(X)}$$

The derivative is a $p\times q\times m $ tensor. It is the same with the $m\times 1$ matrix in 3.1, but with $f$ replaced by $F$ (i.e scalar replaced by matrix). Therefore, each element in the vector is a $p\times q$ matrix.

### Takeaway from Above Analysis
1. The shape of the derivative is **shape of output matrix + shape of input matrix inversed**. For example, the if output matrix is $p\times q$, input matrix is $m \times n$, then the derivative is $p\times q \times n \times m$
2. When considering the structure of matrix derivative, we can consider in the following steps:
   1. Get the shape of the derivative by rule 1
   2. Find a structure with the same $x$ type. Consider replacing $f$ in $\dfrac{\partial f}{\partial x}$ with the current $f$ type. Then recursively do the matrix derivative on $\dfrac{\partial f}{\partial x}$.


### Matrix Transpose

For a matrix, the transpose of the matrix w.r.t itself is the identity matrix. Assume an element $dx_{i,j} $ to be the result of the derivative. We have $dx_{i,j} = \dfrac{dx_{i}}{dx_{j}}$. It is only $1$ if $i=j$, which is the diagonal. Therefore, it is the identity matrix.

Another interesting property is quoted from the third reference.
> The derivative of a transposed vector w.r.t itself is the identity matrix, but the transpose gets applied to everything after.

$$\dfrac{dw^TX}{dw} = X^T$$

I tentitively proved this statement.

$$\begin{align}\dfrac{dw^TX}{dw} &= \dfrac{d(X^Tw)^T}{dw} \\ &=\dfrac{d(X^Tw)^T}{d(X^Tw)}\dfrac{d(X^Tw)}{dw} \\ &= Id \cdot X^T \\ &= X^T\end{align}$$


## General Rules In Summary

* If $f(x) = Ax$, then $f^\prime(x) = A$
* If $f(x) = x^Tx$ then $f^\prime(x) = 2x^T$
* Product rule:
  * $d(AB) = (d A)B + A(d B)$ for general matrix(not commutive)
  * $d(x^Tx) = d x^Tx + x^Td x = (2x^T)d x$ (for vector, dot product commute)
* Transpose:
  * For vectors, $d(u^Tv) = du^T v+u^T dv$ and $du^T v = u^T dv$




## No Need to Expansion to Elements!

When we try to calculate a gradient, one way is a straight forward element-wise differentiation. However, if we are able to transform $df(x)$ into $g(x)d(x)$, we know $g(x)$ is the gradient.

Let's see a simple example (Least square).

$$ \begin{align}
 f(x) &= ||Ax-b||^2 \\
 df(x) &=(Adx)^T(Ax-b) + (Ax-b)^T(Adx)\\
    &=2(A^T(Ax-b))^T dx\\
\dfrac{df(x)}{x} &= 2(A^T(Ax-b))^T\\
\end{align}$$

