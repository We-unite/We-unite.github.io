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

## 硬件配置

服务器硬件配置应该都是固定的吧？CPU 双核，内存 2G，硬盘 40G，带宽 1MBps。我个人觉得这个配置还是挺不错的，毕竟是白嫖，要求也不能太高了不是？

操作系统方面，由于个人比较喜欢纯命令行操作，所以选择了 Ubuntu22.04 LTS，我的虚拟机也是这个版本，相对而言会比其他发行版更熟悉一些。

# 服务器初始化

在跟着创建实例的要求一步步做好之后，我们就拥有了一台属于自己的服务器了，并已经有了根用户 root。接下来，我们需要做一些初始化的工作。

## 创建新用户

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
# 找到root ALL=(ALL:ALL) ALL，
# 新开一行然后写一份一样的，把root改成player，保存退出
```

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

## 简单美化一下命令行

配到这里，我们会发现一个很操蛋的事情，“为啥命令提示符之前不显示当前用户名和当前路径嘞？这岂不是每次看路径都需要<kbd>pwd</kbd>吗？烦不烦啊！”别急，问题很好修改。

```bash
cd ~
vim .bashrc
# 找到PS1=，将其修改为PS1="\u@\h:\w\$"

# 加载.bashrc
source .bashrc
```

改好之后也许还是没有变化，我就是这样的。后来在处理其它问题的时候，我发现了根本原因所在：我 TM 创建用户的时候忘了加<kbd>-s</kbd>参数，导致新用户的默认 shell 是<kbd>sh</kbd>而不是<kbd>bash</kbd>。所以，我们需要修改一下新用户的默认 shell。

```bash
# 查看当前用户的默认shell
echo $SHELL

# 修改默认shell
sudo chsh -s /bin/bash player
```

这时再重新加载，就会发现，一切都正常了，一切是那么美好。

除此之外，我们也许想要调整命令行显示的用户名、路径之类内容的颜色，会想让命令行像 git bash 一样当我们进入 git 仓库的时候显示当前在什么分支。针对这两项需求，我修改了一下我的.bashrc 文件，现在其内容如下：

```bash
# ~/.bashrc: executed by bash(1) for non-login shells.
# see /usr/share/doc/bash/examples/startup-files (in the package bash-doc)
# for examples

# If not running interactively, don't do anything
case $- in
    *i*) ;;
      *) return;;
esac

# don't put duplicate lines or lines starting with space in the history.
# See bash(1) for more options
HISTCONTROL=ignoreboth

# append to the history file, don't overwrite it
shopt -s histappend

# for setting history length see HISTSIZE and HISTFILESIZE in bash(1)
HISTSIZE=1000
HISTFILESIZE=2000

# check the window size after each command and, if necessary,
# update the values of LINES and COLUMNS.
shopt -s checkwinsize

# If set, the pattern "**" used in a pathname expansion context will
# match all files and zero or more directories and subdirectories.
#shopt -s globstar

# make less more friendly for non-text input files, see lesspipe(1)
[ -x /usr/bin/lesspipe ] && eval "$(SHELL=/bin/sh lesspipe)"

# set variable identifying the chroot you work in (used in the prompt below)
if [ -z "${debian_chroot:-}" ] && [ -r /etc/debian_chroot ]; then
    debian_chroot=$(cat /etc/debian_chroot)
fi

# set a fancy prompt (non-color, unless we know we "want" color)
case "$TERM" in
    xterm-color|*-256color) color_prompt=yes;;
esac

# uncomment for a colored prompt, if the terminal has the capability; turned
# off by default to not distract the user: the focus in a terminal window
# should be on the output of commands, not on the prompt
#force_color_prompt=yes

if [ -n "$force_color_prompt" ]; then
    if [ -x /usr/bin/tput ] && tput setaf 1 >&/dev/null; then
    # We have color support; assume it's compliant with Ecma-48
    # (ISO/IEC-6429). (Lack of such support is extremely rare, and such
    # a case would tend to support setf rather than setaf.)
    color_prompt=yes
    else
    color_prompt=
    fi
