---
title:  "Convex Optimization"
date:   2021-11-16 21:29:23 +0800
categories: Note ML MLBasics NLP
---

> Optimize the world.

This blog referred [this material](https://www.stat.cmu.edu/~ryantibs/convexopt-F15/scribes/11-dual-gen-scribed.pdf)


## A Brief Intro

Due to limitation of resources, we are actively seeking optimizations. For exmple, when I hesitate about applying for a master program or dive in the industry after the undergrad, I am trying to my career. As intelligent creatures, We are always optimzing our life essentially.

For some non-constrained convex problems, we can easily find a optimization solution. For example:

$$ \underset{x}{\min}\ f(x) $$

where $f(x) = x^2$ is a easy problem.


## Primal and Dual Problems

For a general optimization problem (primal problem), it is sometimes more difficult to optimize. There's a trick using Lagrangian multipiler to make the problem more approachable.

We formulate a primal problem as an optimization problem with constraints ($m$ inequality constraints, $n$ equality constraints):
 
$$ \begin{aligned}\underset{x}{\min}&\ f(x)\\ \text{subject to}&\ h_i(x) \leq 0, i = 1,\cdots, m \\&\  l_j(x)=0, j=1,\cdots,r \end{aligned}$$

Its Lagrangian is

$$L(x,u,v) = f(x) + \sum_{i=1}^{m} u_ih_i(x) + \sum_{j=1}^{r}v_jl_j(x)$$
where $u\in \mathbb{R}^m, v\in \mathbb{R}^r$. In other words, **we capture each constraint with a slack variable.**

#### Observation 1: $f(x)$ is an least upperbound (supremum) of $\underset{u\leq 0}{L}(x,u,v)$ if constraints are satisfied
We state that $f(x) \geq = L_{u\geq 0}(x,u,v)$ i.e the value of $f(x)$ is always greater than or equal to the value of $L(x,u,v)$ conditioned that $u\geq 0$. The equality is reached when $u_i h_i(x) = 0$ for all $i = 1,\cdots,m$.
**Proof**: 
Since we need $h_i(x) \leq 0$, if $u\geq 0$, $\sum_{i=1}^{m} u_ih_i(x) \leq 0$. 
Since we need $l_j(x) = 0$, $\sum_{j=1}^{r}v_jl_j(x) = 0$
Therefore, $$L(x,u,v) = f(x) + \sum_{i=1}^{m} u_ih_i(x) + \sum_{j=1}^{r}v_jl_j(x) < f(x)$$

#### Observation 2: The optimal value of the primal problem $f^{*}$ is the inferium of the supremum of $\underset{u\leq 0}{L}(x,u,v)$ for all $x$

Consider this step by step. We have already proved that $f(x)$ is the supremum of $\underset{u\leq 0}{L}(x,u,v)$. That means, for any $u\leq 0, v$, the maximal value $L$ can hit is the constrained $f(x)$. Now consider $x$ taking all values. If $x$ satisfies the constraint, $f(x)$ is actually constrained, so $\sup\underset{u\leq 0}{L}(x,u,v) = f(x)$. If $x$ does not satifies the constraint, then there must be one $h_i(x)$ s.t. $h_i(x) < 0 $ or one $l_j(x)$ s.t. $l_j(x) = 0$. We can easily find that  $\sup\underset{u\leq 0}{L}(x,u,v) = \infty$ because we only need to make the corresponding $u_i$ and $v_j$ being $-\infty$ or $\infty$.  


We have successfully proved that $f(x) = \underset{x}{\inf} \underset{u\geq 0, v}L(x,u,v)$. Now we consider the **dual function**:

$$g(u,v) = \underset{x}{inf}L(x,u,v)$$

Note that in the dual form, we consider $g$ as a function of $u$ and $v$. Now $x$ becomes a slack variable that can take any value. The **Lagrange dual problem** associated with this dual function is:

$$\underset{u,v}{\max} g(u,v) \ \text{     subject to    }u\geq 0$$

The optimal value of the dual problem, $g^{*}$ is $\underset{u\geq 0,v}{\sup}\underset{x}{\inf} L(x,u,v)$. The Lagrange dual problem is a **convex optimization problem**, beacuse $g(u,v)$ can be viewed as pointwise infimum of affine function of $u$ and $v$, thus is convave. $u\geq 0$ is an affine contraint. Note that with the dual problem, we only need to **optimize on $u$ and $v$, regardless of what $f$ is**.

### Weak and Strong Duality

The weak duality states that $f^{*} \geq g^{*}$. 

**Proof:**

$$\begin{aligned}
f^{*} &= \underset{x}{\inf}\underset{u\geq 0}{\sup}L(x,u,v)\\
g^{*} &= \underset{u\geq 0,v}{\sup}\underset{x}{\inf}L(x,u,v)
\end{aligned}$$

The statement can be proved by [min-max inequality](https://en.wikipedia.org/wiki/Max%E2%80%93min_inequality)