[toc]

这里是英（C）语（yǔ）科（yán）听力部分。该部分有第一、第二两节。

请注意，回答听力部分时，请先将答案写在试卷上，听力部分结束前，你将有两分钟的时间将试卷上的答案转移到答题卡上。

听力考试，现在开始！

# 光标隐藏函数

```c
void HideCursor(void)
{
   CONSOLE_CURSOR_INFO cursor_info = {1, 0};
   SetConsoleCursorInfo(GetStdHandle(STD_OUTPUT_HANDLE), &cursor_info);
}
```

# show_bytes

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef unsigned char* bite_pointer;
typedef int T;//数据类型为int,可更改
void show_bites(bite_pointer p,size_t len)
{
	size_t i;
	cout<<"In machine order:";
	for(i=0;i<len;i++)
	{
		printf("%.2x ",p[i]);
	}
	printf("\n");
	cout<<"In person order: ";
	for(i=len-1;i>0;i--)
	{
		printf("%.2x ",p[i]);
	}
	printf("%.2x ",p[i]);
	printf("\n");
}
int main()
{
	int a;
	cout<<"Please input the data in type \"int\":";
	cin>>a;
	show_bites((bite_pointer)&a,sizeof(T));
	return 0;
}
```

# 界面设计和上色

注意：**本内容请勿改动任何参数！**

```c
#include <windows.h>
#include <conio.h>
#include <time.h>

int wide=60,high=30;//宏常量定义，数据可变
HANDLE hout=GetStdHandle(STD_OUTPUT_HANDLE);//写在主函数或调用函数内部，用于定义hout并进行初始化
system("mode con cols=80 lines=40 ");//运行框大小限制

void gotoxy(HANDLE hout,int x,int y)
{
	HANDLE handle = GetStdHandle(STD_OUTPUT_HANDLE);
	COORD pos;
    pos.X = x;
    pos.Y = y;
	SetConsoleCursorPosition(hout,pos);
}
int color(int c)//设置颜色
{
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),c);
	return 0;
}//颜色有若干种
//两个调用函数
```

设置某句子的位置用`gotoxy(hout,wide*k,high*m)`，就是在 wide 的 k 倍，high 的 m 倍的位置。
句子上色用`color(c)`，c 为指定颜色序号。
输出后的停顿用`void Sleep(int t)`函数，在`<windows.h>`中，t 代表暂停的毫秒数。
使用时每个句子前都要用 gotoxy 指定位置，用 color 上色。
合起来如下：

```c
	gotoxy(hout,wide/5,high/6);
	color(6);
	printf("本计算器仅支持5个及以下的矩阵，分别名为A~E(大写）。");
	Sleep(200);
	gotoxy(hout,wide/5,high/6+1);
	color(6);
	printf("每个矩阵阶数不超过5*5。");
	Sleep(200);
```

# 关于音乐效果

```c
#include<windows.h>
#include<mmsystem.h>
#pragma comment(lib."Winmm.lib") //头文件
PlaySound(TEXT("音乐名.wav"),NULL,SND_FILENAME | SND_ASYNC | SND_LOOP);//开始播放
PlaySound(NULL,NULL,SND_FILENAME);//结束播放
```

注意：音频必须使用**wav**格式，必须放在**跟代码同一个文件夹**，如果不然，音乐名处**应当使用其绝对地址或相对地址**。

# 震动心形设计

```c
#define I 20
#define R 340

int wide=80,high=40;//宏常量定义，数据可变
system("title xxx");//运行框名称修改，主函数第一句
system("mode con cols=80 lines=40 ");//运行框大小限制

void draw_color()//整体颜色震动效果函数
{
    char cl[20];
    srand((unsigned int)time(NULL));
    int k = rand() % strlen(back_color);
    strcpy(cl, Color);
    cl[len] = back_color[k];
    srand((unsigned int)time(NULL));
    k = rand() % strlen(font_color);
    cl[len + 1] = font_color[k];
    cl[len + 2] = '\0';
    system(cl);
}
```

颜色震动使用方法实例：

```c
for(i=0;i<6;i++,lower+=3)
{
	puts(data[i+15]);
	for(j=0;j<wait;j++)
	{
        draw_color();
        Sleep(200);
    }
	Sleep(200);
}
void draw_heart(int wait)//心形设计函数，传入参数为0即可
{
    int i,j,e,a;
    for(i=1,a=I;i<I/2;i++,a--)
	{
        for(j=(int) ( I-sqrt(I*I-(a-i)*(a-i)) );j>0;j--)
		{
			printf(" ");
		}
        for(e=1;e<=2*sqrt(I*I-(a-i)*(a-i));e++)
		{
			printf("\3");
		}
        for(j=(int)( 2*( I-sqrt(I*I-(a-i)*(a-i)) ) );j>0;j--)
		{
			printf(" ");
		}
        for(e=1;e<=2*sqrt(I*I-(a-i)*(a-i));e++)
		{
			printf("\3");
		}
        printf("\n");
        if(wait&&i%2)
		{
            draw_color();
            Sleep(80);
        }
    }
    for(i=1;i<80;i++)
	{
        if(i==20)
		{
            for(int j=0;j<40;j++)
            {
                printf("\3");
            }
            i+=40;
        }
        printf("\3");
    }
    printf("\n");
    for(i=1;i<=R/2;i++)
	{
        if(i%2||i%3)
		{
			continue;
		}
        for(j=(int) ( R-sqrt(R*R-i*i) );j>0;j--)
		{
			printf(" ");
		}
        for(e=1;e<=2*( sqrt(R*R-i*i) - (R-2*I) );e++)
		{
			printf("\3");
		}
        printf("\n");
        if(wait)
		{
            draw_color();
            Sleep(80);
        }
    }
}
```

# 给代码加行号的代码

```c
#include<stdio.h>

int main(void)
{
	FILE *fpIn;
    // 输入文件的指针
	FILE *fpOut;
	// 输出文件的指针
	char str[1000];
	// 用来存储从文件中读取出的”一行“字符串信息
	int row = 1;
	fpIn = fopen("文件名.cpp", "r");
	/* 以只读和文本格式打开需要的.cpp文件
	 *这里的文件名无所谓大小写
	 */
	fpOut = fopen("文件名.txt", "w");
	// 以创建方式（也叫写方式）打开文件名.txt文件
	fgets(str, 81, fpIn);
	/* 从文件中读取一行信息，保存到str数组中。
	 *这里要注意的是这个81，
	 *一般情况下，编写文本格式文件的人，都习惯遇到行尾就敲回车，
	 *所以，一般情况下，文本文件一行最多80个字符。
	 *如果，一行不够80个字符，这个函数会自动只读到'\n'就结束了。
	 */
	while(!feof(fpIn))
	{ // 判断上一次fgets()是否正常（即，没有遇到文件尾部）
		fprintf(fpOut, "%4d   %s", row, str);
		// 在读入的每一行信息前，加入0000到9999的行号（应该够用了吧），呵呵呵呵
		row++; // 行号加一
		fgets(str, 81, fpIn); // 读取下一行
	}
	fclose(fpIn); // 关闭文件
	fclose(fpOut);
}
```
