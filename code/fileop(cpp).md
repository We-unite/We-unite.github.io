[toc]

# 头文件

C++文件操作头文件 fstream，也就是“文件流”。

# 对象声明

```C++
ofstream ofs;//执行写操作
ifstream ifs;//执行读操作
fstream file;//读写都可以
```

# 文件打开、关闭

以下所有内容均假设使用对象名为 file（不论是 ofstream 还是 ifstream/fstream），打开方式为：`file.open(文件路径,打开方式);`
同时也可以在定义流对象时直接打开：
`ifstream file(文件路径,打开方式)`
其中，文件路径的参数为 string 类型字符串或 char\*型字符数组。
| 打开方式 | 解释 |
|:-----------:|:------------:|
|ios::in |读取 |
|ios::out |写入 |
|ios::ate |初始位置：文件尾 |
|ios::app |追加方式写文件 |
|ios::trunc|如果文件存在先删除，再创建|
|ios::binary|二进制方式 |

文件关闭：`file.close();`
文件关闭之后流并未删除，只是断开了流到文件的链接，流管理装置仍然保留，因而可以用来再次打开某个文件。此时由于之前使用的内容还储存着，为避免对之后的使用造成影响，应当在文件关闭后使用函数`file.clear()`把整个类全部重置。

- 注意：文件打开方式可以配合使用，利用 | 操作符。例如，用二进制方式写文件：
  `ios::out | ios::binary`
- ios 即 basic_ios，二者互为别名；ios 类是在 ios_base 基础上的派生类。
- 打开方式可以不写，默认打开方式为`ios::in|ios::out`，以默认模式打开文件进行输出（写入）时，文件长度将自动截短为 0，也就是删除之前内容。

# 文件操作

- 由于`ifstream`、`ofstream`、`fstream`等`fstream`中定义的类都是从`iostream`的相应类中派生而来，所以均可使用原来的类的操作方法，并且继承其特性（如 ifs 会和 cin 一样，遇到空格就截断字符串）。一如 C 语言中的 gets/fgets、scanf/fscanf、printf/fprintf。

# 文本文件

## 读取

五种方法。例程如下：

```C++
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

## 文件写入

格式如下：
`对象名 << 写入的内容;`
如需换行，在写入内容后加 endl 即可。例程如下：

```C++
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

## 总结

读文件可以利用 ifstream 或者 fstream 类。
利用 is_open 函数可以判断文件是否打开成功。
操作完毕，要关闭文件。

# 二进制文件

以二进制形式读写文件。
打开方式需要指定为`ios::binary`。

## 读取

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

## 写入

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
