---
title:  "Random Forest"
date:   2021-09-02 21:29:23 +0800
categories: Note ML
---

 > A brief intro on ramdom forest algorithm
## Integrated Model

Integrated Model use a series of weak classifier (base mode) to learn and combine, so that it can achieve better performance than individual model. Common integrating method includes Bagging and Boosting. Bagging is utilized in the Random Forest model introduced in this post. Boosting will be covered in the future in AdaBoost, GBDT, XGBoost, LightGBM.

## Bagging Algorithm

The idea of Bagging is to average across multiple models to decrease estimation error(variance). It is similar to voting. Every weak classifier has a vote. The final result is compliant to the rule of "The minority obeys the majority." Suppose have a big sample pool, which contains 10000 samples. 
1. We first perform **bootstrap sampling** for each model, that is, we randomly pick **n** samples for each model **with return** and form the dataset for that specific base model. Therefore, each sample may appear multiple times in a base model's training dataset. The reason we need bootstrap sampling is to make sure that it produces different weak calssifiers and they are independent with each other.
2. Each model now trains and predicts.
3. The final results is based on the voting on each prediction.


## Boosting Algorithm

The idea of Boosting is to upgrade a weak model to stronger model. While bagging views all models the same, Boosting emphasize on improving the weak ones. The methodology can be summerized into two aspects.

1. Developing voting weights:
Boosting adjusts the voting weights for each model to give credit to models that performs better on training set.

2. Fixing errors:
After each training epoach, Boosting changes the weight of the training set (or probability distribution.) Wrongly predicted samples are given more weights, which means they are more emphasized in the next training epoach.

## Random Forest

Ramdom Forest is a classic Bagging model, which is built on decision trees. It first bootstraps the dataset into $n$ different datasets and based on these datasets, $n$ different decision trees are built. It follows two basic rules:
1. Random Data: Bootstrapping
2. Random Feature: Suppose we have $M$ features for each point, we randomly select $k$ features out wehn building the tree. $k=\sqrt{M}$ for python.

In general, random forest can have higher accuracy and fewer overfitting problem then decision tree.

## Code Implementation

```python
from sklearn.ensemble import RandomForestClassifier
X = [[1,2],[3,4],[5,6]]
y = [0,0,1]
model = RamdomForestClassifier(n_estimators=10, random_state=123)
model.fit(X,y)
model.predict([[5,5]])
```