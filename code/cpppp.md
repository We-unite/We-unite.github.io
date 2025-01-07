# 第二章

- 在 C++中，`main`函数括号中使用`void`关键字表明拒绝任何参数，而空括号表示对是否接受参数保持沉默。
- 连续赋值将从右向左进行。
- 输出拼接长字符串可以如下书写：

```cpp
    //当代码很长而追求风格的时候，这样操作。
cout << "1234567"
     << "7654321"
     << endl;
```

- 类描述了一种数据类型的全部属性（包括可用其来执行的操作），对象是根据这些描述创建的实体。

# 第三章

- 数据输入/常数可以以十进制、十六进制、二进制书写。

```cpp
#include <iostream>
using namespace std;

int main()
{
    int a = 10, b = 0xf, c = 0b10100;
    cout << a << b << c << endl;
    return 0;
}
```

- `cout`提供控制符以八进制、十进制与十六进制显示整数。

```cpp
#include <iostream>
using namespace std;
int main()
{
    using namespace std;
    int chest = 42;
    int waist = 42;
    int inseam = 42;
    cout << "Monsieur cuts a striking figure !" <<endl;
    //所有设置，在更改之前将会一直延续
    //默认显示十进制
    cout << "chest = " << chest << "(decimal for 42 ) " << endl;
    cout << hex; // 显示十六进制
    cout << "'waist = " << waist <<"(hexadecimal for 42)" << endl;
    cout << oct; // 十进制
    cout << "inseam = " << inseam <<: " (octal for 42 ) " << endl;
    return 0 ;
}
```

- 通用字符名

> ISO 10646，Unicode 与 UTF-8 的那些事

- 常量定义，建议使用<kbd>const</kbd>限定而非<kbd>#define</kbd>，且必须在定义时赋值，否则即乱码数字，后续无法修改。
- 浮点数赋值直接赋，不认识后缀 f
- `auto`声明，自动根据初始值类型推断变量类型。

# 第四章

## 数组

- 数组创建，数组大小必须为常量，不能是变量。
  - 数组是一种复合类型，是依托于其他类型来创建的（C 称之为派生，而 C++对类关系使用派生这一术语）
- 数组初始化，如果在定义时仅对一部分元素初始化，则其他元素将被设置为 0

## 字符串

- 拼接字符串常量。字符串过长时允许拼接字符串字面值。
  - 任两个由空白分隔符（空格、`\t`、`\n`）分割的字符串常量都会被自动拼接为一个。
- <kbd>get</kbd>与<kbd>getline</kbd>，二者使用方式基本相同，只是前者继承 cin 的特性，不会读取换行符后再从字符串中删除，而是把换行符留在输入队列中。

```cpp
/*在没有任何参数的情况下
 *cin.get()会读取下一个字符，即使是换行符
 *因此可用以清空*/
cin.get(name , ArSize);// read first line
cin.get();// read newline
cin.get(dessert. Arsize ) ;// read second line
//前两行可以合并为：
//cin.get(name, ArSize).het()
```

- 其他类型字符的使用
  - <kbd>wchar_t</kbd>
  - <kbd>char16_t</kbd>
  - <kbd>char32_t</kbd>
- C++<kbd>string</kbd>提供字符串翻转函数。

## 结构体

- 结构体初始化
  - 按声明顺序将列表声明为结构体初始化
  - 指定对应初始化
  - 构造函数初始化

```cpp
#include <iostream>
using namespace std;

struct student
{
    int id;
    string name;
    short scores[3];
    void student(int id,string name,short scores[])
    {
        this->id=id;
        this->name=name;
        for(char i=0;i<3;i++)
        {
            this->scores[i]=scores[i];
        }
    }
};

int main()
{
    student a={2021110884,"QJGZ",150,150,150};
    strdent b={.id=2021110884,.name="陈一豪",.scores={150,150,150}};
    student c(2021110884,"QJGZ",{150,150,150});

    return 0;
}
```

> 注意，前两种方法不能使用在有构造函数的结构体中，否则会报错“指示符不能用于非聚合类型”。
>
> 对于所有非聚合类型，不能使用初始化列表（即用列表形式初始化，前两种方法是也）。
>
> 聚合类型定义如下：
>
> - 数组
> - 不包含（构造函数、private 和 protect、基类、虚函数）的类、结构体和联合体

## 共用体

举例：一个小商品目录，一些商品 id 为字符串，另一些为数字：

```cpp
union id
{
    long id_num;
    char id_str[32];
};
struct good
{
    char brand[20];
    int type;
    id id_val;
};
```

同时，有匿名共用体：

```cpp

struct good
{
    char brand[20];
    int type;
    union
    {
        long id_num;
        char id_str[32];
    }
};
```

