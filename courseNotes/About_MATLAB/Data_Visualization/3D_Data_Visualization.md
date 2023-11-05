## 三维数据可视化
### 三维曲线绘制
+ 使用plot3函数。与plot函数类似。其关于线型、颜色和数据点等的定义与二维相同。例程如下：

```matlab
sita=linspace(0,10*pi,200);
x=3*cos(sita);
y=3*sin(sita);
z=sita/pi;
plot3(x,y,z,'-r.');
axis equal;
xlabel('x','FontName','楷体','FontSize',16);
ylabel('y','FontName','楷体','FontSize',16);
zlabel('z','FontName','楷体','FontSize',16);
title('螺旋线','FontName','楷体','FontSize',16);
```
+ 多曲线也可以按照`plot3(x1,y1,z1,...,x2,y2,z2,...,x3,y3,z3,...)`同时绘制，与plot类似。

### 三维网格绘制
+ 绘制三维曲线或曲面的网格图，使用`mesh`函数。可以画出某区间内完整的曲面。

|格式|说明|
|mesh(z)|以z的列和行下标为x,y的自变量绘制网格图。
|mesh(x,y,z)|x,y为自变量矩阵，z为建立在x,y上的函数矩阵|
|mesh(x,y,z,c)|c用于指定矩阵z在各点的颜色|

+ x,y长度m,n，则z应当为m×n矩阵。
+ MATLAB提供内置函数用于mesh绘图，如peaks/sphere。
	+ 例如，peaks函数返回高斯分布的数值范围，其中x,y范围为[-3,3]。

```matlab
[x,y,z]=peaks(30);
mesh(x,y,z);
```

+ mesh函数有变种meshc/meshz。
	+ meshc函数绘制曲面的同时，在曲面下方绘制等高线。
	+ meshz增加边界绘图功能。

### 三维曲面绘制
+ 三维曲面使用surf函数。
	+ surf与mesh区别主要在于mesh为单纯的网格线条，surf则是对各网格内部也填充颜色，使之成为曲面状。
+ surf也有变种函数。
	+ surfc也会在底面绘制等值线。
	+ surfl在绘制时考虑了光照效果。
	+ surfnorm根据x,y,z定义各处法线，在绘制时一并绘制其法向量。

### 准四维图形绘制
+ 由三个维度坐标共同决定其标量值，定义域为整个三维空间，即此处所谓准四维图形。
+ 可以理解为三维上的数量场。
+ 使用slice函数绘制。用颜色表示函数值。

### 特殊三维图形绘制
+ 圆柱。使用cylinder函数。

```matlab
[x,y,z]=cylinder;%r=h=1的圆柱体坐标，圆周默认取20个点。
[x,y,z]=cylinder(r);%r=r,h=1的圆柱体坐标，圆周默认取20个点。
[x,y,z]=cylinder(r,n);%r=r,h=1的圆柱体坐标，圆周取n个点。
```

+ 球体。使用sphere函数。

```matlab
sphere;%生成单位球，上下分20环，每环20段，共400个面。
sphere(n);%生成单位球，有n×n个面。
[x,y,z]=sphere(n);%与上相同。不画图，只返回值，需要surf/mesh单独绘制。
```

+ 瀑布。使用waterfall函数。具体情况自己画一个就知道了。

```matlab
[x,y,z]=peaks(30);
waterfall(x,y,z);
```