---
title:  "Naive Baysian Model"
date:   2021-09-05 21:29:23 +0800
categories: Note ML
---
Naive Baysian model is based on the Baysian Equation:

$$ P(A|B) = \dfrac{P(B|A)P(A)}{P(B)} $$

Let's consider an example. Say we want to know if someone cough, the probability that he caught a cold. Suppose we know the probability of catching a cold is 0.4, and the probability of coughing while catching the cold is 1. What's the probability of someone catching the cold if he/she coughs?

$$P(catching cold| coughing) = \dfrac{1 * 0.4}{0.8} = 0.5$$

The problem is we don't know the probability. We can only estimate it from the dataset.


## Naive Baysian in 1D

Suppose we have five samples.

|cough($X_1$)| cold($Y$)|
|---|---|
1 | 1
1 | 1
0 | 1
1 | 1
1 | 0

$$P(Y=1|X_1=1) = \dfrac{P(X_1 = 1|Y=1)P(Y=1)}{P(X_1=1)} = \dfrac{3/4 \times 4/5}{4/5} = 3/4$$

Therefore, the probability we estimate is $3/4$


## Naive Baysian in 2D

Now we add another feature, headache. Our feature vector now become a 2-dimensioanl vector

|cough($X_1$)| headache($X_2$) | cold($Y$)|
|---|---|---|
1 |1| 1
1 |1| 1
0 |1| 1
1 |0| 1
1 |1| 0

The problem become the probability that if someone cough and headache($X_1=1, X_2=1$), what is the probability that he/she gets cold.

The equation we use is $P(Y|X_1, X_2)=\dfrac{P(X_1,X_2|Y)P(Y)}{P(X_1,X_2)}$. It is hard to deal with $P(X_1,X_2|Y)$, so we make an assumption that the two feature is **independent**, that is, $P(X_1,X_2|Y)P(Y)=P(X_1|Y)P(X_2|Y)$. Now we can safely plugin the values by the observed value.


## Code Implementation

```python

from sklearn.naive_bayes import GaussianNB

X = [[1,2],[3,4],[5,6],[7,8],[9,10]] # feature vector
y = [0,0,0,1,1] # target value

model = GaussianNB()
model.fit(X,y)

print(model.predict([[5,5]]))
```