fi

# 简单修改一下颜色
if [ "$color_prompt" = yes ]; then
    PS1='${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\[\033[00m\]'
else
    PS1='${debian_chroot:+($debian_chroot)}\u@\h:'
fi

# 如果是git仓库，在命令行提示符之前用不同的颜色显示当前分支
PS1="$PS1"'\[\033[33m\]'        # change to yellow
PS1="$PS1"'\w'                 # pwd
PS1="$PS1"'\[\033[36m\]'        # change color to cyan
PS1="$PS1"'`__git_ps1`'         # git branch
PS1="$PS1"'\[\033[0m\]'         # change color
#PS1="$PS1"'\n'                  # new line
PS1="$PS1"'\$ '                  # prompt: always $
unset color_prompt force_color_prompt

# If this is an xterm set the title to user@host:dir
case "$TERM" in
xterm*|rxvt*)
    PS1="\[\e]0;${debian_chroot:+($debian_chroot)}\u@\h: \w\a\]$PS1"
    ;;
*)
    ;;
esac

# enable color support of ls and also add handy aliases
if [ -x /usr/bin/dircolors ]; then
    test -r ~/.dircolors && eval "$(dircolors -b ~/.dircolors)" || eval "$(dircolors -b)"
    alias ls='ls --color=auto'
    #alias dir='dir --color=auto'
    #alias vdir='vdir --color=auto'

    alias grep='grep --color=auto'
    alias fgrep='fgrep --color=auto'
    alias egrep='egrep --color=auto'
fi

# colored GCC warnings and errors
#export GCC_COLORS='error=01;31:warning=01;35:note=01;36:caret=01;32:locus=01:quote=01'

# some more ls aliases
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'

# Add an "alert" alias for long running commands.  Use like so:
#   sleep 10; alert
alias alert='notify-send --urgency=low -i "$([ $? = 0 ] && echo terminal || echo error)" "$(history|tail -n1|sed -e '\''s/^\s*[0-9]\+\s*//;s/[;&|]\s*alert$//'\'')"'

# Alias definitions.
# You may want to put all your additions into a separate file like
# ~/.bash_aliases, instead of adding them here directly.
# See /usr/share/doc/bash-doc/examples in the bash-doc package.

if [ -f ~/.bash_aliases ]; then
    . ~/.bash_aliases
fi

# enable programmable completion features (you don't need to enable
# this, if it's already enabled in /etc/bash.bashrc and /etc/profile
# sources /etc/bash.bashrc).
if ! shopt -oq posix; then
  if [ -f /usr/share/bash-completion/bash_completion ]; then
    . /usr/share/bash-completion/bash_completion
  elif [ -f /etc/bash_completion ]; then
    . /etc/bash_completion
  fi
fi
echo This\ is\ .bashrc.

alias pip='python -m pip'
# 设置bash使用vim模式，允许使用0、dw之类常用vim快捷键，方便命令编辑
set -o vi
# 有时候我们需要一些魔法
export http_proxy=http://127.0.0.1:7890
export https_proxy=http://127.0.0.1:7890
```

# 配置 ssh

用着用着，就会发现：我为啥一直在浏览器里搞命令行？要是能直接在本地的命令行里搞就好了。当然，阿里云能满足我们。

## ssh 简介

什么是 ssh？ssh 是 Secure Shell 的缩写，中文名为安全外壳协议。ssh 是一种加密的网络协议，可以在不安全的网络中为网络服务提供安全的传输环境。ssh 是目前较可靠，专为远程登录会话和其他网络服务提供安全性的协议。利用 ssh 协议可以有效防止远程管理过程中的信息泄露问题。通过 ssh 可以对所有传输的数据进行加密，也能够防止 DNS 欺骗和 IP 欺骗。ssh 还支持在两个远程主机之间进行数据的传输。

说了也记不住，直接开干！

## 配置安全组规则

在阿里云控制台左上角点击，选择`云服务器ECS`，会进入云服务器实例控制界面。在左侧菜单栏寻找`安全组` ，添加安全组规则。按要求添加新的安全组规则，开放 TCP 协议对应的 22 端口。（其实可以都开了，但是毕竟不安全，建议后续按需开放。）

接着，在菜单栏中点击`密钥对`，创建新的密钥对。**完成之后会自动下载一个.pem 文件，我们需要将该文件保存好，丢失之后无法找回，这是 ssh 连接的密钥。**

为了方便用别名连接，我们需要一个配置文件：

- 将上述.pem 文件移动到家目录`C:\用户\当前用户名`的<kbd>.ssh</kbd>文件夹下
- 在<kbd>.ssh</kbd>文件夹下创建文件<kbd>config</kbd>，内容如下：

```plaintext
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

