# MATLAB入门
## MATLAB工作环境
+ 单击命令行窗口右上角可使命令行成为独立窗口。
+ 双击某一历史命令可重新执行该命令（貌似是鼠标选中要执行的历史命令后，右键在下拉框中点击“执行选中”）。
+ 工具栏中绘图标签下的按钮可以绘制变量，使用时应当在工作区点击变量名左侧“+”来选中变量。
## MATLAB帮助
+ 在MATLAB的图形用户接口（GUI）出现之前，只能使用help和lookfor函数在命令行窗口中查看帮助。这两个函数至今仍在使用。例如，下面的代码用于查看sqrt图数的帮助文本。
> help sort
>
> sort - 对数组元素排序
>
> 此 MATLAB 函数 按升序对 A 的元素进行排序。
    
+ 如果不知道具体的的数名，但知道与该函数相关的某个关键字，则可以使用
lookfor函数进行查找。例如想知道某个与关键字inverse有关的函数，可以使用下面的代码进行查找：
> look inverse

### 常见帮助命令
> demo 运行MATLAB演示程序
>
> help
>
> lookfor
>
> which 显示指定函数或文件的路径
> 
> who 列出当前工作空间中的变量
> 
> helpwin 运行帮助窗口
> 
> tour 运行漫游程序
> 
> what 列出当前文件架或指定目录下M文件、MAT文件、MEX文件
> 
> whos 列出当前工作空间中变量的更多信息
> 
> helpdesk 运行HTML格式帮助面板helpdesk
>
> exist 检查指定变量或文件的存在性
>
> doc 在网络浏览器中显示指定内容的HTML格式帮助文件，或启动helpdesk

### 帮助浏览器
+ 除help/lookfor外，有相对分离的帮助浏览器、帮助窗口。可单击帮助菜单下的示例标签，或直接输入helpwin/helpdesk/doc。

### 在线资源
+ 官网网址[MATLAB](http://www.mathworks.com)。

	最有用的工具：

	1、解决方案搜索引擎（Solution Search Engine）

	2、MATLAB中心（MATLAB Central）
