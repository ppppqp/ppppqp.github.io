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

where $T_1$ is the sample group that has the feature and $T_2$ is the sample group that doesn't. For a given group $T$, we want to find the optimal feature that can divide the group such that $gini(T)$ is as low as possible.


Another method to measure the chaosness of a system is through Shannon entropy. The euqation is $$ H(X) = -\sum p_i \log_2(p_i)$$ where $X$ stands for the ramdom variable. Dividing the sample set with a variable $A$ gives us the entropy
$$H_A(T) = \dfrac{S_1}{S_1+S_2}H(X_1) + \dfrac{S_2}{S_1+S_2}H(X_2)$$

To measure the effect of different division, we can calculate the entropy loss, also named "gain".

$$ Gain(A) = H(X) - H_A(X)$$


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