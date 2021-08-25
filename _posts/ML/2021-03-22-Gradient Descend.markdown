---

title:  "Gradient Descent"
date:   2021-03-22 21:29:23 +0800
categories: Note ML
toc: true
---


# Gradient Descent

## Gradient Descent

Once we make clear of our loss function, we are actually faced with the problem of how to optimize it. Gradient descend is a way to find the optimization.

The basic idea is at each step, move in the direction of negative gradient. 


### Batch Gradient Descent

The first version of gradient descent is called Batch Gradient Descent. We update $W$ by taking all the points into consideration.

$$L(W) = \dfrac{1}{N}\sum_{i=1}^{N}L_{i}(x_{i}, y_{i}, W)+ \lambda R(W)$$

$$\nabla_{W} L(W) = \dfrac{1}{N}\sum_{i=1}^{N}\nabla_{W} L_{i}(x_{i}, y_{i}, W)+ \lambda \nabla_{W} R(W)$$

However, this method is very insufficient because computing the loss function of N terms is expensive.

### Stochastic Gradient Descent (SGD)

We improve the above method by using minibatch of examples rather than all of them. "Stochastic" stands for randomness.


### SGD + Momentum

What if the loss function has a local minimum or saddle point? SGD gets stuck.

We can use SGD+ Momentum to avoid getting stuck at the local minimum. Basically we do not only consider the local gradient, but also the momentum of the descending.

SGD:
$$x_{t+1} = x_{t} - \alpha \nabla f(x_{t})$$

SGD+Momentum

$$v_{t+1} = \rho v_{t} + \nabla f(x_{t})\\
x_{t+1} = x_{t}-\alpha v_{t+1}
$$


We choose $\rho$ to be 0.9 to 0.99 commonly.


### Adam

There's another way to improve the method: currently we are using the same learning rate for all parameters(directions). However, it's better if we use bigger learning rate if the gradient is small and smaller learning rate if the gradient is big. This can make the gradient fall faster in the direction with small descent, rather then going back and forth.

