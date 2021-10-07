---
title:  "Perceptron"
date:   2021-09-30 21:29:23 +0800
categories: Note ML MLBasics
---

> An indepth discussion of perceptron algorithm

## What is Perceptron?

A perceptron is essentially a linear binary classifier. Given a vector $x$ as input, the perceptron algorithm outputs the class it belongs by doing a linear transformation on it and inspect the result. Specifically, a perceptron is defined by a parameter vector $\theta$. It make predictions using the function
$$ \text{sign}(\theta x) $$

<div class="mermaid">
graph LR
    A --> B((B))
     
</div>


## A Little History

The name "perceptron" is pretty cool. It sounds like an element in the brain, giving an intuition of artificial intelligence.
TBD

## Concepts 


### Hyperplane

The perceptron always gives a linear classification boundary, or a **Hyperplane**. 
> Definition: A hyperplane in $\mathbf{R}^d$ can be specified by parameter vector $\bar\theta \in \mathbf{R}^d$ and offset $b \in \mathbf{R}$. It is the set of points $\bar x\in \mathbf{R}^d $   s.t.   **$ \bar \theta \cdot \bar x + b = 0$**

In 1D space, a hyperplane is a dot on the axis. In 2D space, a hyperplane is a line. In 3D space, hyperplane is a plane.

### Linear Classifier

We can utilize a hyperplane as a linear classifier by applying it to a signify function.

$$ h(\bar x; \bar \theta) = \text{sign}(\bar \theta \cdot \bar x) $$

where $\theta$ specifies the hyperplane, $x$ is the input. There are two ways we can think of it. 

1. The signed distance from $\bar x$ to the hyperplane $\bar \theta$ is given by $\dfrac{\bar x \cdot \theta}{\lVert  \theta \rVert }$. Therefore, the difference in $ \text{sign}(\bar \theta \cdot \bar x)$ signifies that $x$ locates at the different side of the hyperplane.

2.  Mathematically, $\bar \theta$ is a normal vector to the hyperplane. Therefore, the difference in $ \text{sign}(\bar \theta \cdot \bar x)$ also signifies that $x$ is at sharp angle or obtuse angle with the normal vector.

{% include figure image_path="/assets/images/ML/decision_boundary.png" alt="this is a placeholder image" caption="Linear Classifier" %}

## Perceptron Algorithm

So how can we find such a hyperplane that correctly classifies points? Here the perceptron algorithm is introduced.

On input $S_n = \{(\bar x^{(i)}, y^{(i)})\}^n_{i=1}$

Initialize k = 0, $\bar \theta^{0}$ = 0, which stands for the hyperplane before the first iteration.<br>
    While there exists a misclassified point<br>
        for i = 1 ... n<br>
            if $y^{i}(\bar \theta^{(k)}\cdot \bar x^{(i)})\leq 0$<br>
                **$\bar \theta^{(k+1)} = \bar \theta^{(k)} + y^{(i)}\bar x^{(i)}$**<br>
                k++

Several things to notice:
1. We initalize $\theta$ to be 0
2. We loop while there's still misclassified point
3. We update the hyperplane using $\bar \theta^{(k+1)} = \bar \theta^{(k)} + y^{(i)}\bar x^{(i)}$

The perceptron is actually a type of single layer neural network. It has a weigt indicated by $\theta$ and an activation function of $\text{sign}$. It updates based on a single misclassified point at a time and will always moves the hyperplane in the right direction. 

### Intuition

How does $\bar \theta^{(k+1)} = \bar \theta^{(k)} + y^{(i)}\bar x^{(i)}$ work? Say if  $y^{(i)} (\bar \theta^{(k)} \cdot \bar x^{(i)}) < 0$, then adding a term will make it closer to positive:

 $$y^{(i)} (\bar \theta^{(k)} + y^{(i)}x^{(i)}\cdot \bar x^{(i)})= y^{(i)} (\bar \theta^{(k)} \cdot \bar x^{(i)}) + y^2 \lVert\bar x^{(i)}\rVert^2$$

The perceptron algorithm will **always** find a feasible solution as long as the data is linearly separable. If it doesn't, it will loop forever.

### Perceptron With Offset

All our previous analysis is based on the fact that the hyperplane(decision boundary) pass through the origin. It doesn't have to. If it does not, the model is called pereptron with offset. Now we are describing a hyperplane with a pair $(\bar \theta, b)$. Therefore, given training examples, we are looking at whether $y^{(i)} (\bar \theta^{(k)} \cdot \bar x^{(i)} + b) < 0$ for all $i$. How do we learn $\theta$ and $b$ in this case?