匿名共用体没有自己的名称，成员将成为位于同一位置的不同变量，被视为上一级的成员。

## 枚举

**啥 JB 东西，看不懂！！！**

## 指针

- <kbd>int\*</kbd>被理解为一种复合类型而存在，但<kbd>int\* a, b</kbd>被解释为一个指针和一个整型

> 哪个 TM 大聪明的主意？

### 指针、数组与指针算术

指针与数组基本等价的原因在于指针算数和 C++内部处理方式。

算术：

- 整型变量递增+1，指针变量递增加的是指向的类型的字节数。**这同时表明，C++将数组名解释为地址。**
- 可以以相同的形式使用指针与数组名。
  - 方括号数组表示
  - 加偏移量而后解引用
- 注意：
  - **数组名直接取地址为整个数组作为内存块的地址，递增时加的是整块大小**
  - **数组名本身是首个元素的地址，递增时加的是元素大小**
  - 二者初值相同

## 变量存储方式

- 局部存储
- 静态存储
  - 定义为全局变量
  - 使用<kbd>static</kbd>关键字，如<kbd>static int c=3; </kbd>
- 动态存储

## 数组替代

- <kbd>vector</kbd>
  - 分配在自由存储区或堆中。
  - 功能强大，效率略低
- <kbd>array</kbd>
  - 长度固定如数组，和数组一样分配在栈上而非自由存储区，因而效率同于数组，但更方便安全。

```cpp
#include <array>
using namespace std;

int main()
{
    array<int,5> a;
    int i;
    for(i=0;i<5;i++)
    {
        cin>>a[i];
    }
    for(i=0;i<5;i++)
    {
        cout<<a[i];
    }
    return 0;
}
```

# 第五章

## 递增递减运算符

- 写在后边，则变量先使用，再加/减
- 写在前边，则变量先加/减，再使用
- 避免使用不完整的表达式

```cpp
    //完整的表达式
    i=0
    while(i++<10)
    {
        cout<<i<<endl;
    }
    /*在上例中，先执行判断，而后递增，再输出，因而输出结果为[1,10]
     *这是因为i++<10本身是一个完整表达式
     */

    //不完整表达式
    y=(4+x++)+(6+x++);
    /*上式中，(4+x++)并不是一个完整表达式，无法保证执行完本处计算后x即刻+1
     *因而整条语句结果并不确定
     */

```

> 解释：
>
> - 副作用指计算表达式时对某些东西进行了修改
> - 顺序点指程序过程中一个点，在这里将在进入下一步之前对所有副作用进行评估。
>
> 在 C++中，语句的分号是一个顺序点，在下一步之前会把所有副作用造成的修改弄到位。
> 上例中，前者即有顺序点，执行之前就完成了副作用；后者顺序点在分号，因而副作用结果并不确定。

本身即为运算表达式，有返回值，返回值即上所谓“使用”。

### 指针与递增递减

递增递减作用不赘。

前缀递增递减与解引用运算优先级相同，因而从内向外解释：

```cpp
    int a[2]={1,2},*pt=a;
    cout<<*++pt<<*(++pt)<<endl;
    //输出结果，二者相等，即*++pt先执行递增，而后经过顺序点，再解引用，实际为a[1]=2
```

后缀递增递减优先级高于解引用，因而\*pt++结果与上亦同。

## 逗号运算符

逗号运算符允许把两个表达式放一行，表达式的值是后半句的值。

> 普通赋值运算式的值为右值。

```cpp
#include<iostream>
using namespace std;
int main()
{
    int a;
    a=1,2;
    cout<<a<<endl;//输出1，2不起作用
    a=(1,2);
    cout<<a<<endl;//输出2
    return 0;
}
```

## 循环

<kbd>for</kbd>循环与<kbd>while</kbd>循环的本质是相同的：

```cpp
for(init-expression; test-expression; update-expression)
{
    statements
}

//等价于下述表达
init-expression;
while (test-expression)
{
    statements;
    update-expression;
}
```

区别：

- 在<kbd>for</kbd>循环中省略测试表达式时默认为 true，而<kbd>while</kbd>中禁止此种行为
- 在循环体中有<kbd>continue</kbd>语句时，二者表现不再完全等价，稍有不同

## 循环与文本输入

- 逐个读取字符需要检查遇到的每个字符包括空格、制表、换行等非显示字符。此时应当使用<kbd>cin.get()</kbd>函数。
- 函数<kbd>cin.get(ch)</kbd>读取输入中的下一个字符（包括空格）并赋值给 ch，可以替换<kbd>cin>>ch</kbd>。

## 文件尾（EOF）条件

### 重要性

