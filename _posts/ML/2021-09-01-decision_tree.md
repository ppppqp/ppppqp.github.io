---
title:  "Decision Tree"
date:   2021-09-01 21:29:23 +0800
categories: Note ML
---

## Background

The model makes a decision with a series of if/else inference.

The theory of building a decsision tree includes the concept of *gini index*. It is used to calculate the level of chaos in a system. The greater gini index is, the more chaos the system is. The caluculation equation is 
$$ gini(T) = 1-\sum p_i^2$$ 

where $p_i$ is the frequency of type $i$ sample in the sample set.

We can get more insights by some examples.

case | #types | frequencies| Gini
---|---|---|---
1  | 1 | type1: 1| 0
2  | 2 | type1: 0.99 <br> type2: 0.01 | 0.0198
3  | 2 | type1: 0.5 <br> type2: 0.5 | 0.5
4  | 3 | type1: 0.5 <br> type2: 0.25 <br> type3: 0.25 | 0.625

Therefore, it is able to see that the more homogeneous the sample set is(less type, more difference between types), the less gini index is.

Applying this concept to building a decision tree, we can think of a feature that separates the sample set into two types: type with and without the feature, whose case number denoted as $S_1$ and $S_2$. We can then calculate the gini index with regard to sample group $T$.

$$gini(T) = \dfrac{S_1}{S_1+S_2}gini(T_1) + \dfrac{S_2}{S_1+S_2}gini(T_2)$$



## Informatio Gain
Another method to measure the chaosness of a system is through Shannon entropy. The euqation is $$ H(X) = -\sum p_i \log_2(p_i)$$ where $X$ stands for the ramdom variable. Dividing the sample set with a variable $A$ gives us the entropy
$$H_A(T) = \dfrac{S_1}{S_1+S_2}H(X_1) + \dfrac{S_2}{S_1+S_2}H(X_2)$$

To measure the effect of different division, we can calculate the entropy loss, also named "gain".

$$ Gain(A) = H(X) - H_A(X)$$


## Algorithm Details
The basic steps of calculating the information gain w.r.t a feature $x$ is the following.
1. Clarify the possible values of $x \in \{x_1, x_2, \cdots, x_n\}$
2. Clarify the possible values of $y \in \{y_1, y_2, \cdots, y_m\}$
3. For each possible value of $x$, calculate
   $$H(y \vert x=x_i)=\sum_{j=1}^{m}P(y=y_j\vert x=x_i)\log_2P(y=y_j\vert x=x_i)$$
   that is, the information entropy of given the info that $x = x_i$. Notice that we sum over all possible value of $y$. Also notice that we use base 2 log.
4. Get the weighted sum of all conditional entropy, which is essentially the expectation.
   $$H(y \vert x) = \sum_{i=1}^{n}P(x=x_i)H(y \vert x=x_i)$$


 The algorithm is the same no matter which metric we choose. It is a greedy approach:

 1. start with an empty tree
 2. split on the best feature
 3. recurse


We stop recursing when one of the following criteria are met:
1. When all records have the same label
2. If all records have identical features
3. If all attributes have zero Information gain


{% include figure image_path="/assets/images/ML/learn_DT.png" alt="this is a placeholder image" caption="decision tree algorithm" %}


The third criterion is possibly not a good idea because it ignores the potential feature interactions.

x1 | x2| y
---|---|---
1 | 1 | 0
1 | 0 | 1
0 | 1 | 1
0 | 0 | 0

The xor function has zero information gain for either x1 or x2

$$\begin{aligned}
H(y \lvert x1) &= \dfrac{1}{2}(P(y=0 \lvert x=1) \log P(y=0 \lvert x=1) + P(y=1 \lvert x=1) \log P(y=1 \lvert x=1)) \\
&+ \dfrac{1}{2}(P(y=0 \lvert x=0) \log P(y=0 \lvert x=0) + P(y=1 \lvert x=0) \log P(y=1 \lvert x=0)) \end{aligned}$$

As $x_1$ also split the data evenly , all the probabilities are $1/2$, which means no information gain. However, if we split on x1 first, we can see strong correlation between x2 and y.


## Code Implementation

### Classifier
```python
# Decision Tree Classifier for Discrete varaible
from sklearn.tree import DecisionTreeClassifier
X = [[1,2],[3,4],[5,6],[7,8],[9,10]]
Y = [1,0,0,1,1]
model = DecisionTreeClassifier(random_state = 0)
model.fit(X,Y)
print(model.predict([[5,5]]))
```

### Regressor
```python
# Decision Tree Regressor for continuous variable
from sklearn.tree import DecisionTreeRegressor
X = [[1,2],[3,4],[5,6],[7,8],[9,10]]
Y = [1,2,3,4,5]
model = DecisionTreeRegressor(random_state = 0)
model.fit(X,Y)
print(model.predict([[5,5]]))
```
### Visualization

```python
from sklearn.tree import export_graphviz
import graphviz
import os
os.environ['PATH'] = os.pathsep+r'some/path' # add the bin directory of Graphviz into PATH
dot_data = export_graphviz(modl, outfile=None, class_names=['0','1']) # transfer decision tree model into string and assign to dot_data
graph = graphviz.Source(dot_data) # transfer to visualization mode
graph.render('result.pdf') # output visualization result.
```