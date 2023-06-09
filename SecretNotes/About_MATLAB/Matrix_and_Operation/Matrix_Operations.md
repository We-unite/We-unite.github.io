﻿## 矩阵运算和操作
### 矩阵的算数运算

+ 在矩阵除法运算中，若A为非奇异方阵，则左除A\B等价于inv(A)×B，右除等价于B×inv(A)，**二者完全不同。**
+ 在标量运算中，a/b与a\b完全等价，**这一点与平常Word不同。**
+ 以上矩阵运算中，矩阵均可为标量。
### 矩阵的点运算

+ 这里的点乘不是矢量内积，是元素对应相乘。
+ 点除是元素对应相除。
+ 点幂是元素分别取幂。
### 矩阵的关系运算

|小于|小等|等于|大等|大于|不等|
|--|--|--|--|--|--|
|<|<=|==|>=|>|~=|

+ 矩阵比较时，对应元素依次按数量关系比较，满足关系为1，否则为0。运算结果为一个由1/0构成的同阶矩阵。
+ 标量和矩阵比较，以标量与每一个元素比较。其他同上。

### 矩阵的逻辑运算

+ 同阶矩阵，元素依次进行逻辑运算；标量与矩阵，标量与矩阵各元素依次运算。
+ 结果为1/0构成的同阶矩阵。

### 矩阵的特殊运算

|行列式|秩|迹|逆|广义逆|
|--|--|--|--|--|
|det|rank|trace|inv|pinv|

### 其他运算
+ 取整
|向下取整|向上取整|四舍五入|截尾取整|
|--|--|--|--|--|
|floor|ceil|round|fix|

+ **截尾取整为向靠近0的方向取整，也就是fix(1.1)=1,fix(-1.1)=-1。**

+ 取模取余。有mod、rem两种函数，略。

+ 矩阵的变维、变向。略。
+ 特征值、范数、条件数。略。