- 很多操作系统（包括 Unix、Linux 和 Windows 命令提示符模式）都支持重定向，允许用文件替换键盘输入。

> 例如，假设在 Windows 中有一个名为 gofish.exe 的可执行程序和一个名为 fishtale 的文本文件，则可以在命令提示符模式下输入下面的命令：
>
> gofish < fishtale
>
> 来实现以文本文件代替输入。

- 很多操作系统都允许通过键盘来模拟文件尾条件。
  - 在 Unix 中，可以在行首按下 Ctrl+D 来实现；
  - 在 Windows 命令提示符模式下，可以在任意位置放 Ctrl+Z 和 Enter。
  - 有些 C++实现支持类似的行为，即使底层操作系统并不支持。

> 键盘输入的 EOF 概念实际上是命令行环境遗留边倒下来的。
>
> 然而：
>
> - 用于 Mac 的 Symantec C++模拟了 Unix，将 Ctrl+D 视为仿真的 EOF
> - Metrowerks Codewarrior 能够在 Macintosh 和 Windows 环境下识别 Ctr1+Z
> - 用于 PC 的 Microsoft Visual C++、Borland C++ 5.5 和 GNU C++都能够识别行首的 Ctrl+Z，但用户必须随后按下回车键。
>
> 总之，很多 PC 编程环绕都将 CtrI+Z 视为模拟的 EOF，但具体细节（必须在行首还是可以在任何位置，是否必须按下回车键等）各不相同。

- 如果编程环境能识别 EOF，则既可以使用重定向文件输入也可以用键盘，岂不美哉？

### 实现

检测到 EOF 后，cin 将两位(<kbd>eofbit</kbd>与<kbd>failbit</kbd>)均设置为 1。（可通过成员函数<kbd>bool cin.eof()</kbd>和<kbd>bool cin.fail()</kbd>查看情况，且是在读取之后查看。）

# 第六章

## 逻辑运算符相关

- 逻辑与/或的优先级均低于关系运算符
  - 逻辑与的优先级高于逻辑或
- 逻辑非的优先级高于所有关系运算符和算术运算符，因而要对表达式求反必须括起来。
- 另一套表示方式

| 运算符 | 另一种表示 |
| ------ | ---------- |
| &&     | and        |
| \|\|   | or         |
| !      | not        |

## 字符函数库

cctype(C 语言中的 ctype.h)可以用来确定字符是否为大/小写字母、数字、标点等。其优点在于更简单、更通用（字母、数字之类在不同的编码方式之下不一定都像 ASCII 中一样的连续分布）。包含的函数如下：

```cpp
namespace std {
    int isalnum(int c);
    int isalpha(int c);
    int isblank(int c);
    int iscntrl(int c);
    int isdigit(int c);
    int isgraph(int c);
    int islower(int c);
    int isprint(int c);
    int ispunct(int c);
    int isspace(int c);
    int isupper(int c);
    int isxdigit(int c);
    int tolower(int c);
    int toupper(int c);
}
```

# 第七章

## 基础知识

- 函数原型：说明函数名、形参类型/名称、返回值类型
  - 其实就是`main()`之前的函数声明
  - 函数原型中的函数特征标（参数列表）可以省略标识符（形参名称）而只是指出其类型

> ~其实就是那个二锅头，兑的那个白开水~

- 函数定义：函数的本体实现

## 函数与数组

```cpp
//函数定义
int sum_arr(int arr[], int n);//对数组中元素求和

//函数调用
int a[10]={……};//一堆破数
int sum=sum_arr(a,10);
```

以上定义的函数，**第一个形参是指针而非数组**，但可以当做数组使用。

**原因：**C++与 C 一样，将数组名视为指针，指向第一个元素地址，对应元素大小为单个元素大小，详前。(相比之下，<kbd>&a</kbd>虽然也是指向首地址，但大小是整块数组的大小。)因而第一个形参实际是<kbd>int\* arr</kbd>，即定义应当为：

```cpp
int sum_arr(int* arr, int n);
```

这证明两种形参声明同时正确。**在 C++中，<kbd>int\* arr</kbd>与<kbd>int arr[]</kbd>当且仅当出现在函数头或函数原型的时候，含义才相同**。它们都意味着 arr 是一个<kbd>int\*</kbd>。

## 使用数组区间的函数

> 屁话一堆，无非就是给定首尾元素的指针为形参，在中间作妖罢了。不说也罢。

## 指针与 const

### 将 const 用于指针

- 指针指向`const`常量，防止修改
- 传参将指针本身声明为常量，防止修改指针指向的位置，但可以修改内容

优点：