我的 vim 学习与配置[链接](https://www.qin-juan-ge-zhu.top/code/linux/vim.html)中有如下一些基本配置：

- vim 自带的代码高亮，感觉还是相当不错的
- 代码中常常需要的`()[]{}`自动匹配
- 同时开启绝对行号与相对行号，则当前行显示真实行号，其他行显示相对于当前行为上/下第几行，方便跳转。
- 代码按语法缩进，并且每次保存或退出时自动格式化
- 当前行/当前列各给一个颜色，因为有的平台光标显示很不明显，正常插入模式一般也不好确定光标位置，这样方便知道光标在哪。
- 自动折行，即当前行太长了会被折回来显示，但还是同一行，方便一次性看完整。
- 一些快捷键，如<kbd>L</kbd>到行末（替代够不到的<kbd>$</kbd>），还有<kbd>K/J</kbd>上/下移动 10 行等。
- 基本的状态栏设置，包括文件名、git 分支、文件编码、文件类型、总行数等信息，方便查看。
- 自动识别文件类型，并对`*.html, *.c, *.cpp, *.python`等文件在保存<kbd>:w<Enter></kbd>时自动格式化
- 插件和其他重重设置

这里使用了几个插件，插件管理目前用的是评价一般的`Vundle`。个人评价，下载插件啥的属实是慢，每次都报错报到怀疑人生，害得我都得手动安装然后在里边添加，但是别的目前还不会使。气死偶勒！

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

```plaintext
$ ps -ef | grep code-server
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
$ kill -9 2621
```

重新启动之后，就可以用`ip:post`访问在线 VSCode 了，初次访问会比较慢，耐心等待吧。

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

众所周知，我国是“工人阶级领导的、以工农联盟为基础的、人民民主专政的社会主义”国家，一切事关宣传、舆论的东西都要在党的领导下，都要经过审查备案，包括建网站和域名 https 使用。ICP 备案的原则是：**用谁的服务器，在谁那里备案**。以我为例，我在腾讯云买的域名、做的 DNS 解析，但用的是阿里云的服务器，就要在阿里云做 ICP 备案。

备案流程按按着走就行，只是有几点需要特别注意：

- 备案的省份需要与户籍所在省一致
- 备案网站名称不要太普通，容易和别人重复，会被客服小姐姐电话要求订正
- 网站名称不要出现“阁、楼、店”等一些容易误会为企业商业主体网站的名称，否则也会被退回。
- 网站用途描述要详细，尽量 30 字以上
  - 用途描述绝对不要出现“博客”等词，审查非常非常严格，而且极大可能直接被 ban。即使你真要博客，不能暗度陈仓吗？
  - 就算你要开评论区也不要说提及。**朋友，你也不想你的博客隔三差五被警察同志拿着放大镜看吧？**

提交备案之后。如有问题客服会打电话通知，并退回修改；阿里云初审需要大概不到 1 天，工信部短信确认需要 1 天，然后发送到备案省（即户籍所在省）的管局，时长最多 20 天，建议提前搞。我用了 6 天。

## Nginx 代理

都做好之后，访问`code.player.com`，发现啥也没有，浏览器说对面没反应。是的，因为 A 记录只解析到了 ip，并没有解析到指定端口，而 http 默认端口 80，https 默认端口 443，都和上边 code-server 指定的端口 8080 不一样。

没错，我们需要一个代理，根据访问的网址来对应到指定端口。

### 安装、运行与常用操作

```bash
sudo apt install nginx
# 安装完成后如果服务器重启，nginx会自动启动，手动启动命令如下
sudo nginx

# 停止服务
sudo nginx -s stop

# 重新加载配置文件（适用于修改了配置文件但不需要重启的场景）
sudo nginx -s reload
```

### SSL 证书

想要使用 https 方式，还需要一个 SSL 证书，每个域名一个证。腾讯云比较坑，必须花钱。这里我用的是 Certbot 免费发放的证书。

首先，下载 Certbot:

```bash
sudo apt install certbot
```

在申请证书之前，需要停止 nginx 的工作，如果正在运行，按照上边说的方法杀死，而后就可以申请证书辣！

```bash
# 申请证书
sudo certbot certonly --standalone --email example@qq.com -d code.player.com

# 除了使用参数方式外，也可以使用交互的方式
sudo certbot certonly
```

申请完成后会展示证书的存储路径，记下来，后边会用到。比如：

SSL 证书 /etc/letsencrypt/live/code.player.com/fullchain.pem;

SSL 证书秘钥 /etc/letsencrypt/live/code.player.com/privkey.pem;

### 修改、添加配置

Nginx 默认下载目录在`/etc/nginx`，该目录下有个`.conf`文件，但不建议直接改，建议在`/etc/nginx/conf.d`文件夹下为每个需要转发的域名添加单独的设置文件，这样方便管理和修改。运行过程中 Nginx 会自动将该目录下所有配置文件全部加载的，不需要手动设置。

在`/etc/nginx/conf.d`中，新建文件`vscode.conf`，内容如下：

```conf
server
{
    # 这段是一个常用的http重定向到https的方法，用了都说好
    listen 80;
    server_name code.player.com;
    return 301 https://$host$request_uri;
}
server
{
    server_name code.player.com;
    listen 443 ssl;

    # 证书路径
    ssl_certificate /etc/letsencrypt/live/code.player.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/code.player.com/privkey.pem;

    # 这是对于code-server做出的设置
    location / {
        proxy_pass http://127.0.0.1:8080; # 这里的端口号要和code-server指定的端口号一致，我是8080
        proxy_set_header Host $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection upgrade;
        proxy_set_header Accept-Encoding gzip;
    }

    # 如果文件对应的是webroot服务（也就是一个文件夹下存放着指定网址的网页）
    # 需要将上边的配置修改为
    # location / {
    #     root /var/myweb/; # 这里是文件夹路径
    #     index index.html; # 这里是每个文件夹下默认打开的文件
    # }
}
```

编写完文件之后，需要重新加载配置文件（不必重启 Nginx）：

```bash
sudo nginx -s reload
```

再次提醒：一定记得把域名换成自己的域名、证书路径换成自己的证书路径、端口换成自己在提供服务的应用（如 code-server）中指定的端口！

# 服务器上的文件浏览

我们已经学会了设置 nginx 的 webroot，但也有很多情况我们需要能在各种设备上直接地看到服务器上有哪些文件，既能方便文件传输，也能覆盖对大多数只需要看不需要改的场景。

python3 为我们提供了一个简单的 http 文件浏览服务，默认安装目录为`/usr/lib/python3.x/http/server.py`，一般情况下我们可以直接运行它：

```bash
python3 -m http.server
```

但是 python 提供的这份文件存在一些问题：

- 响应头没有规定文件编码，让浏览器自己看着办，容易出现乱码
- 里边选择性忽略了一些文件、文件夹

于是我在给定的基础上做了一些小修改，修改版的文件在[这里](https://www.qin-juan-ge-zhu.top/code/linux/httpmyserver.html)。

# git 远程存储

君不闻《西游记》有云：

> 争名夺利几时休，早起迟眠不自由。
>
> 骑着驴骡思骏马，官居宰相望王侯。

完成了代码环境的配置，我就在想，要是有一个自己的远程 git 托管环境该多好？那就干！

我的详细配置方法写在[这里](https://www.qin-juan-ge-zhu.top/code/linux/gitserver.html)里了。

# 游戏

> All work no play makes Jack a doll boy.

经过了上边的配置，写代码的控制基本完善了，但是服务器怎么能只拿来干活呢？没有游戏怎么行？我们要快乐！

目前我装了三个游戏：

- 俄罗斯方块，装的是`tint`
- 扫雷，装的是`minebash`
- 贪吃蛇，找不到力（允悲

安装方法网上都有，就不多说了。玩得愉快！

# 开机运行脚本

经过了以上的设置，我的服务器已经有了许多服务，特别是每个计算机人电脑里必然需要养的一只宠物——小蓝猫 clash。但是每次重启系统之后，这许多服务都需要自己手动拉起的话未免太过麻烦了，所以我们需要一个在系统加载完成后就能自动以 root 身份执行的脚本。经过查询，我找到了处理办法。

在 Linux 系统下，开机启动一般使用的是`/etc/rc.local`文件（但也有很多发行版不再使用这种操作方式）。ubuntu20.04 系统已经默认安装了 rc-local.service 服务，但是不知什么原因系统把这个服务给“隐蔽”了，所以如果不做一番操作是无法使用的。

```bash
# 以下所有命令需要root身份执行

cp /usr/lib/systemd/system/rc-local.service /etc/systemd/system/
# 修改rc-local.service文件，在文件末尾添加以下内容（注意删去前边的注释符）：
# [Install]
# WantedBy=multi-user.target

# 创建rc.local文件，带上shebang行
echo '#!/bin/bash' > /etc/rc.local
# 修改rc.local文件权限
chmod +x /etc/rc.local

# 上述步骤完成后，注意不要急于写rc.local脚本，我们需要先启动rc-local.service服务
systemctl start rc-local.service
systemctl enable rc-local.service
# 上述两条命令运行正常时，系统需要重启
reboot

# 重启完成后，检查rc-local.service服务是否正常运行
systemctl status rc-local.service

# 一切正常，就可以编写rc.local脚本的内容了
# 需要注意的是，该脚本以root身份运行，所以不需要sudo
# 如果部分命令需要以其他用户身份运行，可以使用su命令，如：
# su -l <username> -c <要运行的命令>
# 如果要运行的是脚本（不建议，没必要），注意对应参数
# 文件的最后，可以用exec &> /var/log/rc-local.log将脚本的输出重定向到日志文件中
```

除此之外，我们可能还需要为所有用户默认开启魔法。这个功能在开机脚本和`/etc/profile`中都无法实现，应当放在`/etc/environment`中。在其中添加以下内容：

```plaintext
PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin"
http_proxy=http://127.0.0.1:7890
https_proxy=http://127.0.0.1:7890
no_proxy=127.0.0.1,localhost
HTTP_PROXY=http://127.0.0.1:7890
HTTPS_PROXY=http://127.0.0.1:7890
NO_PROXY=127.0.0.1,localhost
```

该文件中的所有设置对于所有用户均有效，着实省去了每次开机、切换用户都要手动挂代理的麻烦。

# 碎碎念

> 王子猷（徽之）居山阴，夜大雪，眠觉，开室命酌酒，四望皎然。因起彷徨。咏左思《招隐诗》，忽忆戴安道（逵）。时戴在剡，即便夜乘小船就之。经宿方至，造门不前而返。人问其故，王曰：“吾本乘兴而行，兴尽而返，何必见戴！”
>
> ——《世说新语》

一时兴起跟着黄四郎同志搞了前端，又一时兴起薅资本主义羊毛搞服务器，甚至现在写这篇文档也是一时兴起。可能我就是这样一个人吧，想到哪里做到哪里，全是为了快乐。

这篇文档是对一个月以来搞云服务器的配置的一个小小总结，本来以为没多少东西，结果写了整整一下午到现在，一个 Markdown 文档，手写居然达到了 900 多行、将近 40KB，令我也大吃一惊。

也许我之后还会继续鼓捣我的服务器，那时候就继续写下去吧。现在该考虑考虑期末考试了（笑。
