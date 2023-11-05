# 数据可视化
## 二维数据可视化
+ 无论是离散还是连续，MATLAB都需要计算一组离散自变量的函数值，然后描点连线。可以通过不断减小离散点间距，单纯绘制点；或者在减小离散点间距基础上把点用直线连起来但无论什么方法，图形都有一定误差。
### 基本二维曲线的绘制
+ 二维最常见的是plot函数。采用不同形式输入有不同功能。
#### plot(y)
+ y可以是适量、实矩阵、复矢量。y为矢量则横坐标为矢量索引（各个数分别下标是几）；y为实矩阵则绘制y的列矢量对其坐标索引的图形；y为复数矢量则相当于绘制plot(real(y),imag(y))。
#### plot(x,y)
+ x,y均可为矢量或矩阵，其中有三种组合用于绘制曲线图。均为矢量，绘制y对x的图形；x为n维矢量，y为m×n或n×m矩阵，绘制m条曲线，以矢量x为曲线公共横坐标；均为m×n矩阵，绘制n条不同色曲线，绘制为以x,y对应列向量构成的图的集合。

### 绘图辅助操作
#### 颜色、标记和线型
+ 未指定上述类型，默认实线线型。

|颜色|符号|
|--|--|
| 蓝色 | b |
| 绿色 | g |
| 红色 | r |
| 青色 | c |
| 洋红 | m |
| 黄色 | y |
| 黑色 | k |
| 白色 | w |

|标记|符号|
|--|--|
| 点 | . |
| 圈 | O |
| 叉 | × |
| 加 | + |
| 星 | * |
| 方形 | S |
| 菱形 | D |
| 上三角 |  |
| 下三角 |  |
| 左三角 | < |
| 右三角 | > |
| 五角星 | p |
| 六角星 | h |

|线型|符号|
|--|--|
| 实线 | - |
| 虚线 | -- |
| 点线 | : |
| 点画线 | -. |

#### plot命令可设定的属性
|属性|解释|
|--|--|
| LineStyle | 线型 |
| LineWidth | 线宽 |
| Color | 颜色 |
| MarkerType | 标记点的形状 |
| MarkerSize | 标记点大小 |
| MarkerFaceColor | 标记点内部填充色 |
| MarkerEdgeColor | 标记点边缘色 |

### 坐标轴标注和范围设置
#### 坐标轴标注
+ 以x轴为例，y/z同之。
```matlab
xlabel('x','FontName','楷体','FontSize',16);
```
+ 可以只写变量标注，不写字体名称和大小。默认11号正常粗细。
+ 指定时需要先写单引号，里面是要指定的条件值，后边跟写指定为什么。具体参考上例。
+ 关于哪些可以指定，直接参考help。

#### 坐标轴范围设置
+ 可以使用xlim/ylim/zlim函数。使用方式`xlim([-3,3])`，指定范围-3~3。诸如此类。
+ 其余范围指定函数不赘。

#### 绘图方式
|绘图方式|特点说明|语句|
|--|--|--|
| equal | 横纵轴单位长度相等 |axis equal|
| tight | 图的四个边界与曲线边界相抵 |axis image tight|
| normal | 正常画图 |axis normal|
| xlim/ylim | 限定坐标轴范围 |（与其他三个搭即可，不需要语句）|

+ 使用时在plot和文字标注如xlabel、title之后写语句即可。

#### 背景、标题、文本设置
+ MATLAB默认背景灰色。
+ 背景色设置有如下几种方式。
  + `figure('Color',colorvalue)`。其中`'Color'`为表示语句，照抄；`colorvalue`为RGB三元组，是一个由[0,1]中的三个数构成的三元行向量。
  + `set(gcf,'color','w')`。其中只要改变`'w'`即可。单引号内部改为由上表指定的颜色表示符号。
+ 标题是所绘图形的说明。
  + `title('string')`;
  + `title('s1','s2')`，s1主标题，s2副标题。
  + 标题字体字号颜色均与坐标轴标注相同。详情就去help。
  
#### 图例标注
+ 在多个不同曲线绘制时需要使用图例标注`legend`函数。
+ `legend('string1','string2',……);`
+ `legend(……,'location',location);`
+ 其中string1/string2分别标注对应绘图过程中先后生成的曲线。`'location'`可以为一个1×4矢量（[left bottom width height])，也可以为任意字符串。如果使用MATLAB指定的位置定位则不需要更改。详情请help。
+ 例程：

```matlab
x=-pi:pi/20:2.5*pi;
y1=cos(x);
y2=sin(x);
figure
plot(x,y1,'-ro',x,y2,'-.b');
legend('y1','y2','location','northwest');%左上角位置
figure
plot(x,y1,'-ro',x,y2,'-.b');
legend('y1','y2','location','northeast');%左上角位置
figure
plot(x,y1,'-ro',x,y2,'-.b');
legend('y1','y2','location','best');%重叠最小处
figure
plot(x,y1,'-ro',x,y2,'-.b');
legend('y1','y2','location','bestoutside');%绘图区外占用最小面积
```

### 多图叠绘、双纵坐标、多子图
#### 多图叠绘
+ 使用hold on/off。
+ grid on/off控制是否显示坐标网线。

#### 双纵坐标绘制
+ 使用plotyy函数。

|格式|说明|
|--|--|
| plotyy(x1,y1,x2,y2) | 绘制两条曲线，分以左右为纵轴 |
| plotyy(x1,y1,x2,y2,fun) | 曲线类型由fun指定 |
| plotyy(x1,y1,x2,y2,fun1,fun2) | 两曲线类型分别为fun1,fun2 |

+ MATLAB官方不建议使用plotyy，建议使用yyaxis。
+ yyaxis一般例程如下：

```matlab
x = linspace(0,10);
y = sin(3*x);
yyaxis left
plot(x,y)

z = sin(3*x).*exp(0.5*x);
yyaxis right
plot(x,z)
ylim([-150 150])
```
+ yyaxis也可以改变两侧颜色、分别题写标签、每一侧绘制多组数据等。具体自己去help。

#### 多子图绘制
+ 使用subplot函数。常见格式如下：

|格式|说明|
|--|--|
| subplot(m,n,p) | 将图形窗口分为m×n个窗口，在第p个窗口创建子图 |
| subplot(m,n,p,'replace') | 若在绘制图形时第p个窗口已有坐标系则删除，用新坐标系取代 |
| subplot(m,n,p,'align') | 对齐坐标轴 |
| subplot('position',[left bottom rright height]) | 在指定位置创建新的子图，并将其设为当前坐标轴，4个参数均采用归一化设置，范围[0,1]，左下角为（0,0) |

+ 例程如下：

```matlab
x=linspace(0,2*pi,200);
y=sin(x);
subplot(2,2,1);
plot(x,y);
y=2.*sin(2.*x).*cos(x);
subplot(2,2,2);
plot(x,y);
y=sin(x)./cos(x);
subplot('position',[0.2 0.05 0.6 0.4]);
plot(x,y);
```

```matlab
x=linspace(0,2*pi,200);
y=sin(x);
subplot(2,2,1);
plot(x,y);
y=2.*sin(2.*x).*cos(x);
subplot(2,2,2);
plot(x,y);
y=sin(x)./cos(x);
subplot(2,1,2);
plot(x,y);
```

### 特殊二维图形绘制
+ 请参考[二维图和三维图](https://ww2.mathworks.cn/help/matlab/2-and-3d-plots.html?s_tid=CRUX_lftnav)。此略。
