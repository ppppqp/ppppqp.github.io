---

title:  "Traditional Image Processing"
date:   2021-03-22 21:29:23 +0800
categories: Note ML
toc: true
---


# Traditional Image Processing
## Descriptors and Detectors

A very obvious task we may want to complete is to generate a 3D reconstruction out of several images. Given images of an object from different angles, how can we combine them into one image or 3D model?

An intuitive way is to find the "corresponding" points of the two images. Then, based on the correspondence, we generate a transformation matrix to combine the images.

The task is divded into two naturally.


#### Finding the corresponding points with gradient convolution
It is very expensive to detect the correspondence one point by another, because the image as a matrix is large. We should be able to identify special points with features that may help us match up. For example, it's better to match up two corner points than two edge points than two points on a plane.

To find the corner points, we can utilize the gradient of the image.

Mathematically, gradient is defined as

$$\dfrac{\delta f(x,y)}{\delta{x}} = \lim_{\epsilon\rightarrow 0} \dfrac{f(x+\epsilon,y)-f(x,y)}{\epsilon}$$

Obviously we can't calculate a continuous function of $f$. Nor we can't take $\epsilon$ to 0. In practice, we use $\epsilon = 2$ and align to approximate. In this way, we can take account of both direction(left, right) of the change.

$$\dfrac{\delta f(x,y)}{\delta{x}} =  \dfrac{f(x+1,y)-f(x-1,y)}{2}$$



To find which point has higher possibility of being an edge, we can calculate the gradient $(x', y')$ for each point $(x,y)$. Notice that this gives us a new image. An efficient way to calculate this is to convolute the image with the kernel 

$$\begin{bmatrix}
1 & 0 & -1
\end{bmatrix}$$

and 

$$\begin{bmatrix}
-1 \\
0 \\
1\\
\end{bmatrix}$$

This gives us two images: the gradient on the x-axis and y-axis. We can compute the L-2 magnitude of the two values to generate the composite gradient.

However, in real world, there's serious problem with this: noise. Our output may be seriously blurred by the noise point, as these points, although with no actual meanings, have huge gradients. To get rid of the noise, we can apply a gaussian filter. This filter is to somoothen the surface by taking a weighted average for each point with its surroundings. To make the processing quiker, we can further combine the gaussian filter with the gradient filter(as we discussed above) into one filter, the gradient of gaussian filter, using the property of convolution.


#### Harris Corner Detector
This method with gradient is very unstable with distortion, and can not tell difference between edges and corners.

To improve the model, the notion of sliding window can help. If when we slide the window, there's no change happening, then it's a plane. If sliding in one direction doesn't change while sliding on others changes, then it is an edge. If sliding on all direction make changes, then it is a corner.

To formalize, we can calculate

$$E(u,v) = \sum_{(x,y)\in W}(I[x+u, y+v]-I[x,y])^{2}$$
To simpily the calculation, we can use taylor series.

$$ f(x+d) \approx f(x)+ \dfrac{\delta f}{\delta x}d$$

$$ I(x+u, y+v)\approx I(x,y) + I_{x}u + I_{y}v $$

$$ E(u,v)  = \sum_{(x,y)\in W} I_{x}^{2}u^2+2I_{x}I_{y}uv + I_{y}^2v^2$$

This fomula can be viewed as
$$[u,v]M[u,v]^{T}$$

where $M$ is the second moment matrix. 
$$\begin{bmatrix}
\sum_{x,y\in W} I_{x}^{2} & \sum_{x,y\in W} I_{x}I_{y} \\
\sum_{x,y\in W} I_{x}I_{y} & \sum_{x,y\in W}I_{y}^2 \\
\end{bmatrix}$$

We can compute each term of $M$ for every pixel. It tells us how quickly the image changes and in which directions. To make it clearer, we do the transformation:


$$M = R^{-1}\begin{bmatrix}
  \lambda_1 & 0\\
  0 & \lambda_2\\
\end{bmatrix}R$$

$R$ represents the direction of change, while $\lambda$ represents the amount of change(max and min). Therefore, if $\lambda_1$ and $\lambda_2$ are both small, it is a flat region. If one of them is significantly greater, then it is an edge region. If both are large, it is a corner region.


#### Blob Detection
In the Harris detector we are able to capture corners. However, the this method is not robust to the scaling. If we scale up the image while using the same window, the corner can turn into edges. One way to solve this problem is just to try all scales of the window.

There's better way-Blob Detection. Blob filter can identify the regions that are brighter or darker than the surroundings.

The first derivative of gaussian filter can identify the edges. The second derivative has better property: it can detect the center which is darker or brighter than the surroudings. It is also called Laplacian of Gaussian (LoG). After convolve with LoG filter, we need to find the regional maxima as the edge or corner. However, as we are dealing with different scales, we need to optimize both the parameter of filter size and the maxima region.

To implement the Laplacian, we usually use the difference of gaussian to approximate (DoG).




## Transformation and Fitting


Now we have a set of feature points and correspondance, we need to find a transformation relationship between the two images.

### Fitting to a line
First consider the easiest example, fitting to a line. We have a bunch of points, and we should fit them to a line that makes most sense.

#### Least Squares

The most common version of criteria is the least square of error. That is, to minimize

$$||Y-Xw||^{2}_{2}$$

This fomula minimize the sum of squares of the distance between the actual points and the predicted points.

#### Total Least Squares

Other than calculating the distance between the actual and predicted points, we can also calculate the distance between the point and the predicted line.

Recall point to line distance:

$$\dfrac{n^{T}[x,y]-d}{||n||^{2}} = n^{T}[x,y]-d$$

where $n = [a,b], ||n|| = 1$

The optimization problem is to minimize
$$||Xn-1d||^2$$


#### RANSAC

The above two solutions both have skew in face of the outliers. We introduce a  simpler algorithm that is more robust towards the outliers.

```py
bestLine, bestCount = None, -1
for trial in range(numTrials):
  subset = pickPairOfPoints(data) 
  line = totalLeastSquares(subset) 
  E = linePointDistance(data,line) 
  inliers = E < threshold
  if numberOf(inliers) > bestCount:
  bestLine, bestCount = line, numberOf(inliers)
```