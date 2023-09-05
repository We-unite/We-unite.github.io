[toc]

# 阿里云服务器

自从开始做自己的网页，越来越发现**干啥都需要一个服务器**。先是和大佬[黄四郎](https://user.qzone.qq.com/2506370693)一起在自己的电脑上搞服务，利用 VSCode 插件[Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)拿自己的电脑充当临时服务器，偶尔作代码互传帮忙 debug 之用，还为此写了一些辅助代码；后来另一位大佬推荐我看看酷安社区的随身 wifi 改装服务器教程，一时脑热，两百块钱沉没成本就这样进去了，最后发现买的随身 wifi 不知道为啥刷不了机，只能作为普通的随身 wifi 用；迁延日久，我都快把这茬子忘了。

突然有一天，黄四郎同志**转发上级指示**，给我发来了一份文档：[学生速看！免费领取阿里云云服务器的详细攻略](https://developer.aliyun.com/article/1122002)。我一想，拔资本主义的毒草，插社会主义的香花！于是就开始了我的阿里云服务器之旅。

## 申领过程

注册一个阿里云账号，完成学生身份认证，然后按照上边的文档逐步操作即可。

需要注意的是，购买之后免费使用期间内，一定不要升级服务器配置，否则将会失去 0 元续领资格。如确有需要，到期之后再升级。

## 实验学习与 Clouder 认证

实验学习过程中会发给一个临时账号，自动创建一个临时的实例（服务器）供实验之用，时长 1h。讲真，阿里云的实验学习做的非常好，实验文档就在实验界面旁边，非常方便。B 站/油管/知乎等诸多平台都有这个实验的详细教程可以参考。

另外，由于是一个临时账号，我个人建议另找一个浏览器做实验，方便和自己现在用的帐户/ECS 实例区别开来。

# 服务器配置

服务器硬件配置应该都是固定的吧？CPU 双核，内存 2G，硬盘 40G，带宽 1MBps。我个人觉得这个配置还是挺不错的，毕竟是白嫖，要求也不能太高了不是？

操作系统方面，由于个人比较喜欢纯命令行操作，所以选择了 Ubuntu22.04 LTS，我的虚拟机也是这个版本，相对而言会比其他发行版更熟悉一些。

## 服务器初始化

在跟着创建实例的要求一步步做好之后，我们就拥有了一台属于自己的服务器了，并已经有了根用户 root。接下来，我们需要做一些初始化的工作。

### 创建新用户

众所周知，**为了安全起见，我们需要一个非 root 但具有 sudo 权限的用户来进行日常操作**。这里我创建了一个名为<kbd>player</kbd>的用户并设置了密码，然后将其加入 sudo 组。

```bash
# 创建新用户，-m参数创建用户，-d参数手动指定用户的主目录
sudo useradd -m player -d /home/player
# 如需指定默认shell，可以加上-s参数。
# 这里需要注意，一般意义上bash是sh的超集，因此sh能干的bash一般都能干，所以这里一般需要指定为bash。
sudo useradd -m player -d /home/player -s /bin/bash

# 设置密码，需要输入两次作为验证
sudo passwd player

# 将新用户加入sudo组
# 没有vim的先装一下，有vim的忽略本条
sudo apt install vim

cd /etc
sudo vim sudoers
# 找到root ALL=(ALL:ALL) ALL，按o新开一行，然后写一份一样的，把root改成player
# 按ESC，输入:wq保存退出
```

这时我们会发现一个很操蛋的事情，“为啥命令提示符之前不显示当前用户名和当前路径嘞？这岂不是每次看路径都需要<kbd>pwd</kbd>吗？烦不烦啊！”别急，问题很好修改。

```bash
cd /home/player
vim .bashrc
# 找到PS1=，将其修改为PS1="\u@\h:\w\$"
# 按ESC，输入:wq保存退出
```

修改退出之后似乎一切都没有变化。我们需要重启一下服务器。

```bash
sudo reboot
```

重新连接之后，也许还是没有变化，我就是这样的。后来在处理其它问题的时候，我发现了根本原因所在：我 TM 创建用户的时候忘了加<kbd>-s</kbd>参数，导致新用户的默认 shell 是<kbd>sh</kbd>而不是<kbd>bash</kbd>。所以，我们需要修改一下新用户的默认 shell。

```bash
# 查看当前用户的默认shell
echo $SHELL

# 修改默认shell
sudo chsh -s /bin/bash player
```

这时再重启服务器，就会发现，一切都正常了，一切是那么美好。

## 安装软件

经历了上边的配置，现在我们拥有了一台可以正常使用的服务器。服务器是为了什么？开发！开发！开发！所以，我们需要安装一些开发所需的软件。

```bash
# 如需添加软件源，可以先执行下边的命令
# 备份软件源
sudo cp /etc/apt/sources.list /etc/apt/sources.list.old
# 修改软件源
sudo vim /etc/apt/sources.list

# 不管是否修改了软件源，都更新一下吧！
sudo apt update
# 更新软件
sudo apt upgrade

# 安装git
sudo apt install git
# 安装python3.11，默认的是3.10。为了方便使用，还需要将python3.11链接到python
sudo apt install python3.11
cd /usr/bin
sudo ln -s python3.11 python
# 安装pip
sudo apt install python3-pip
# 安装gcc
sudo apt install gcc
# makefile和cmake总是需要的吧？
sudo apt install make cmake

# 剩下需要安装的软件，可以自行搜索
```

## 配置 ssh

用着用着，就会发现：我为啥一直在浏览器里搞命令行？要是能直接在本地的命令行里搞就好了。当然，阿里云能满足我们。

### ssh 简介

什么是 ssh？ssh 是 Secure Shell 的缩写，中文名为安全外壳协议。ssh 是一种加密的网络协议，可以在不安全的网络中为网络服务提供安全的传输环境。ssh 是目前较可靠，专为远程登录会话和其他网络服务提供安全性的协议。利用 ssh 协议可以有效防止远程管理过程中的信息泄露问题。通过 ssh 可以对所有传输的数据进行加密，也能够防止 DNS 欺骗和 IP 欺骗。ssh 还支持在两个远程主机之间进行数据的传输。

说了也记不住，直接开干！

### 配置安全组规则

在阿里云控制台左上角点击，选择`云服务器ECS`，会进入云服务器实例控制界面。在左侧菜单栏寻找`安全组` ，添加安全组规则。按要求添加新的安全组规则，开放 TCP 协议对应的 22 端口。（其实可以都开了，但是毕竟不安全，建议后续按需开放。）

接着，在菜单栏中点击`密钥对`，创建新的密钥对。**完成之后会自动下载一个.pem 文件，我们需要将该文件保存好，丢失之后无法找回，这是 ssh 连接的密钥。**

为了方便用别名连接，我们需要一个配置文件：

- 将上述.pem 文件移动到家目录`C:\用户\当前用户名`的<kbd>.ssh</kbd>文件夹下
- 在<kbd>.ssh</kbd>文件夹下创建文件<kbd>config</kbd>，内容如下：

```txt
# 给服务器起的别名，这里是aliyun
Host aliyun
# IP地址，这里以127.0.0.1代替，但真实操作需要换成服务器的公网ip，在控制台就能看到
IP 127.0.0.1
# 端口，一定是22
Port 22
# 用户，这里是以上边创建的player登陆
User player
# 密钥位置
……
```

在写好之后，我们就可以在本地命令行远程 ssh 连接云服务器操作了！

```bash
# 登陆，这里的aliyun是上边config里边起的别名
ssh aliyun
```

# 拥抱 vim

既然我们选择了在命令行里使用，编辑文件当然是比较常用 vim 了。当然 neovim 与其他命令行编辑器也很好，但我不熟悉，请参照网上其他教程进行配置。

我的 vim 学习与配置[链接](https://www.qin-juan-he-zhu.top/code/vim/vim.html)中有如下一些基本配置：

- 同时开启绝对行号与相对行号，则当前行显示真实行号，其他行显示相对于当前行为上/下第几行，方便跳转。
- 代码中常常需要的`()[]{}`自动匹配
- 自动缩进和智能缩进，但似乎没啥鸟用
- vim 自带的代码高亮，感觉还是相当不错的
- 当前行/当前列各给一个颜色，因为有的平台光标显示很不明显，正常插入模式一般也不好确定光标位置，这样方便知道光标在哪。
- 自动折行，即当前行太长了会被折回来显示，但还是同一行，方便一次性看完整。
- 一些快捷键，如<kbd>ta</kbd>到行末（替代够不到的<kbd>$</kbd>），<kbd>end</kbd>来到文件末（替代难记的<kbd>G</kbd>），还有<kbd>up/ne</kbd>上/下移动 20 行等。
- 自动识别文件类型，并对`*.html, *.c, *.cpp, *.python`等文件在保存<kbd>:w<Enter></kbd>时自动格式化，在正常或选择模式下<kbd>Ctrl+p</kbd>一键注释（别骂了别骂了，<kbd>Ctrl+/</kbd>我属实是设置不出来）

## 插件管理

这里使用了几个插件，插件管理目前用的是评价一般的`Vundle`。个人评价，下载插件啥的属实是慢，每次都报错报到怀疑人生，害得我都得手动安装然后在里边添加，但是别的目前还不会使。气死偶勒！

这里需要注意的是，上文提到我喜欢把有用的东西放在`~/useful`下，但是如果直接这样写路径，其他用户如 root 等使用时候就会报错，人家的主目录第下没这个东西！所以，在写路径的位置，切记要写绝对路径！！！

# 游戏

> All work no play makes Jack a doll boy.

经过了上边的配置，写代码的控制基本完善了，但是服务器怎么能只拿来干活呢？没有游戏怎么行？我们要快乐！

目前我的服务器上装了三个游戏

- 俄罗斯方块，装的是`tint`
- 扫雷，装的是`miebash`
- 贪吃蛇，找不到力（允悲

安装方法网上都有，就不多说了。玩得愉快！

# git 远程存储

君不闻，《西游记》有云：

> 争名夺利几时休，早起迟眠不自由。
>
> 骑着驴骡思骏马，官居宰相望王侯。

完成了代码环境的配置，我就在想，要是有一个自己的远程 git 存储库该多好？

说干就干，我找到了 gitlab 安装教程，信心满满，谁知"先帝创业未半而中道崩殂"。

## gitlab？

我按照网上的教程，更新了清华镜像源，下载安装 gitlab。孰料一次一次在安装过程卡死，而且情况十分严重，CPU
占用率长期维持在 50%以上，内存更是飙升到 90%，现在不仅安装进行不下去了，甚至一切操作都不认识，包括<kbd>Ctrl+C</kbd>想要杀死当前进程的请求也会石沉大海。没办法，只得强制重启。

如是反复若干次，最终死心，将 gitlab 彻底从云服务器卸载，"革职为民，永不叙用"。

经过上网查找，原因果然出现在配置上。**gitlab 推荐的最小内存是 4G，但是目前我们只有 2G，内存爆满也就理所当然了。**没办法，期限之内不能更改配置，就算能更改，我都穷到薅资本主义羊毛了，还能有钱升级配置？笑死。

## 就这？

就因为这个问题，我们就不干了？这是不行滴，小同志。

不久之后，黄四郎同志发来了一篇博客：[最简单的 git 服务器](https://www.ruanyifeng.com/blog/2022/10/git-server.html)

看起来似乎不错，但是失之简略。幸好，我在 git 官方教程[Pro Git](https://git-scm.com/book/zh/v2)上找到了另一部分，两个拼一拼、试一试，最终成功了。

注意，本地和远程都需要安装 git，相信能看这里的读者应该已经是安装过了，这里不再赘述。

### 前置

在创建存储库之前，我想我们应该做些什么。

对了，创建新用户吧！按照上述写的步骤创建一个新用户并为之设置密码，可以不用加入 sudo 组，因为我们不需要这个用户来操作服务器，只需要用来存储代码就行了。

### 本地存储库

本地我们需要一个存储库，如果已有的则可以忽略本部分。

```bash
# 创建本地存储库，这里叫test吧
mkdir test
cd test
git init
```

但是本方法要求本地存储库必须已经有 commit(s)。好办，就写一个常用的`.gitignore`好了。

```vim
*.sh
*.bat
*.exe
*.dll
*.so
*.[oa]
*.idea
```

而后，为了方便提交操作，可以再创建一个`push.sh`脚本：

```bash
#!/bin/bash
git add .
git commit
git push
```

注意，创建`push.sh`一定要在`.gitignore`之后，否则不会被忽略的。

### 远程仓库

就一句话：

```bash
# 创建远程仓库，这里也叫test吧
ssh git@127.0.0.1 git init --bare test.git
```

注意，本处指明的 git 为远程用户名，127.0.0.1 代表云服务器的公网 ip，test.git 为远程仓库名。使用的时候都需要换成自己的。

### 本地与远程连接

本地和远程都有了，下一步就是建立联系了。

```bash
# 本地添加远程
git remote add origin git@127.0.0.1:test.git

# 此时尚不能直接推送，因为并未指定上游对应分支，需要指定
git push --set-upstream origin master

# 之后就可以直接推送了
sh push.sh
```

### 自动化

怎么样，操作看起来又臭又长吧？我也这么觉得。所以我写了两份代码，供同时自动创建本地仓库和远程对应仓库并建立所有对应关系之用。

```c
/*
 * gitadd.c
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <direct.h>

int main()
{
    char local_name[100],remote_name[100],tmp[100];
    printf("您好！\n请输入本地仓库名：");
    gets(local_name);
    printf("请输入远程仓库名：");
    gets(remote_name);

    //远程仓库创建
    strcpy(tmp,"ssh aliyun-git git init --bare ");
    strcat(remote_name,".git");
    strcat(tmp,remote_name);
    system(tmp);

    //本地仓库创建
    mkdir(local_name);
    chdir(local_name);
    system("git init");

    //本地仓库初始化
    FILE* file;
    //编写.gitignore
    file=fopen(".gitignore","w");
    fprintf(file,"*.sh\n");
    fprintf(file,"*.bat\n");
    fprintf(file,"*.exe\n");
    fprintf(file,"*.[oa]\n");
    fprintf(file,"*.pyc\n");
    fprintf(file,"__pycache__\n");
    fprintf(file,"*.vscode\n");
    fprintf(file,"*.swp\n");
    fclose(file);
    //编写push.sh
    file=fopen("push.sh","w");
    fprintf(file,"git add .\n");
    fprintf(file,"git commit\n");
    fprintf(file,"git push");
    fclose(file);

    //提交初始化commit
    system("git add .");
    system("git commit -m \"Initial commit\"");
    strcpy(tmp,"git remote add origin aliyun-git:");
    strcat(tmp,remote_name);
    system(tmp);
    system("git push --set-upstream origin master");
    system("git push");

    printf("完成！");
    return 0;
}
```

```python
# gitadd.py
import os

if __name__ == '__main__':
    print("你好！")
    print("请输入本地仓库名：")
    local_name = input()
    print("请输入远程仓库名：")
    remote_name = input()
    os.system("ssh aliyun-git git init --bare "+remote_name+".git")

    # 创建本地仓库
    os.system("mkdir "+local_name)
    os.chdir(local_name)
    print("本地仓库已建立！")
    print("当前路径为"+os.getcwd())

    # 初始化git仓库
    os.system("git init")

    # 以utf8编码编写.gitignore文件
    with open(".gitignore", "w", encoding="utf8") as f:
        f.write("*.pyc\n")
        f.write("__pycache__/\n")
        f.write("*.exe\n")
        f.write("*.[oa]\n")
        f.write("*.swp\n")
        f.write("*.sh\n")
        f.write("*.bat\n")

    # 编写push.sh文件
    with open("push.sh", "w", encoding="utf8") as f:
        f.write("git add .\n")
        f.write("git commit\n")
        f.write("git push\n")

    print("本地仓库初始化完成！")

    # 连接远程仓库
    os.system("git add .")
    os.system("git commit -m \"Initial commit\"")
    os.system("git remote add origin aliyun-git:"+remote_name+".git")
    os.system("git push --set-upstream origin master")
    os.system("git push")

    print("完成！")
```

**Attention please:** 本地仓库名和远程仓库名不要加后缀，程序会自动添加。另外，如果要修改，在转换本地当前工作目录的时候，**一定要使用语言自带的调整当前工作目录的函数，不要调用系统命令**，否则会出现编译器/解释器自动将程序作为多线程执行，导致一个线程进去了然后线程当场去世，后续的操作在另一个线程，工作目录根本没发生变化，也就是把原来所在的位置给 git 初始化了，出现奇奇怪怪的错误。

### 其他

需要明白的是，上述方法在远端创立的**只是一个裸仓库**（即只是我们本地仓库的`.git`文件夹），不包含工作目录，所以不能直接在远端进行操作，需要在本地进行操作，然后推送到远端。但是`git clone`的时候，本地得到的是一个完整的仓库，而其他使用也与普通仓库无异。

# 来看看在线 VSCode 吧！

本来，一切就这样完美收官、从胜利走向更大的胜利了。坏就坏在我按照五个月前的计划添置了一个 iPad。在最初的设想里它就不单单是当平板做笔记看书用的，而是要充当电脑的编程功能，来在必要的时刻随拿随走，替代我这十几斤重、续航还短的游戏本的。

诚然，平板上有专门的编程工具，但总是和电脑上差距不小，尤其是配置，十分令人不爽；但 ssh 连接云服务器，又总是不够方便，因为平板键盘和电脑键盘的按键，尤其是功能键，有不小差异。

瞌睡就递来枕头，感谢知乎主页的推荐，让我知道了有在线的 VSCode，那就是[Code-Server](https://coder.com/docs/code-server/latest)，gayhub 仓库[链接](https://github.com/coder/code-server)。官方也有安装教程，这里浅浅说几句吧。

## 安装

官方提供了安装脚本，一条命令直接完成安装：

```bash
curl -fsSL https://code-server.dev/install.sh | sh
```

但是我这里 curl 不知何故一直不能用，wget 也不好使，只能在 gayhub 仓库的[Releases](https://github.com/coder/code-server/releases)里找到最新版适合的安装包手动安装了。我是 Ubuntu22.04LTS，系统架构 amd64，所以下载了对应的.deb 安装包。

```bash
# 本地命令行中运行
scp code-server-4.13.0-linux-amd64.deb aliyun:code-server-4.13.0-linux-amd64.deb
```

```bash
# 云服务器命令行中运行

# 安装
sudo dpkg -i code-server-4.13.0-linux-amd64.deb
```

默认安装目录在`~/.local/share/code-server`下。暂且不管。

## 运行

安装完成后，就可以直接运行了。

```bash
code-server
```

就可以直接运行了，但是这样只能在本地浏览器运行，而我们需要的是远程运行。算了，直接上脚本！

```bash
#!/bin/sh
code-server --host "0.0.0.0"> /home/player/useful/codeserver-out.txt 2>&1 &
echo 启动完成！程序已在后台运行。
echo 如需杀死进程，请以jobs查看后台程序编号并kill %num
echo               或ps查看进程号并kill之。
```

其中第一条指令是设置允许外界访问，并指定了由后台运行、所有输出写进`/home/player/useful/codeserver.txt`文件中。后续均为输出信息。

初次这样设置，直接打开会有密码，密码的存储文件在`~/.config/code-server/config.yaml`中，可以直接修改，也可以使用命令行修改。比如我当前的设置为：

```yaml
bind-addr: 127.0.0.1:8080
auth: password
password: player
cert: false
```

其中端口号可按需修改，`auth`属性如果设置为`none`则不需要密码，`cert`属性如果设置为`true`则需要证书，密码也可以直接修改，这里不再赘述。

## 杀死

设置好之后会需要重新启动程序，我一般选择杀死然后重新运行启动脚本。

杀死的方法：

```bash
# 运行指令
ps -ef | grep code-server

# 输出结果如下
player      2621       1  0 May29 ?        00:00:00 /usr/lib/code-server/lib/node /usr/lib/code-server --host 0.0.0.0
player      2646    2621  0 May29 ?        00:03:31 /usr/lib/code-server/lib/node /usr/lib/code-server/out/node/entry
player      3079    2646  0 May29 ?        00:00:57 /usr/lib/code-server/lib/node /usr/lib/code-server/lib/vscode/out/bootstrap-fork --type=ptyHost --logsPath /home/player/.local/share/code-server/logs/20230529T211752
player     15803    3079  0 May29 pts/0    00:00:00 /usr/bin/bash --init-file /usr/lib/code-server/lib/vscode/out/vs/workbench/contrib/terminal/browser/media/shellIntegration-bash.sh
player     23951    2646  0 May29 ?        00:00:04 /usr/lib/code-server/lib/node /usr/lib/code-server/lib/vscode/out/bootstrap-fork --type=fileWatcher
player    464481    2646  0 13:42 ?        00:00:01 /usr/lib/code-server/lib/node /usr/lib/code-server/lib/vscode/out/bootstrap-fork --type=fileWatcher
player    464494    2646  3 13:42 ?        00:06:29 /usr/lib/code-server/lib/node /usr/lib/code-server/lib/vscode/out/bootstrap-fork --type=extensionHost --transformURIs --useHostProxy=false
player    464832  464494  0 13:42 ?        00:00:02 /usr/lib/code-server/lib/node /home/player/.local/share/code-server/extensions/formulahendry.auto-rename-tag-0.1.10/packages/server/dist/serverMain.js --node-ipc --clientProcessId=464494
player    465057  464494  0 13:42 ?        00:00:35 /usr/lib/code-server/lib/node /usr/lib/code-server/lib/vscode/extensions/markdown-language-features/server/dist/node/workerMain --node-ipc --clientProcessId=464494
player    579173  574648  0 16:44 pts/1    00:00:00 grep --color=auto code-server

# 只需要杀死根进程也就是第一个进程就好，下边的数据需要改成当前对应进程号
kill -9 2621
```

重新启动之后，就可以用`<服务器公网ip>:<指定端口>`访问在线 VSCode 了，初次访问会比较慢，耐心等待吧。

## 同步设置

在线 VSCode 设置好了，但是为了进一步抹平在线端与本地端的差异，最好做一下同步设置处理。网上大多数教程给的都是利用插件[Settings Sync](https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync)，但是该插件已经不再维护，使用也不方便。这里选用插件[Syncing](https://marketplace.visualstudio.com/items?itemName=nonoroazoro.syncing)。其实大多数类似插件都大同小异。

接着，浏览器登录自己的 github 账号，创建一个新的 token，用于同步设置。网上有详细教程，就不再多说了。需要注意的是：

- token 的权限要足够，不然会报错
- token 的有效期要长，不然每次都要重新生成，很麻烦
- 要勾选 gist
- 创建好的页面不要急于关闭，一定要把 token 复制下来保存好，你这辈子只有这一次机会看到它！

而后，可以在本地 VSCode 中安装插件，然后在设置中找到插件，按照提示登录 github 账号、输入 token，就可以自动同步设置了。

为了更进一步方便同步，可以创建快捷键哦~方法如下：

<kbd>Ctrl+Shift+p</kbd>，会弹出来一个搜索栏，搜索“打开键盘快捷方式”(如果还没装中文插件的话，搜索“Open Keyboard Shortcuts”)，点进去，搜索“Syncing”，会看到几个条目，将其中的上传操作设置为<kbd>Shift+Alt+U</kbd>，下载操作设置为<kbd>Shift+Alt+D</kbd>，这样以后每次上传下载都可以一键执行，啊不，三键执行了！

另外，该插件不仅适用于在线 VSCode，也适用于其他，比如我的虚拟机的 VSCode，这样就可以实现多端随时同步了。**岂不美哉？**

# 开放 https

> 你的服务器是不是只能用 http 访问？那你就太 low 了！

在 ip:port 形式访问端口的时候，你那里是不是总会弹出来一个提示，说连接方式不安全？这是因为你的服务器只能用 http 访问，而不能用 https 访问。那么，我们就来开放 https 吧！

## 域名

首先，我们需要一个域名。这里我选择我之前在腾讯云买的域名，比较便宜，首年才￥ 9，后续每年 30，还是可以的。这里权且把购买的域名叫做`player.com`吧。

购买之后，我们手动做 DNS 解析（不会有人真的有钱到购买吧？不会吧不会吧？）

## DNS 解析

进入腾讯云的域名管理界面，添加解析记录。这里我添加了一条二级域名的解析，即用一条 A 记录将二级域名`code.player.com`解析到云服务器的公网 ip 上（按照上文，ip 继续以`127.0.0.1`代指）。之所以没把`player.com`直接解析过去，是因为我的个人主页还在用`www.player.com`，托管在 github 上，一旦把一级域名解析到服务器，就要出问题。

除此之外，记得到阿里云 ecs 那里，在安全组规则中，开放 http/https 对应的 80/443 端口！两个都要开！

## ICP 备案

众所周知，我国是工人阶级领导的、以工农联盟为基础的、人民民主专政的社会主义国家，一切事关宣传、舆论的东西都要在党的领导下，都要经过审查备案，包括建网站和域名 https 使用。

ICP 备案的原则是：用谁的服务器，在谁那里备案。即以我而言，我在腾讯云买的域名、做的 DNS 解析，但用的是阿里云的服务器，就要在阿里云做 ICP 备案。

备案流程按按着走就行，只是有几点需要特别注意：

- 备案的省份需要与户籍所在省一致
- 备案网站名称不要太普通，容易和别人重复，会被客服小姐姐电话要求订正
- 网站名称不要出现“阁、楼、店”等一些容易误会为企业商业主体网站的名称，否则也会被退回。
- 网站用途描述要详细，尽量 30 字以上，绝对不要出现“博客”等词，审查非常非常严格，而且极大可能直接被 ban。即使你真要博客，不能暗度陈仓吗？

提交备案之后。如有问题客服会打电话通知，并退回修改；阿里云初审需要大概不到 1 天，工信部短信确认需要 1 天，然后发送到备案省（即户籍所在省）的管局，时长最多 20 天，建议提前搞。我用了 6 天。

## Nginx 代理

都做好之后，访问`code.player.com`，发现啥也没有，浏览器说对面没反应。是的，因为 A 记录只解析到了 ip，并没有解析到指定端口，而 http 默认端口 80，https 默认端口 443，都和上边 code-server 指定的端口 8080 不一样。

没错，我们需要一个代理，根据访问的网址来对应到指定端口。

### 安装

```bash
sudo apt install nginx
```

### 运行

```bash
nginx
```

### SSL 证书

想要使用 https 方式，还需要一个 SSL 证书，每个域名一个证。腾讯云比较坑，必须花钱。这里我用的是 Certbot 免费发放的证书。

首先，下载 Certbot:

```bash
sudo apt install certbot
```

在申请证书之前，需要停止 nginx 的工作，如果正在运行，按照上边说的方法杀死即可：

```bash
ps -ef | grep nginx

# 杀死显示的第一个进程
kill -9 <进程号>

# 重启nginx
nginx
```

而后就可以申请证书辣！

```bash
# 申请证书
sudo certbot certonly --standalone --email example@qq.com -d code.player.com
```

申请完成后会展示证书的存储路径，记下来，后边会用到。比如：

SSL 证书 /etc/letsencrypt/live/code.play.com/fullchain.pem;

SSL 证书秘钥 /etc/letsencrypt/live/code.play.com/privkey.pem;

### 修改、添加配置

Nginx 默认下载目录在`/etc/nginx`，该目录下有个`.conf`文件，但不建议直接改，建议在`/etc/nginx/conf.d`文件夹下为每个需要转发的域名添加单独的设置文件，这样方便管理和修改。运行过程中 Nginx 会自动将该目录下所有配置文件全部加载的，不需要手动设置。

在`/etc/nginx/conf.d`中，新建文件`vscode.conf`，内容如下：

```conf
server
{
    listen 80;
    server_name code.player.com;
    return 301 https://$host$request_uri;
}
server
{
    server_name code.player.com;
    listen 443 ssl;

    ssl_certificate /etc/letsencrypt/live/code.player.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/code.player.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8080;# 这里的端口号要和code-server指定的端口号一致，我是8080
        proxy_set_header Host $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection upgrade;
        proxy_set_header Accept-Encoding gzip;
    }
}
```

亲测有效。

编写完文件之后，需要重新加载配置文件（不必重启 Nginx）：

```bash
nginx -s reload
```

但在使用过程中，一定记得把域名换成自己的域名、证书路径换成自己的证书路径、端口换成自己在 code-server 中指定的端口！

# 碎碎念

> 王子猷（徽之）居山阴，夜大雪，眠觉，开室命酌酒，四望皎然。因起彷徨。咏左思《招隐诗》，忽忆戴安道（逵）。时戴在剡，即便夜乘小船就之。经宿方至，造门不前而返。人问其故，王曰：“吾本乘兴而行，兴尽而返，何必见戴！”
>
> ——《世说新语》

一时兴起跟着黄四郎同志搞了前端，又一时兴起薅资本主义羊毛搞服务器，甚至现在写这篇文档也是一时兴起。可能我就是这样一个人吧，想到哪里做到哪里，全是为了快乐。

这篇文档是对一个月以来搞云服务器的配置的一个小小总结，本来以为没多少东西，结果写了整整一下午到现在，一个 Markdown 文档，手写居然达到了 900 多行、将近 40KB，令我也大吃一惊。

也许我之后还会继续鼓捣我的服务器，那时候就继续写下去吧。现在也许该考虑考虑期末考试了（笑。