- 避免无意见修改数据导致错误
- <kbd>const</kbd>可使函数能处理 const 与非 const 实参，否则只能接收后者。

```cpp
//只能防止修改pt指向的值，但pt本身可以改成新地址
int age=39;
const int* pt=&age;
int sage=80;
pt=&sage;//是可以的，不会出问题

//下面两个是有区别滴，仔细看
int sloth=3;
const int* ps=&sloth;//指向const int类型的指针
int* const finger=&sloth;//指向int的const指针
//前者如上例，不能修改内容，但能重新指向
//后者则不能重新指向，但可以修改内容
```

## 二维数组作参数

```cpp
int sum(int (*arr)[4], int size);
//等价于以下
int aum(int arr[][4], int size);

//不能声明为
int sum(int *arr[4], int size);
```

**之所以不能声明为最后一个，是由于第一个形参应当是指向数组的指针，而不是单纯的二重指针。**上述两个可用原型都指出，第一个形参类型实际上是指向 4 个元素的数组的指针。我之困惑于此也久矣，今乃得闻。

基于此，则传参之后仍可以二维数组待之，其原因为<kbd>arr[i]</kbd>被解释为<kbd>\*(arr+i)</kbd>，是第 i 个数组，则<kbd>arr[i][j]</kbd>被解释为第 i 个数组的第 j 个元素，即为二维数组。

## 返回 C 风格字符串

听起来很扯淡，对吧？返回值怎么可能是数组类型？内部声明的数组在退出的时候不是就释放了吗？

那么，有没有一种可能，我是说可能，内部用<kbd>new</kbd>申请一段空间给<kbd>char\*</kbd>，然后写完了返回，在主函数中用完了在<kbd>delete</kbd>呢？

## 函数指针

为了实现函数指针，必须要完成：

- 获取函数的首地址
  - 方法很简单，直接使用函数名即可。

> 如<kbd>think()</kbd>是一个函数，则<kbd>think</kbd>就是该函数地址。要作为参数传递，必须传递函数名。**要区分传递的是函数名还是函数返回值哦！**

- 声明一个函数指针
  - 声明一般指针需要说明指向的类型，函数指针也一样。这就是说，声明应指出函数的返回类型及其特征标（参数列表）。
- 使用函数指针来调用函数

例程如下：

```cpp
#include <iostream>
#include <string>
using namespace std;

bool hello(string name)
{
    cout << "Hello, " << name << endl;
    return true;
}

int main()
{
    // 函数指针
    bool (*pf)(string);
    // 函数参数为string型，返回值bool，指针名称pf。

    /* 上例是将<kbd>(*pf)</kbd>替代了<kbd>pam</kbd>，也就是说
     * <kbd>(*pf)</kbd>是函数
     *从而<kbd>pf</kbd>是函数指针。
     */

    /* 为提供正确的运算符优先级，应当用括号将`*`与`pf`括起来
     * 括号优先级高于`*`，从而：
     * <kbd>*pf(string)</kbd>意味着<kbd>*pf(string)</kbd>是返回指针的函数
     * <kbd>(*pf)(string)</kbd>意味着<kbd>pf</kbd>是指向函数的指针
     */

    // 赋值
    pf = hello;

    // 调用
    cout << pf("World") << endl;
}
```

我又要骂人了，这什么东西，类型声明这么复杂？不用了不用了，享受不来。

没事，C++11 还有个特性叫<kbd>auto</kbd>，不是么？

上边的例程可以被改写成如下形式：

```cpp
#include <iostream>
#include <string>
using namespace std;

bool hello(string name)
{
    cout << "Hello, " << name << endl;
    return true;
}

int main()
{
    //函数指针
    auto pf = hello;
    // 调用
    cout << pf("World") << endl;
}
```

~~这自动推断类型，多是一件美逝了！~~让我们一起说，**谢谢<kbd>auto</kbd>！**

另外，如果有若干函数返回类型和特征标都相同，都需要调用的话，何不考虑一下函数指针数组呢？更进一步地，为什么不选择创建一个指向整个函数指针数组的指针呢？

```cpp
#include <iostream>
using namespace std;

// 没错，函数原型可以不写形参名称的
// 假设这段代码之外我们有函数的具体定义
const double *f1(int);
const double *f2(int);
const double *f3(int);

int main()
{
    // 定义一个指向函数的指针
    const double *(*p[3])(int) = {f1, f2, f3};
    // 定义一个指向指针的指针
    auto pp = &p;

    // 直接调用函数指针数组
    cout << p[0](1) << endl;
    cout << p[1](2) << endl;
    cout << p[2](3) << endl;

    // 调用指向指针数组的指针
    cout << (*pp)[0](1) << endl;
    cout << (*pp)[1](2) << endl;
    cout << (*pp)[2](3) << endl;
    return 0;
}

const double *f1(int i)
{
    static double d = 1.1;
    return &d;
}

const double *f2(int i)
{
    static double d = 2.2;
    return &d;
}

const double *f3(int i)
{
    static double d = 3.3;
    return &d;
}
```