A brilliant idea is, we can just view $b$ as an added dimenson of $x$ and apply the perceptron without offset in the new $x^\prime$ space.

$$
\begin{aligned}
 \bar \theta \cdot \bar x + b &= 0\\
 \begin{bmatrix}
     \theta_1\\
     \theta_2\\
     \vdots\\
     \theta_d
 \end{bmatrix}
  \begin{bmatrix}
     x_1\\
     x_2\\
     \vdots\\
     x_d
 \end{bmatrix} 
 +b &=0\\
  \begin{bmatrix}
    b\\
     \theta_1\\
     \theta_2\\
     \vdots\\
     \theta_d
 \end{bmatrix}
  \begin{bmatrix}
        1\\
     x_1\\
     x_2\\
     \vdots\\
     x_d
 \end{bmatrix} 
 &=0\\  
\end{aligned}$$

What we are essentially doing is mapping the current space to a higher dimension where we are able to separate with a linear classifier. In the figure below, the points are not able to classify in a 2D space with a linear classifier without offset. However, if we map it to a 3D space simply by adding a dimension with constant 1, we are able to find a 3D hyperplane(the plane with green) that both passes the origin and correctly classifies the points. Also note that the intersection line of the hyperplane and the x1-x2 plane is the corresponding linear classifier with offset in 2D, which is exactly what we are trying to find. Thanks for Prof.Kutty in UM for this great illustration.

{% include figure image_path="/assets/images/ML/percept_offset.png" alt="this is a placeholder image" caption="Mapping" %}


## Non-linearly Separable Data

All the above analysis is built on the assumption that the data is linearly separable. If it is not, the perceptron algorithm loops forever. We need a different approach in finding the classifier.

As the data is impossible to classify neatly(all data correctly classified), we need a way to evaluate our solution. In other words, if all classifiers are bad, we need to define which one is worse than the other. We approach this using the concept of a loss function.

A loss function is basically a metric to evaluate the model and also the objective to optimize on. For the linearly separable data and the perceptron we just descussed, the loss function is actually
$$\mathcal{L}(\theta) = \max(\mathbb{I}(\text{sign}y^{(i)}\neq \text{sign}(\theta x^{(i)}))) $$ for all $i$. It means as long as there is one point that is misclassified, the loss is greater then 0. We obviously can not optimize on this loss function. By contrast, we optimize upon **hinge loss**: $$\mathcal{L}(\theta)= \dfrac{1}{n}\sum_{i=1}^{n} \max((1-y^{(i)})(\theta \cdot x^{(i)})),0)$$

{% include figure image_path="/assets/images/ML/hinge_loss.png" alt="this is a placeholder image" caption="hinge loss" %}

The feature of hinge loss is:
1. It can identify how bad the prediction is.
2. It forces the prediction to be more than a little correct(with 1 being the threshold rather than 0).

So how can we find a way to optimize upon hinge loss?

### Gradient Descent

We can optimize using gradient descent. The algorihm is 

---

k = 0, $\theta^{(0)} = 0$

While convergence criteria is not met

$$\theta^{(k+1)} = \theta^{k} - \eta\nabla_{\theta}\mathcal{L}(\theta)\lvert_{\theta = \theta^k}$$

---

It is low at efficiency, as it needs to calculate the gradient of loss for all points. In practice, we can update the $\theta$ as soon as we have calculate the loss and gradient of loss for one point. It is called Stochastic Gradient Descent.


---
k = 0, $\theta^{(0)} = 0$

While convergence criteria is not met

$$\theta^{(k+1)} = \theta^{k} - \eta\nabla_{\theta}\mathcal{L}(y^{(i)}(\theta \cdot x^{(i)}))\lvert_{\theta = \theta^k}$$

---

In the hinge loss case, $$\nabla_{\theta}\mathcal{L}(y^{(i)}(\theta \cdot x^{(i)})) = y^{(i)x^{i}}$$

### Convergence Criteria

There are several choices of convergence criteria:

1. When $\mathcal(L)$ is small enough
2. When $\nabla_{\theta}\mathcal{L}$ is small enough
3. When $\theta$ don't change
4. When maximum iterations reached.

1 and 2 is not recommended because the computation complexity.

### SGD vs GD
SGD is more easily to converge, but also more sensitive to step size. If the step size is not proper, it may never converge to minimum but oscilating.