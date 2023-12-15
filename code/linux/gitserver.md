<!-- git 远程存储 -->

> 争名夺利几时休，早起迟眠不自由。
>
> 骑着驴骡思骏马，官居宰相望王侯。

自打在服务器上完成了代码环境的配置，我就在想，要是有一个自己的远程 git 存储库该多好？

# gitlab

我按照网上的教程，我更新了清华镜像源，下载安装 gitlab。孰料一次一次在安装过程卡死，而且情况十分严重，CPU
占用率长期维持在 50%以上，内存更是飙升到 90%，不仅安装进行不下去了，甚至一切操作都无法执行，包括<kbd>Ctrl+C</kbd>想要杀死当前进程的请求也会石沉大海。没办法，只得强制重启。

如是反复若干次，最终死心，将 gitlab 彻底从云服务器卸载，"革职为民，永不叙用"。

经过上网查找，原因果然出现在配置上。**gitlab 推荐的最小内存是 4G，但是目前我们只有 2G，内存爆满也就理所当然了。**没办法，期限之内不能更改配置，就算能更改，我都穷到薅资本主义羊毛了，还能有钱升级配置？笑死。

就因为这个问题，我们就不干了？这是不行滴，小同志。

不久之后，黄四郎同志发来了一篇阮一峰的博客：[最简单的 git 服务器](https://www.ruanyifeng.com/blog/2022/10/git-server.html)。看起来似乎不错，但是失之简略。幸好，我在 git 官方教程[Pro Git](https://git-scm.com/book/zh/v2)上找到了另一部分，两个拼一拼、试一试，最终成功了。

# 前置

首先，我建议为 git 托管创建专门的用户。这样做有以下几个目的：

- 安全
  - 如果使用常用用户，仓库托管在家目录下的某一级目录，容易一个不注意自己把仓库删了
  - 如果使用 root 用户，找一个目录进行管理，则权限过高，也容易被误操作；除此之外，root 用户一般不会设置为 ssh 登录，这就意味着想简单创建一个库，我们需要先 ssh 登陆，然后切换到 root 用户、进入存放目录/创建，最后退出，整个操作过程较为烦人且无法自动化实现
- 方便使用。创建专门用户后，我们可以为之配置 ssh 密钥，从而实现免密登陆，而且创建新仓库、clone 仓库都较为简单（因为直接托管在家目录之下，不需要记较长的路径名）

当然，创建单独用户的理由不止这么简单，它在我们使用 http 来托管仓库的时候有专门的作用，下文会讨论到。

我为其创建了一个名为`git`的用户，家目录`/home/git`，但不授予 sudo 权限。

# ssh 服务

首先，本方法要求有一个本地 git 存储库，并且已经有 commit。如果是本地新建的仓库，需要先有一个 commit，然后继续操作。这个 commit 可以用编写`.gitignore`或者`push.sh`等不甚重要的文件来凑数。

## 远程仓库

```bash
# 创建远程仓库，这里也叫test吧
ssh git@127.0.0.1 git init --bare test.git
```

注意，本处指明的 git 为远程用户名，127.0.0.1 代表云服务器的公网 ip，test.git 为远程仓库名。使用的时候都需要换成自己的。如果仓库不想直接存储在用户目录下，需要指出其存储路径，如`code/fuck/test.git`

## 本地与远程连接

本地和远程都有了，下一步就是建立联系了。

```bash
# 本地添加远程库信息
git remote add origin git@127.0.0.1:test.git

# 此时尚不能直接推送，因为并未指定上游对应分支，需要指定
git push --set-upstream origin master

# 之后就可以直接推送了
bash push.sh
```

## 自动化

整体操作过程可以说比较简单了。既然如此，**脚本，启动！**

```bash
#!/bin/bash

read -p "Local repo name: " local_name
read -p "Remote repo name: " remote_name

# 远程仓库创建
tmp="ssh aliyun-git git init --bare $remote_name.git"
eval "$tmp"

# 本地仓库创建
mkdir "$local_name"
cd "$local_name"
git init

# 本地仓库初始化
# 编写.gitignore
cat > .gitignore << EOF
*.sh
*.bat
*.exe
*.[oa]
*.pyc
__pycache__
*.vscode
*.swp
EOF

# 编写push.sh
cat > push.sh << EOF
git add .
git commit
git push
EOF
chmod +x push.sh

# 提交初始化commit
git add .
git commit -m "Initial commit"
tmp="git remote add origin aliyun-git:$remote_name.git"
eval "$tmp"
git push --set-upstream origin master

echo "Success!"
```

**Attention please:**

- 本地仓库名和远程仓库名不要加.git 后缀，程序会自动添加
- 如果要把这个脚本改写为其他语言的脚本的话，在转换本地当前工作目录（进入本地新创建的仓库）的时候，**一定要使用语言自带的调整当前工作目录的函数，不要调用系统命令**（如写为 C 语言程序的时候，应当是调用库函数`chdir()`而不是选择`system("cd <目录名>")`），否则编译器/解释器自动在这里作多线程执行，创建一个新的线程，运行一个终端，进入了该目录，然后没有后续，线程挂了；另一个线程在原来的代码上继续执行，但根本没进入目录，也就是执行操作的位置不对，最终出现错误。

# http(s)服务

到这里似乎已经万事俱备了，但在服务器迁移的过程中，我发现了问题：使用 ssh 服务，就意味着每个仓库记录的远程库都是其 ip 地址（或者自己在`~/.ssh/config`里规定的服务器别名），当服务器迁移后，需要手动进入一个个本地仓库修改远程库地址，非常麻烦。相比之下，如果使用像 github 一样的 http(s)服务，我们就只需要做好远程库迁移、dns 信息修改和服务器设置即可，本地仓库完全不需要改动。

于是，我发现了一篇[教程](https://www.aneasystone.com/archives/2018/12/build-your-own-git-server.html)，照葫芦画瓢起来。

需要注意的是，**上面的 ssh 服务不一定需要专门创建用户，但 http(s)服务这里我推荐新建用户**。

## 配套软件安装

首先，我们需要安装`git`和`nginx`，这里不再赘述。除此之外，我们会用到以下软件：

- `git-http-backend`：git 官方提供的 git 的 http(s) 服务后端。该软件包含在`git-core`中，一般会在安装 git 时就默认装了，可以通过`which git-http-backend`查看是否安装，没有的话需要安装`git-core`。默认安装位置在`/usr/lib/git-core/git-http-backend`，需要查看自己的路径，后边会用。
- `fcgiwrap`：一个用于将 FastCGI 转换为 HTTP 协议的工具。
- `htpasswd`：用于创建和更新基于文本的认证文件，用于存储用户名和密码。它是`apache2-utils`的一部分，可以通过`which htpasswd`查看是否安装，没有的话需要安装`apache2-utils`。

## nginx 配置与说明

最初的设置是这样的：

```conf
server
{
    # 这里用于将 http 请求重定向到 https，是一种常用的方式
    listen 80;
    server_name git.player.com;
    return 301 https://$host$request_uri;
}
server
{
    server_name git.player.com;
    listen 443 ssl;

    ssl_certificate /etc/letsencrypt/live/git.player.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/git.player.com/privkey.pem;

    location / {
        include fastcgi_params;
        # git-http-backend的路径，每次请求都会转发到这个脚本
        fastcgi_param SCRIPT_FILENAME /usr/lib/git-core/git-http-backend;
        # git-http-backend默认只能访问目录下有git-daemon-export-ok的仓库
        # 这里设置为可以访问所有仓库
        fastcgi_param GIT_HTTP_EXPORT_ALL "";
        # git仓库根目录
        fastcgi_param GIT_PROJECT_ROOT /home/git/;
        fastcgi_param PATH_INFO $uri;
        # 如果有认证，传递给cgi脚本git-http-backend
        fastcgi_param REMOTE_USER $remote_user;
        fastcgi_pass unix:/var/run/fcgiwrap.socket;
    }
}
```

nginx 重新加载配置之后，我们就可以正常`git clone https://git.player.com/test.git`了。但当我们 push 时，会出现 403 错误：

```bash
$ git push
fatal: unable to access 'https://git.player.com/test.git/': The requested URL returned error: 403
```

为了解决这个错误，我们可以在 `git-http-backend` 的官网文档 上找到这样的一段描述：

> By default, only the upload-pack service is enabled, which serves git fetch-pack and git ls-remote clients, which are invoked from git fetch, git pull, and git clone. If the client is authenticated, the receive-pack service is enabled, which serves git send-pack clients, which is invoked from git push.

第一次读这段话可能会有些不知所云，这是因为我们对这里提到的 `upload-pack/fetch-pack/receive-pack/send-pack` 这几个概念还没有什么认识。但是我们大抵可以猜出来，默认情况下，只有认证的用户才可以 push 代码。

我们可以在仓库中执行 `git config http.receivepack true` 来开启 push 权限，但是这样的话，所有人都可以 push 代码了，这显然不是我们想要的。我们可以通过 `git config http.receivepack false` 来关闭 push 权限，这样的话，所有人都不能 push 代码了，这也不是我们想要的。那么，我们应该怎么做呢？更好的做法是这样的：

```conf
$HTTP["querystring"] =~ "service=git-receive-pack" {
    include "git-auth.conf"
}
$HTTP["url"] =~ "^/git/.*/git-receive-pack$" {
    include "git-auth.conf"
}
```

看上去挺简单，但是想要理解为什么这样配置，就必须了解下 Git 的内部原理。正如上面 git-http-backend 文档上的那段描述，当 Git 客户端执行 `git fetch/git pull/git clone`时，会调用 `upload-pack` 服务，当执行 `git push` 时，会调用 `receive-pack` 服务。我们可以查看 nginx 的访问日志，目录在`/var/log/nginx/access.log`：

执行 git clone：

```log
[27/Nov/2018:22:18:00] "GET /test.git/info/refs?service=git-upload-pack HTTP/1.1" 200 363 "-" "git/1.9.1"
[27/Nov/2018:22:18:00] "POST /test.git/git-upload-pack HTTP/1.1" 200 306 "-" "git/1.9.1"
```

执行 git pull：

```log
[27/Nov/2018:22:20:25] "GET /test.git/info/refs?service=git-upload-pack HTTP/1.1" 200 363 "-" "git/1.9.1"
[27/Nov/2018:22:20:25] "POST /test.git/git-upload-pack HTTP/1.1" 200 551 "-" "git/1.9.1"
```

执行 git push：

```log
[27/Nov/2018:22:19:33] "GET /test.git/info/refs?service=git-receive-pack HTTP/1.1" 401 204 "-" "git/1.9.1"
admin [27/Nov/2018:22:19:33] "GET /test.git/info/refs?service=git-receive-pack HTTP/1.1" 200 193 "-" "git/1.9.1"
admin [27/Nov/2018:22:19:33] "POST /test.git/git-receive-pack HTTP/1.1" 200 63 "-" "git/1.9.1"
```

可以看到执行 clone 和 pull 请求的接口是一样的，先请求 `/info/refs?service=git-upload-pack`，然后再请求 `/git-upload-pack`；而 push 是先请求 `/info/refs?service=git-receive-pack`，然后再请求 `/git-receive-pack`，所以在上面的的配置中我们看到了两条记录，如果要对 push 做访问控制，那么对这两个请求都要限制。关于 Git 传输的原理可以参考 《Pro Git》的 [Git 内部原理 - 传输协议](https://git-scm.com/book/zh/v2/Git-%E5%86%85%E9%83%A8%E5%8E%9F%E7%90%86-%E4%BC%A0%E8%BE%93%E5%8D%8F%E8%AE%AE) 这一节。

于是，我们对 nginx 的配置文件进行修改：

```conf
server
{
    listen 80;
    server_name git.qin-juan-ge-zhu.top;
    return 301 https://$host$request_uri;
}
server
{
    server_name git.qin-juan-ge-zhu.top;
    listen 443 ssl;

    ssl_certificate /etc/letsencrypt/live/git.qin-juan-ge-zhu.top/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/git.qin-juan-ge-zhu.top/privkey.pem;

    location @auth {
        auth_basic "Git Server";
        # 生成的认证文件，下文专门说明
        auth_basic_user_file /etc/nginx/conf.d/git.htpasswd;

        include fastcgi_params;
        # git-http-backend的路径，每次请求都会转发到这个脚本
        fastcgi_param SCRIPT_FILENAME /usr/lib/git-core/git-http-backend;
        # git-http-backend默认只能访问目录下有git-daemon-export-ok的仓库
        # 这里设置为可以访问所有仓库
        fastcgi_param GIT_HTTP_EXPORT_ALL "";
        # git仓库根目录
        fastcgi_param GIT_PROJECT_ROOT /home/git/;
        fastcgi_param PATH_INFO $uri;
        # 如果有认证，传递给cgi脚本git-http-backend
        fastcgi_param REMOTE_USER $remote_user;
        fastcgi_pass unix:/var/run/fcgiwrap.socket;
    }

    location / {
        error_page 418 = @auth;
        if ( $query_string = "service=git-receive-pack" ) {
            return 418;
        }
        if ( $uri ~ "git-receive-pack$" ) {
            return 418;
        }
        include fastcgi_params;

        fastcgi_param SCRIPT_FILENAME /usr/lib/git-core/git-http-backend;
        fastcgi_param GIT_HTTP_EXPORT_ALL "";
        fastcgi_param GIT_PROJECT_ROOT /home/git/;
        fastcgi_param PATH_INFO $uri;
        fastcgi_param REMOTE_USER $remote_user;
        fastcgi_pass unix:/var/run/fcgiwrap.socket;
    }
}
```

这里我们可以看到，我们对`/git/.*/git-receive-pack`和`/info/refs?service=git-receive-pack`进行了限制，如果没有认证，就会返回 418 错误，然后 nginx 会将其转发到`@auth`这个 location，这个 location 会对请求进行认证，如果认证成功，就会将请求转发到`fastcgi_pass`指定的脚本，也就是`git-http-backend`，这样就可以正常 push 了。

> 为什么不直接在`/git/.*/git-receive-pack`和`/info/refs?service=git-receive-pack`这两个 location 中进行认证呢？如果这样做的话，会导致 clone 和 pull 也需要认证，那多不合适了~
>
> 418 是什么，http 协议没见过这个啊？这是 http 协议中的一个状态码，叫做 **I'm a teapot（我是一个茶壶）**，这个状态码是作为一个愚人节玩笑而创建的，但是它确实存在，可以参考 [RFC 2324](https://tools.ietf.org/html/rfc2324)。我们这里用它来做认证标识，以免和别的状态码冲突。当然你也可以自己规定状态码。

## 认证文件

nginx 的配置中我们用到了认证文件，它的生成是这样的：

```bash
# 创建认证文件并添加第一个用户
htpasswd -cd <文件名> <用户名> <密码>
# 在已有的文件中继续添加用户
htpasswd -d <文件名> <用户名> <密码>
```

到了这里，我们重启 nginx 然后进行测试，也许就可以正常使用了……吗？

## 问题

我在测试的时候发现了一个问题：

```bash
$ git clone https://git.player.com/test.git
Cloning into 'test'...
fatal: repository 'https://git.player.com/test.git/' not found
```

看起来很匪夷所思：我们明明把仓库放进了指定目录啊，nginx 也已经配置好了，为什么就是找不到呢？我在网上找了很久也没找到答案。最后自己发现了问题所在：**仓库文件夹权限不对**。

### Linux 权限描述

当我们使用`ls -l`命令查看文件夹时，会看到类似这样的输出：

```bash
drwxr-xr-x 2 git git 4096 Nov 27 22:19 test.git
```

其中前 10 个字符就是用来描述该目录权限的。

- 第一位字符代表文件类型
  - `d`表示目录
  - `-`表示文件
  - `l`表示链接文件
  - `b`表示块设备文件
  - `c`表示字符设备文件
  - `p`表示管道文件
  - `s`表示套接字文件。
- 接下来 9 个字符每 3 个一组，分别表示文件所有者、文件所有者所在组、其他用户对该文件的权限。
  - `r`表示可读
  - `w`表示可写
  - `x`表示可执行
  - `-`表示无对应权限

其中，读权限和写权限时不言自明的，可是**当我们在讨论文件夹的执行权限的时候，我们究竟在说什么？**其实，这里的执行权限指的是**进入该文件夹的权限**。如果一个文件夹没有执行权限，那么我们就无法进入该文件夹，也就无法访问该文件夹下的文件，即使有对应权限。

回到这个问题，我们可以看到，我们仓库存放的文件夹的权限很有可能是没有对应读写或进入权限。所以修改办法也很简单，改权限。

### 解决方案

修改权限的方法有以下几种：

- 直接把对应库及其下的所有文件/文件夹对所有其他用户赋予读写执行权限（权限使用`chmod -R 777 test.git`）。缺点很明显：
  - 不安全，任何人都可以访问该文件夹下的文件，尤其是 root 和 nginx 用户，前者权限太高，一旦出错足以破坏一切，后者容易导致危险（如强制停止或内存泄漏时）
  - 不方便。每次创建库都需要手动修改仓库及文件的权限，十分不便
- 不为 git 仓库设立单独用户，直接由原有用户或 root 用户接管一切。缺点：
  - 如果使用原有用户，仓库会和其他文件混在一起，不方便管理，且容易误操作
  - 如果使用 root 用户，权限太高，而且一般 root 不会设置为 ssh 登陆，这就意味着想简单创建一个库操作比较复杂
- 设立单独用户，将 nginx 的工作用户（一般为 www-data 或 root，在`/etc/nginx/nginx.conf`文件第一行规定）添加到该用户所在组。这种方式避免了文件混杂不方便管理的问题，也一定程度上避免了权限过高问题（注意，权限问题依然存在），可以说是一个比较好的解决办法。

**这也就是上文我推荐为 git 仓库托管设立单独用户的原因。**因而，最后我选择了第三种方案。具体操作如下：

```bash
usermod -aG git root
usermod -aG git www-data
```

此时再进行测试，应该就可以正常使用了。

## 其他存在的问题

除了上述问题已经解决之外，还有一些问题依然存在：

- 不管是 nginx 还是 git，在使用 http 上传的时候都会有一定的缓冲区限制，如果上传文件过大或累计多个 commit 才上传，很可能被拒收导致上传失败。这个问题在 github 上也存在，但是 github 的缓冲区限制比较大，一般不会出现这个问题。但是我们的服务器配置比较低，所以这个问题就比较严重了。解决办法是在 nginx 的配置文件中添加`client_max_body_size 100m;`，这样就可以将缓冲区限制扩大到 100M，一般来说足够了。
- 即使解决了缓冲区大小，偶尔也会被拒收，原因尚未查清
- 尚未能通过访问特定链接来实现 git 仓库的创建。据说是用 nginx 调用脚本，但暂时没弄出来
- 没有一个比较好用且功能较为完备的图形化界面（就像 github 那样）。
  - GitList 的界面看起来不错，而且能展示源码、clone 链接之类的，整体非常像 github 的界面，可惜使用的是我不会的 php 语言，而且没有找到详细一些的安装使用教程
  - cgit 是一个用纯 C 语言开发的一个 git 裸库展示，虽然界面看起来比较古早，但功能也很不错，能展示源码、自由切换分支、方便地查看提交历史（diss 一下 github，github 查看提交历史看起来真的很不方便很不直观）。美中不足的是**无法在界面上提供 clone 和源码下载功能**。不过毕竟是个开源软件，而且是我比较熟悉的 C，等有时间有能力了看看自己能不能实现这个功能吧。

这篇博客前前后后有二十多天了，该结束了。闲言少叙，看电视去也~