# 第八章

## 内联函数

内联函数是 C++为提高程序运行速度而做的一项改进。**常规函数与内联函数区别不在于编写方式，而在于 C++编译器如何将它们组合到程序中。**要了解它们的区别，必须深入到程序内部。

编译过程的最终产品是可执行程序，由一组机器语言指令组成。运行程序时，操作系统将指令载入内存，因而每条指令都有其特定的内存地址。计算机随后一一调用执行，或者有时候向前/向后跳转到特定地址，如循环、条件判断、分支语句等。

常规函数调用也是一个跳转，在此过程中，程序首先将跳转后需要执行的指令的地址压栈，并将现在的寄存器中参数复制到堆栈（为此保留的内存区），跳转到目标函数的地址，执行该函数，在遇到返回指令时，返回地址出栈，程序跳转到该地址，然后将参数复制回来，从而使原来的函数继续进行。

而内联函数的编译代码是与其他程序的代码“内联”的，换言之，编译器将使用内联函数的代码替换掉此处的函数调用，直接 copy 进来了。由于缺少了复制和跳转的过程，因而执行速度较快，但同时占据更多内存，调用几次该函数，该函数代码就被抄写几份。使用过程中需要综合考虑是否使用内联函数。

**要使用内联函数，必须采取下列措施之一：**

- 在函数原型前加关键字<kbd>inline</kbd>
- 在函数定义前加关键字<kbd>inline</kbd>

程序员做出内联请求时，编译器不一定同意（p.s.到底是我写代码还是编译器写代码？气抖冷！），它可能认为函数过大或者注意到有递归（众所周知，内敛这个形式不能递归的），或者有些编译器没有启用或实现内联这一功能。

```cpp
#include <iostream>
using namespace std;

// 这是一个内联函数
inline double square(double x)
{
    return x * x;
}

int main()
{
    double a, b;
    double c = 13.0;

    a = square(5.0);
    b = square(4.5 + 7.5); // 可以传递表达式

    cout << "a = " << a << ", b = " << b << endl;
    cout << "c = " << c;
    cout << ", c squared = " << square(c++) << endl;
    cout << "Now c = " << c << endl;
    return 0;
}
```

输出结果为：

> a = 25, b = 144
>
> c = 13, c squared = 169
>
> Now c = 14

输出表明，内联函数与普通函数一样，按值传递参数，参数为表达式则传递表达式的值。

C 语言中也可以像这样，不写函数原型，直接以函数定义充当函数原型。

## 内联的原始实现：C 中的<kbd>#define</kbd>

```c
#include <stdio.h>
#define square(x) x*x

int main()
{
    double a, b, c = 3, d;
    a = square(5.0);
    b = square(4 + 5);
    d = square(c++);
    printf("a = %lf\nb = %lf\nd = %lf\n", a, b, d);
    return 0;
}
```

这并不是通过传递参数实现，而是通过文本替换实现的——`x`是“参数”的符号标记。

上例只有`a`输出正确，可以用括号进行改进：

```c
#define square(x) ((x) * (x))
```

即使如此，后两者依然输出错误，即无法实现按值传递。所以，使用内联函数应当尽可能考虑使用 C++的内联，而不是 C 的宏。

## 引用变量

### 引用变量是什么？能吃吗？

引用变量是已定义变量的一个别名。话不多说，上例程。

```cpp
#include <iostream>
using namespace std;
int main()
{
    int n = 0;
    int &r = n;
    r = 1;
    cout << "n = " << n << endl;
    cout << "Addr r is " << &r << endl;
    cout << "Addr n is " << &n << endl;
    return 0;
}
```

运行结果如下：

```
n = 1
Addr r is 0x7ffce76ff48c
Addr n is 0x7ffce76ff48c
```

由结果可知，**r 只是 n 的一个别名，在修改 r 的时候实质上就是在修改 n。二者的地址是相同的。**

**请注意：**

- 例程第 6 行的`&`并非取地址符，而是将 r 声明为一个<kbd>int&</kbd>型的变量；而在第 9/10 行的`&`则是取地址符。
- 引用变量必须在声明的时候进行初始化，一旦初始化，即宣誓效忠，至死不渝，是无法改变的。换言之，<kbd>int &r = n</kbd>是<kbd>int* const *pr = n</kbd>的一个封装表示而已。

### 引用变量作函数参数

