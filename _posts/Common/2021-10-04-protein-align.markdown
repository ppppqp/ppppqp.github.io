---
title:  "Dynamic Programming: Protein Alignment Algorithm"
date:   2021-09-26 21:29:23 +0800
categories: Note Bioinformatics common
---


> This blog will introduce Needleman–Wunsch algorithm and Smith–Waterman algorithm for protein sequence alignment.

[Ref-global](https://www.youtube.com/watch?v=ipp-pNRIp4g)
[Ref-local](https://www.youtube.com/watch?v=lu9ScxSejSE)
[Ref-sjss](https://www.cs.sjsu.edu/~aid/cs152/NeedlemanWunsch.pdf)


## Types of Alignment

We can divide protein alignment into two types: global alignment and local alignment. The global alignment tries to align the complete sequence with each other. The local alignment, in contrast, align regions that have high similarities. Therefore, the global alignment is more suitable for closely related sequences while the local alignment is more suitable for divergent sequneces. Common global alignment algorithm is called Needleman–Wunsch algorithm. The local alignment algorithm is called Smith-Waterman algorithm.

|  | Global | Local
|---|---|---|
Target| Whole sequence alignment | Sub sequence alignment
Senario | Similar sequence | Divergent sequence 
Algorithm | Needleman–Wunsch | Smith-Waterman

## Problem Setup

Given two protein sequences, we need to find the best match residue pairs in the sequences.

When I was given the problem, it first occurred to me this question:


1. What are the rules for matching?
2.  How do you define an optimal alignment? Length of the longest match? Number of matching residues? Fewest gap?

I will answer these two questions in this section.


### 1. What are the rules for matching?
Rules of matching includes:
1. The order of each residue in each sequence is preserved(no cross alignment).
2. A gap(residue to nothing) is allowed
3. Mismatch is allowed
4. Gap to gap match is NOT allowed.


### 2. How do you define an optimal alignment?

We need a scoring scheme for alignment. Say we have +1 for match, -1 for mismatch and 0 for gap. Then given two sequences ATGGCGT and ATGAGT, we can do two types of alignments:

re is



## Substitution Matrix
### Simple Substitution Matrix
We can exploit the above example more by  capturing the scoring sheme in a matrix.

| |C | T|A |G |
|--|--|--|--|--|
C|1 |-1 | -1| -1|
T|-1| 1| -1| -1|
A| -1| -1| 1| -1|
G| -1| -1| -1| 1| 

As shown in the matrix, we specify the score for each pair of residue in the matrix. If they are the same, then the score is 1. If not, then the score is -1. However, we can make it better.

### Better Substitution Matrix

Sometimes we value one kind of residue mismatch over another. In DNA sequence matching, A, G are purines while T, C are pyrimidines. From the evolution standpoint, pruines/pyrimidines mutation is less likely to occur than purines/purines and pyrimidines/pyrimidines mutation. We can capture this characteristics in the substitution matrix.


| |C | T|A |G |
|--|--|--|--|--|
C|2 |1 | -1| -1|
T|1| 2| -1| -1|
A| -1| -1| 2| 1|
G| -1| -1| 1| 2| 

## Gap Intuition

So far we haven't considered gap. Gap is formed when a residue is inserted or dropped during the evolution. Conventionally we set the cost of gap to be several times larger then the penalty of mutation. It is because the gap 

* Interrupts the entire polymer chain
* In DNA shifts the reading frame

The insertion of the first gap is strongly disfavored. The upcoming gaps in the same chunk, once the first one is formed, are more easy to happen. 

For example, A--TGTAGT is roughly the same as A---GTAGT, but A-GTGAGT is significantly infavored compared with ATGTGAGT. Also, ATG-AGT-AGT is less favored compared wiht ATGTAG--AGT, as the second one happens in a chunk.

Now, with the scroing scheme for matched, mismatched and gap pairs, we can calculate the score for each alignment. Now our goal is to find the optimal alignment that maximizes the score.

## Dynamic Programming

Using brute force to solve such alignment problem will cause overwhelming  computation complexity. We will utilize a technique called dynamic programming to solve this problem. 

The idea of dynamic programming is to find the optimal solution of the problem by finding the optimal solution of sub-problems.

### The Needleman-Wunsch algorithm


#### Intro
We can convert the alignment problem into constructing an optimal matrix. Specifically, the two axis of the matrix are two input residue sequences respectively. For example, if we want to align ATGATG and AGTATGT, we will have such a matrix D
| | A| T| G| A| T|G|
|-|--|--|--|--|--|--|
 A|
 G|
 T|
 A|
 T|
 G|
 T|

This matrix will record our optimal solution for the sub problem. For example, 
D[0:i,0:j] is the optimal alignment for the first i residues in the first sequence and first j residues in the second sequence. We then only need to think of how we extend the optimal solution for the sub problem to the global problem.

Intuitively, we have three types of operations when we are doing alignment. We can either match two residue, make a gap in the first sequence or make a gap in the second sequence. If we already know the optimal solution for D[0:i,0:j], the way we extend it to D[0:i+1, 0:j+1](i.e, we are adding a residue to the both sequence) is to consider the impact of those three operations and find the optimal one. To achieve that, we only need to look at four cells.


Mathematically, it is 

$$
    D[i, j]= \max \left\{
    \begin{aligned} % \begin{eqnarray}好像也可以。
    D[i-1,j-1] + s(x_i, y_j)\\
    D[i-1,j] + g\\
    D[i, j-1] + g
    \end{aligned}
    \right.
$$

where $x_i$, $y_j$ is the type of residue at i, j position for two input sequence. $g$ is the cost of gap. $s(x_i, y_j)$ computes the cost for $x_i$, $y_j$ to align. Intuitively the equation means, if we know the optimal alignment of D[i-1,j], D[i, j-1] andD[i-1, j-1], the optimal for D[i,j] is formed by either 
1. take a gap on the first sequence: $D[i-1, j]+g$
2. take a gap on the second sequence: $D[i, j-1]+g$
3. Make a mismatch or match $D[i-1,i+1] + s(x_i, y_j)$

#### Step walk-through

1. Initialize the matrix by filling the "first" row and column with $-g * index$. For example, if $g=10$, then $D[0,i] = D[i,0] = 10i$
   
| | | A| T| G| A| T|G|
|-|--|--|--|--|--|--|--|
| | 0| -10 | -20 | -30 | -40| -50 |-60|
A|-10|
G|-20|
T|-30|
A|-40|
T|-50|
G|-60|
T|-70|

2. We compute the rest of the cells with the transition equation.

$$
    s(x_i,y_j)\left\{
    \begin{aligned} % \begin{eqnarray}好像也可以。
    1 \ x_i=y_j\\
    -1 \ x_i\neq y_j
    \end{aligned}
    \right.
$$

| | | A| T| G| A| T|G|
|-|--|--|--|--|--|--|--|
| | 0| -10 | -20 | -30 | -40| -50 |-60|
A|-10|1 | -9|  
G|-20|-9| 0 |
T|-30|
A|-40|
T|-50|
G|-60|
T|-70|

3. We trace back the alignment by following which direction of maximum we chose for each cell.

| | | A| T| G| A| T|G|
|-|--|--|--|--|--|--|--|
| | 0| -10 | -20 | -30 | -40| -50 |-60|
A|-10| diag | left|  
G|-20| top | diag |
T|-30|
A|-40|
T|-50|
G|-60|
T|-70|


### The Smith-Waterman algorithm

It is quite similar to the previous section, except for a few details:

property| Smith-Waterman | Needleman-Wunsch
|---|---|---|
Initializatioin| set zero | set gap penalty
Scoring | max(0, score) | score
Traceback | From the max score to 0 score | from bottom-right to top-left
