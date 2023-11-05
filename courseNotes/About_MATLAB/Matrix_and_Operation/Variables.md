﻿# MATLAB矩阵及其运算
## 变量
### MATLAB变量命名
+ MATLAB中的所有变量都是用数组和矩阵形式表示的，即所有变量都表示一一个矩阵或一个矢量。命名规则如下:
>(1)变量名由一个字母开始，不能以数字、空格、标点符号等开头，后面可以跟字母、数字、下画线等，但不能包含空格符、标点。例如，Name_ length、student_ age、gender01均是合法变量名，而_get、123name、 @location 等均是非法变量名。
>
>(2)变量名区分大小写，即A和a代表不同的变量。
>
>(3)变量名不能是MATLAB的保留字，如for、end、 while、 if等命令名。
>
>(4)变量名的长度不能超过63位，即不能超过31个字符。
>
>(5)变量名尽量不要和函数名、M文件名相同，否则可能会出现逻辑运行错误。

### 变量的定义与赋值
+ 数字变量直接定义并赋值即可。
+ 字符变量用英文单引号即可。
> y='s'

+ 符号变量（如解方程的未知数等）用sym/syms定义。

> syms z

### 变量类型
#### 基本类型及其函数如下表

|基本类型|类型或声明函数|
|--|--|
| 整型 | (int/uint)+(8/16/32/64) |
| 浮点型 | single/double |
| 逻辑型 | logical |
| 字符型 | char |
| 日期和时间型 | date |
| 结构刑 | struct |
| 元胞型 | cell |
| 符号型 | sym/syms |

#### 整数类

|数据类型名称|表示范围|类型转换函数|
|--|--|--|
| 有符号1字节整数 | -2^7~2^7-1 | int8() |
| 有符号1字节整数 | -2^15~2^15-1 | int16() |
| 有符号1字节整数 | -2^31~2^31-1 | int32() |
| 有符号1字节整数 | -2^63~2^63-1 | int64() |
| 无符号1字节整数 | 0~2^8-1 | uint8() |
| 无符号1字节整数 | 0~2^16-1 | uint16() |
| 无符号1字节整数 | 0~2^32-1 | uint32() |
| 无符号1字节整数 | 0~2^64-1 | uint64() |

#### 浮点类

|数据类型|存储大小|表示范围|类型转换函数|
|--|--|--|--|
| 双精度浮点数 | 4字节 | -1.79769×10308~+1.79769×10308 | double |
| 单精度浮点数 | 8字节 | -3.40282×1038~+3.40282×1038 | single |

+ 特殊的浮点数NaN、INF、空数组[]。

#### 关于复数
+ 直接输入法。
> a=2+4i;

+ 采用函数complex。
> a=complex(2,4);

+ 复数函数

	本部分可以直接参考[MATLAB复数](https://ww2.mathworks.cn/help/matlab/complex-numbers.html)

|函数名|功能描述|
|--|--|
| conj(c) | 求复共轭 |
| real(c) | 求实部 |
| imag(c) | 求虚部 |
| isreal(c) | 数组c均为实数则返回1，否则为0 |
| abs(c) | 求模长 |
| angle(c) | 求幅角 |

### 变量类型转换
```matlab

>> x=int8(20);...    %数值20转为8位整型数据
y=char(90);...    %数值90按照ASCII码值转为对应字符
z=num2str(90);    %数值90转换为字符90
>> x

x =

  int8

   20

>> y

y =

    'Z'

>> z

z =

    '90'


```

+ 同一个数据换用不同格式显示，使用format命令，如：

```matlab

>> a=0.5

a =

    0.5000

>> format short
>> a

a =

    0.5000

>> format rat
>> a

a =

       1/2     

>> format long
>> a

a =

   0.500000000000000

>> format
>> a

a =

    0.5000

```

### 变量的显示命令
+ 一般来说直接输入变量名，回车即可显示；如想紧凑显示具体内容但不输出变量名，使用disp函数如下。

```matlab
>> A1=magic(3);...
disp("这是一个三阶幻方矩阵");...
disp(A1);

这是一个三阶幻方矩阵
     8     1     6
     3     5     7
     4     9     2

```

### 变量的存取
#### 使用命令执行变量存取
+ save实现变量从内盘到硬盘的存储，可指定存储为二进制格式文件过文本格式文件
+ load实现从硬盘到内存的载入
+ 命令使用格式

|命令|格式1|格式2|
|--|--|--|
|load|load 文件名 变量名;|S=load('文件名','格式','变量名');|
|save|save 文件名 变量名;|save('文件名','格式','变量名');|

其中变量均可不止一个，仍用原格式书写即可。

#### 交互方式实现变量存取
+ 工作区中点击变量左边的田字符号选中单个数据；如需选中多个，按住ctrl依次点击即可。
+ 硬盘数据载入内存，点击菜单栏“导入数据”，点击文件载入即可。弹出对话框可选择具体要载入的数据。支持类型有.mat、Excel、图形文件类型、声音文件类型等。

### 变量清除
+ 使用clear命令执行内存（工作区）变量清除。

```matlab

>> a=1;b=2;c=3;    %设置三个变量
>> clear a;    %清除a
>> clear b c;    %清除b,c
>> clear;    %清除所有变量
>> clear all;    %清除所有变量
```