在 C/C++一般的函数调用中，参数都是按值传递，即 copy 一份送到调用函数里使，即使做出了更改也不会直接影响原函数里的值，除非用返回值将其返回。有时候一个函数本来有自己需要返回的东西，又想把这个量修改了，就不好办了（用<kbd>pair</kbd>或者结构体，多少有点麻烦，还要为此创建一个类型）。这时候就可以考虑引用变量。

### C-风格字符串作 string 对象引用参数

```cpp
#include <iostream>
using namespace std;

const string &fuck(string &s1, const string &s2)
{
    s1 = s2 + s1 + s2;
    return s1;
}
int main()
{
    string s1 = "Hello";
    cout << fuck(s1, ", World!\n") << endl;
    return 0;
}
```

程序可以接受将 C-风格字符串赋值给<kbd>string&</kbd>。

首先，<kbd>string</kbd>类定义了<kbd>char\*</kbd>到<kbd>string</kbd>的转换，因而可以使用字符数组初始化字符串；

其次，类型为 const 引用的形参有一个属性：**在形参与实参不匹配但可以转换的时候，程序会创建临时变量进行匹配，然后传参过去。**换言之，程序调用之前创建一个临时<kbd>string</kbd>，把引用传递过去。

### 对象、继承和引用

**使得能将特性从一个类传递给另一个类的语言特性称为继承。**继承的另一个特性是，基类引用可以指向派生类对象而无需进行强制转换。这种特性的实际结果为，派生类中可以定义一个以基类引用为参数的函数，调用该函数时，既能以基类为参数，也可以派生类为参数。

以<kbd>ofstream</kbd>与<kbd>ostream</kbd>为例，前者为派生类，后者为基类，因为前者建立在后者基础之上。派生类继承了基类的方法，这意味着<kbd>ofstream</kbd>可以使用<kbd>ostream</kbd>的特性，如格式化方法和输出运算符；参数类型为<kbd>ostream&</kbd>的函数既可以接收<kbd>ostream</kbd>对象（如 cout），也可以接收已经声明的<kbd>ofstream</kbd>对象为参数。

### 何时使用引用

使用引用参数的原因：

- 能修改调用函数的数据对象
- 通过传递引用而非整个数据对象，提高运行速度。

当数据对象较大（如结构体、类对象），第二个因素占主要，这也是使用指针的原因，因为引用实际上是指针的另一个接口。

什么时候使用指针、什么时候使用按值传递呢？
对于使用传递的值而不作修改的：

- 数据量小，按值传递
- 是数组，指针传递，这是唯一办法，并将指针声明为指向 const 的指针
- 数据对象是较大的结构体，使用 const 引用或 const 指针
- 是类对象，使用 const 引用

对于修改调用函数数据的函数：

- 修改的是内置数据类型，使用指针
- 是数组，就只能用指针
- 是结构体，用指针或引用
- 是类对象，用引用

## 函数多态

函数多态是 C++在 C 基础上增加的功能。

- 默认参数允许以不同数目的参数调用同一函数
- 重载允许使用多个同名的函数。

### 默认参数

默认参数指函数调用中省略实参时自动使用的实参值。

```cpp
// 一个使用默认参数的例子
#include <iostream>
using namespace std;
int add(int a, int b = 1, int c = 2)
{
    return a + b + c;
}
int main()
{
    cout << add(5) << endl;       // 8
    cout << add(5, 6) << endl;    // 13
    cout << add(5, 6, 7) << endl; // 18
    return 0;
}
```

**对于带参数列表（有形参）的函数，必须从右向左添加默认值，即所有有默认值的形参必须在所有无默认值形参的右边。使用时，传递的实参被从左到右依次赋给形参，而不得跳过任何形参。**

### 函数重载

函数重载指可以有多个同名函数，它们**以参数列表（形参，不包括返回值类型）为区别**。C++使用上下文来确定要使用的重载函数版本。

```cpp
//一个函数重载示例程序
#include <iostream>
using namespace std;

int add(int a, int b)
{
    return a + b;
}

double add(double a, double b)
{
    return a + b;
}

int main()
{
    cout << add(1, 2) << endl;
    cout << add(1.1, 2.2) << endl;
    return 0;
}
```

> 仅当在函数执行基本相同的任务而使用不同的数据类型时，才适合重载
>
> 重载虽好，可不要贪杯哦~

## 函数模板

函数模板是通用的函数描述，使用泛型来定义函数，其中的泛型可用于指定的具体类型（即<kbd>int</kbd>/<kbd>double</kbd>等）替换。通过将类型作为参数传递给模板，可使编译器生成该类型的函数。

> 少扯淡，一个代码就明白了

