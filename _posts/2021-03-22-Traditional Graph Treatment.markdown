---

title:  "Traditional Image Processing"
date:   2021-03-22 21:29:23 +0800
categories: Note CV
toc: true
---


# Traditional Image Processing
## Descriptors and Detectors

A very obvious task we may want to complete is to generate a 3D reconstruction out of several images. Given images of an object from different angles, how can we combine them into one image or 3D model?

An intuitive way is to find the "corresponding" points of the two images. Then, based on the correspondence, we generate a transformation matrix to combine the images.

The task is divded into two naturally.

### Finding the corresponding points
It is very expensive to detect the correspondence one point by another, because the image as a matrix is large. We should be able to identify special points with features that may help us match up. For example, it's better to match up two corner points than two edge points than two points on a plane.

To find the corner points, we can utilize the gradient of the image.

Mathematically, gradient is defined as

\[\dfrac{\delta f(x,y)}{\delta{x}} = \lim_{\epsilon\rightarrow 0} \dfrac{f(x+\epsilon,y)-f(x,y)}{\epsilon}\]

Obviously we can't calculate a continuous function of $f$. Nor we can't take $\epsilon$ to 0. In practice, we use $\epsilon = 2$ and align to approximate. In this way, we can take account of both direction(left, right) of the change.

\[\dfrac{\delta f(x,y)}{\delta{x}} =  \dfrac{f(x+1,y)-f(x-1,y)}{2}\]

{% include figure image_path="/assets/images/unsplash-image-10.jpg" alt="this is a placeholder image" caption="This is a figure caption." %}

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

This method with gradient is very unstable with distortion, and can not tell difference between edges and corners.

To improve the model, the notion of sliding window can help. If when we slide the window, there's no change happening, then it's a plane. If sliding in one direction doesn't change while sliding on others changes, then it is an edge. If sliding on all direction make changes, then it is a corner.

To formalize, we can calculate

\[ E(u,v) = \sum_{(x,y)\in W}(I[x+u, y+v]-I[x,y])^{2}\]

To simpily the calculation, we can use taylor series.