```cpp
//一个使用函数模板的历次
#include <iostream>
using namespace std;

template <typename T>
T max5(T a[])
{
    T max = a[0];
    for (int i = 1; i < 5; i++)
        if (a[i] > max)
            max = a[i];
    return max;
}

int main()
{
    int a[5] = {1, 2, 3, 4, 5};
    double b[5] = {1.1, 2.2, 3.3, 4.4, 5.5};
    cout << max5(a) << endl;
    cout << max5(b) << endl;
    return 0;
}
```

第一行指出，要建立一个模板，类型命名为 T。关键字<kbd>template</kbd>和<kbd>typename</kbd>是必须的，但可以使用关键字<kbd>class</kbd>替代<kbd>typename</kbd>>。另外，必须使用尖括号。类型名可以随意写。

函数模板本身并不创建任何函数，只是告知编译器如何定义函数，由编译器探明和处理，各自按照模板新建一个函数。因而，函数模板不能缩短可执行程序，在上例中最终仍然是两个独立函数，并无函数模板。但模板的好处在于使生成多个同类型函数更简单可靠。

常见用法为**将模板放在头文件中，在需要使用的地方包含头文件**。

### 模板重载

模板满足了对不同类型使用同一种算法函数的需求，但并非所有类型都是用完全相同的算法。为满足此种需求，可以像重载常规函数一样重载模板定义，仍然需要满足参数列表不同便是了。

```cpp
template<class T>//一个模板
void swap(T &a,T &b);

template<class T>//另一个模板
void swap(T* a,T* b,int n);
```

### 模板的局限性

模板局限性在于很可能无法处理某些数据类型。如赋值，一般类型赋值直接赋值即可，但数组则不可以；比较大小，一般数据类型可以直接比较，结构体则不行。

### 具体化与实例化

**又是什么 JB 东西，似乎有用但似乎用处不大，先放着吧。**

### 编译器选择哪个函数版本

对于函数重载、函数模板和函数模板重载，C++需要一个定义良好的解析策略来确认调用哪一个函数定义，尤其是有多个参数的时候。此过程称为重载解析。

- 创建候选函数列表，包含所有与被调用函数同名的函数与模板
- 使用候选函数列表，根据实参来创建可行函数列表
- 确定是否有最佳的可行函数，有则使用，无则报错。优先级如下：
  - 完全匹配，但**常规函数优先于模板**
  - 提升转换（<kbd>char</kbd>/<kbd>chort</kbd>--><kbd>int</kbd>，<kbd>float</kbd>--><kbd>double</kbd>）
  - 标准转换（<kbd>int</kbd>--><kbd>char</kbd>，<kbd>long</kbd>--><kbd>double</kbd>）
  - 用户定义的转换，如类声明中定义的转换。

> 完全匹配时，允许某些无关紧要的转换，如下表。
>
> | 实参                | 形参                    |
> | ------------------- | ----------------------- |
> | Type                | Type&                   |
> | Type&               | Type                    |
> | Type[]              | \*Type                  |
> | Type(argument0list) | Type(\*)(argument-list) |
> | Type                | const Type              |
> | Type                | volatile Type           |
> | Type\*              | const Type              |
> | Type\*              | volatile Type           |

```cpp
//调用函数
may('B');

//所有同名
void may(int);               // 1
float may(float, float = 3); // 2
void may(char);              // 3
char *may(const char *);     // 4
char may(const char &);      // 5

template <class T>
void may(const T &);         // 6

template <class T>
void may(T *);               // 7
```

由上述规则可以看出，优先级情况如下：

- 完全匹配：3、5、6
- 提升转换：1
- 标准转换：2
- 不符合：4、7

其中，3、5 是常规函数，优先级高于 6 模板。

有两个最佳选择的情况一般认为是错误的，但有特例。

- 指向非 const 数据的指针和引用优先与非 const 指针和引用参数匹配，反之然
- 其中一个是非模板函数而另一个不是，此时废模板函数优先于模板函数（包括显式具体化）

# 文件操作

## 头文件

C++文件操作头文件 fstream，也就是“文件流”。

## 对象声明

```cpp
ofstream ofs;//执行写操作
ifstream ifs;//执行读操作
fstream file;//读写都可以
```

## 文件打开、关闭

以下所有内容均假设使用对象名为 file（不论是 ofstream 还是 ifstream/fstream），打开方式为：`file.open(文件路径,打开方式);`
同时也可以在定义流对象时直接打开：
`ifstream file(文件路径,打开方式)`
其中，文件路径的参数为 string 类型字符串或 char\*型字符数组。

|  打开方式   |            解释            |
| :---------: | :------------------------: |
|   ios::in   |            读取            |
|  ios::out   |            写入            |
|  ios::ate   |      初始位置：文件尾      |
|  ios::app   |       追加方式写文件       |
| ios::trunc  | 如果文件存在先删除，再创建 |
| ios::binary |         二进制方式         |

文件关闭：`file.close();`
文件关闭之后流并未删除，只是断开了流到文件的链接，流管理装置仍然保留，因而可以用来再次打开某个文件。此时由于之前使用的内容还储存着，为避免对之后的使用造成影响，应当在文件关闭后使用函数`file.clear()`把整个类全部重置。

- 注意：文件打开方式可以配合使用，利用 | 操作符。例如，用二进制方式写文件：
  `ios::out | ios::binary`
- ios 即 basic_ios，二者互为别名；ios 类是在 ios_base 基础上的派生类。
- 打开方式可以不写，默认打开方式为`ios::in|ios::out`，以默认模式打开文件进行输出（写入）时，文件长度将自动截短为 0，也就是删除之前内容。

## 文件操作

- 由于`ifstream`、`ofstream`、`fstream`等`fstream`中定义的类都是从`iostream`的相应类中派生而来，所以均可使用原来的类的操作方法，并且继承其特性（如 ifs 会和 cin 一样，遇到空格就截断字符串）。一如 C 语言中的 gets/fgets、scanf/fscanf、printf/fprintf。

## 文本文件

### 读取

五种方法。例程如下：

```cpp
#include <iostream>
#include <string>
#include <fstream>
using namespace std;

int main()
{
	ifstream ifs;
	char buf[1000] = { 0 };
	string s;
	ifs.open("test.txt",ios::in);
	if(!ifs.is_open())
	{
		cout << "文件打开失败！"  << endl;
		return -1;
	}
	/*方法一，缺点在于空格即断开*/
	while(ifs >> buf)
	{
		cout << buf <<endl;
	}
    /*方法二，缺点同上*/
	while(ifs.getline(buf,sizeof(buf)))
	{
		cout << buf <<endl;
	}
	/*方法三，整行读取*/
	while(getline(ifs,s))
	{
		cout << buf <<endl;
	}
	/*方法四，逐个字符读取，太不爽*/
	char c;
	while((c = ifs.get()) != EOF)
	{
		cout<<c;
	}
	/*方法五，缺点在和cin一样，遇到空格就截断，而不只是换行符*/
	ifs >> buf;

	ifs.close();
	ifs.clear();
	return 0;
}
```

### 文件写入

格式如下：
`对象名 << 写入的内容;`
如需换行，在写入内容后加 endl 即可。例程如下：

```cpp
#include <iostream>
#include <string>
#include <fstream>
using namespace std;

int main()
{
	ofstream ofs;
	ofs.open("test.txt",ios::out);
	if(!ofs.is_open())
	{
		cout << "文件打开失败！"  << endl;
		return -1;
	}
	ofs << "-How old are you?" << endl;
	ofs << "-I'm 21ys old." << endl;
	ofs << "-Oh,what a young guy!" << endl;
	ofs << "-Thanks."  <<endl;
	ofs.close();
	return 0;
}
```

### 总结

读文件可以利用 ifstream 或者 fstream 类。
利用 is_open 函数可以判断文件是否打开成功。
操作完毕，要关闭文件。

## 二进制文件

以二进制形式读写文件。
打开方式需要指定为`ios::binary`。

### 读取

利用流对象调用成员函数`read`。
函数原型：`istream& read(char* buffer, int len)`
参数解释：字符指针 buffer 指向内存中一段存储空间。len 是读写的字节数。
例程如下：

```c++
#include <iostream>
#include <string>
#include <fstream>
using namespace std;

int main()
{
	ifstream ifs;
	int a[10];
	ifs.open("test.bin",ios::in | ios::binary);
	if(!ifs.is_open())
	{
		cout << "文件打开失败！"  << endl;
		return -1;
	}
	ifs.read((char*)a, sizeof(int) * 10);
	return 0;
}
```

### 写入

使用流对象成员函数`write`。
函数原型：`ostream& write(const char* buffer, int len)`
参数解释：字符指针 buffer 指向内存中一段存储空间。len 是读写的字节数。
例程如下：

```c++
#include <iostream>
#include <string>
#include <fstream>
using namespace std;

int main()
{
	ofstream ofs;
	int c=-3;
	string s="Long Live the People!";
	ifs.open("test.bin",ios::in | ios::binary);
	if(!ofs.is_open())
	{
		cout << "文件打开失败！"  << endl;
		return -1;
	}
	ofs.read((char*)&c,sizeof(c));
	ofs.read(s.c_str(),sizeof(char) * s.length());
	return 0;
}
```
