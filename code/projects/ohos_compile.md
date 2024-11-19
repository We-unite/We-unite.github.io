<!-- 鸿蒙开发环境搭建 -->

> 本次编译环境搭建参考了以下博客：
>
> - [HiHope_DAYU200/开发环境搭建编译指南](https://gitee.com/hihope_iot/docs/blob/master/HiHope_DAYU200/%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA%E7%BC%96%E8%AF%91%E6%8C%87%E5%8D%97.md)
> - [基于 Ubuntu 20.04 配置 OpenHarmony 开发环境](https://juejin.cn/post/7257553293889634363)
> - [OpenHarmony 源码编译步骤(基于 3.2 beta3)](https://blog.csdn.net/jwq1220/article/details/127303546?csdn_share_tail=%7B%22type%22%3A%22blog%22%2C%22rType%22%3A%22article%22%2C%22rId%22%3A%22127303546%22%2C%22source%22%3A%222401_82617925%22%7D&fromshare=blogdetail)
> - [FAILED: load BTF from vmlinux: Unknown error -2](https://unix.stackexchange.com/questions/616392/failed-load-btf-from-vmlinux-unknown-error-2make-makefile1162-vmlinu)

# 环境与依赖

## 硬件环境

编译过程使用的是 `Ubuntu`，经测试，`Ubuntu 22.04 LTS`/`Ubuntu 20.04 LTS`/`Ubuntu 18.04 LTS` 均可用。

网上的大多数博客里没有对编译的硬件限制作出说明，现根据我们的情况，给出一个大概的范围：

- **内存必须在 10G 以上**，我使用的是 13G，编译成功（8G 时编译失败了，下文会说明）
- **磁盘 160G 或以上**
  - 源码大小就 36G 左右了
  - 大量的依赖会占据数十 G 的空间
  - 我用的是 160G 磁盘，编译成功，但基本不剩什么空间了
- 注意所需要的**ohos 的版本、cpu 版本、位数等信息**

这里我用的是 VMWare+Ubuntu22.04 虚拟机。

## 软件包依赖

安装依赖在博客中都有讲，但**少了一部分依赖项**，我因而将所有必要的依赖项整理到一个脚本里了：

```bash
#!/bin/bash
set -e # 一旦出错立刻停止执行，不会执行后续指令

# 更新软件源
sudo apt update
sudo apt upgrade

# 官方博客说明的依赖项
sudo apt install binutils git git-lfs gnupg flex \
	bison gperf build-essential zip curl zlib1g-dev gcc-multilib g++-multilib \
	libc6-dev-i386 lib32ncurses5-dev x11proto-core-dev libx11-dev lib32z1-dev ccache \
	libgl1-mesa-dev libxml2-utils xsltproc unzip m4 bc gnutls-bin \
	python3-pip ruby libtinfo-dev libtinfo5 \

# 官方博客未说明，但安装过程中报缺失的依赖项
sudo apt install openjdk-8-jdk libssl-dev libelf-dev default-jdk \
	genext2fs u-boot-tools mtd-utils scons gcc-arm-none-eabi \
	liblz4-tool

# 别的博客说明的依赖项
sudo apt install device-tree-compiler lib32stdc++6 lib32z1 libncurses5-dev lib32ncurses6

# 检查是否存在python3，如不存在则为之安装
if ! [ -x "$(command -v python3)" ]; then
	sudo apt install python3
fi
# 是否有python，如没有则建立软连接到python3的位置
if ! [ -x "$(command -v python)" ]; then
	sudo ln -s $(which python3) /usr/bin/python
fi
```

这里需要注意的是，**如果安装过程中出现报错，在修改之后，必须重新执行整个脚本**，因为在 apt 发现找不到某个软件包之后，后续的包与命令都不会执行。

# 配置 git

## git 基础设置

在上边我们已经下载了本次所需要的`git`与`git-lfs`，接下来我们需要对`git`进行基础设置。

```bash
# 设置用户名与密码，新用户必做
# 这里的用户名与密码只是一个写在git提交记录中的标识，可以与gitee/github账号无关
git config --global user.name "yourname"
git config --global user.email "your-email-address"
# git凭证缓存，必做
git config --global credential.helper store
# git默认的文本编辑器是nano，我一般喜欢改为vim，选做
git config --global core.editor vim
```

## gitee 帐户

由于 OpenHarmony 的源码托管在 gitee 上，所以我们需要在 gitee 上注册一个帐户。注册的方法在此不复赘述。

本次编译过程中，我们并不需要提交代码，因而可以仅通过 http 方式从 gitee 下载源码——如果是这样的话，**就不需要进行 git 与 gitee 关联**；如果想要提交代码，那么需要将本地的 git 与 gitee 账号关联起来，具体操作如下：

```bash
# 在本地执行
ssh-keygen -t rsa -C "your-email-address"
```

命令执行后，每次需要输入都直接回车，**连续有三个回车**，执行就会结束，ssh 密钥对的公钥和私钥分别保存在`~/.ssh/id_rsa.pub`和`~/.ssh/id_rsa`中。

在 gitee 用户的设置界面，将公钥`id_rsa.pub`的内容复制到 gitee 的 SSH 公钥中，保存即可。

此时，我们就可以通过 ssh 的方式与 gitee 进行交互、也可以免密提交代码了。

# 系统源码编译

## 配置 repo 工具

```bash
curl -s https://gitee.com/oschina/repo/raw/fork_flow/repo-py3 > ~/repo
chmod a+x ~/repo
sudo mv ~/repo /usr/local/bin/repo
sudo chown root:root /usr/local/bin/repo

pip3 install -i https://repo.huaweicloud.com/repository/pypi/simple requests
```

需要注意的是，不能直接使用 sudo 搭配管道，这是因为`/usr/local/bin`是一个只有 root 用户才有写权限的目录，而 sudo 命令虽然是以 root 身份执行，但**重定向时候 sudo 用的也是当前用户身份**，权限不足，自然报错。（**如果是管道，那么 sudo 也是只对当前命令有效，而不是对后续的整个管道有效。**）

## 获取源码

这里需要注意的是，一般情况下最好使用带有 v 和 Release 的版本。不带 Release 不是发布版，会随时更新代码，容易编译出错；带 Release 的也有两种 tag，是带 v 和不带 v 的区别，如`OpenHarmony-v4.0-Release`和`OpenHarmony-4.0-Release`。二者的区别主要在于，不带 v 的是官方维护的稳定版，也会更新代码，厂商的补丁一般只针对带 v 的使用。

通过 repo + https/ssh 下载：

```bash
# 如果需要的是特定分支，-b后边改成对应分支名
# repo init -u https://gitee.com/openharmony/manifest.git -b master --no-repo-verify
# 如果是tag，-b后的参数比较复杂，要在网页上提前确定好需要的tag名字，
# 如下载的是tag为OpenHarmony-v3.2-Release的版本，命令如下：
# repo init -u https://gitee.com/openharmony/manifest -b refs/tags/OpenHarmony-v3.2-Release --no-repo-verify
# 除使用https外，也可以通过ssh下载
# repo init -u git@gitee.com:openharmony/manifest.git -b master --no-repo-verify
repo init -u https://gitee.com/openharmony/manifest -b refs/tags/OpenHarmony-v4.0-Release --no-repo-verify
repo sync -c
repo forall -c 'git lfs pull'
```

## 补丁与编译

首先，打上厂商的补丁。下载对应版本补丁后，将补丁文件放到源码根目录下，执行：

```bash
unzip purple_pi_oh_patch.zip
cd purple_pi_oh_patch
./ido_patch.sh
```

看到`patch complete`字样，说明补丁成功。接下来进行 prebuilts 和编译：

```bash
# 先在源码根目录下执行脚本，安装编译器及二进制工具
bash build/prebuilts_download.sh

# 编译
# 注意：默认编译的时候，目标cpu是32位，即使为64位cpu也无法使用64位功能
# 如果是64位cpu，需要加上--target-cpu=arm64
# 编译rk3568时
# sudo ./build.sh --product-name rk3568 --ccache --target-cpu=arm64
sudo ./build.sh --product-name purple_pi_oh --ccache --no-prebuilt-sdk --target-cpu=arm64
```

## 编译完成

编译所生成的文件都归档在 out 目录下，结果镜像输出在源码根目录下的`out/rk3568/packages/phone/images`目录下。

自此源码编译成功，即可进行镜像烧录。

# 编译报错解决记录

以下记录编译过程中出现的一些出现过的报错、坑点和注意事项，以为后来者鉴。

## ssh 下载源码报错

在使用 ssh 下载时，第一步`repo init -u git@gitee.com:openharmony/manifest.git -b master --no-repo-verify`，报错：

```
Warning: Permanently added 'gitee.com,180.76.198.77' (ECDSA) to the list of known hosts.
```

经检查，发现 gitee 邮箱设置与公钥中邮箱存在差异，修改 gitee 邮箱设置后成功。

## 设备磁盘空间不足

编译过程中异常终止，并显示“设备上没有空间”。

**解决方法：**

- 在`VMWare`中扩大磁盘空间
  - **关闭虚拟机**
  - 在`VMWare`上方菜单栏中依次选择`虚拟机->设置->硬件->硬盘->扩展`，然后输入新的磁盘大小
  - 点击确定后会提示，说需要在虚拟机中扩展分区，才能使用新的磁盘空间
- 打开虚拟机，并扩展分区
  - 在命令行中输入`sudo apt install gparted`，安装`gparted`分区工具
  - 打开该工具，选择需要扩展的分区（一般为挂载到根目录`/`的那个分区），点击`Resize/Move`，然后拖动分区大小，点击`Resize/Move`，再点击`Apply`，等待分区扩展完成

如果在虚拟机里用 gparted 进行分区扩展时，弹窗说“分区被挂载为只读，无法调整大小”。此时我们需要：

- 右键该分区，查看挂载到什么位置了。一般是挂载到`/`与`/var/snap/firefox/common/host-hunspell`
- 执行以下命令：

```bash
# 对于这个设备挂载到的每一个分区，都执行以下命令，以此类推
sudo mount -o remount -rw /
sudo mount -o remount -rw /var/snap/firefox/common/host-hunspell
```

而后在 gparted 中点击`gparted->刷新设备`，即可进行分区扩展。

## Ninja 编译报错 `Code 4000`

编译 rk3568 过程中可能会出现以下报错：

```plaintext
[OHOS ERROR] Code: 4000
[OHOS ERROR] Reason: ninja phase failed
```

详细的报错信息已经丢失，将就着看吧。反正别的办法都不好使的时候试试这个。

此时执行以下内容即可：

```bash
rm -rf out
sed -i 's/CONFIG_DEBUG_INFO_BTF=y/# CONFIG_DEBUG_INFO_BTF=y/g' kernel/linux/config/linux-5.10/rk3568/arch/arm64_defconfig
```

而后重新编译。

## 另一个`Code 4000`

编译时报错如下：

```plaintext
ninja: build stopped: subcommand failed.
[91m[OHOS ERROR][0m Traceback (most recent call last):
[91m[OHOS ERROR][0m   File "/home/player/Desktop/ohos/src/build/hb/services/ninja.py", line 49, in _execute_ninja_cmd
[91m[OHOS ERROR][0m     SystemUtil.exec_command(
[91m[OHOS ERROR][0m   File "/home/player/Desktop/ohos/src/build/hb/util/system_util.py", line 63, in exec_command
[91m[OHOS ERROR][0m     raise OHOSException(
[91m[OHOS ERROR][0m exceptions.ohos_exception.OHOSException: Please check build log in /home/player/Desktop/ohos/src/out/purple_pi_oh/build.log
[91m[OHOS ERROR][0m
[91m[OHOS ERROR][0m During handling of the above exception, another exception occurred:
[91m[OHOS ERROR][0m
[91m[OHOS ERROR][0m Traceback (most recent call last):
[91m[OHOS ERROR][0m   File "/home/player/Desktop/ohos/src/build/hb/containers/status.py", line 47, in wrapper
[91m[OHOS ERROR][0m     return func(*args, **kwargs)
[91m[OHOS ERROR][0m   File "/home/player/Desktop/ohos/src/build/hb/modules/ohos_build_module.py", line 67, in run
[91m[OHOS ERROR][0m     raise exception
[91m[OHOS ERROR][0m   File "/home/player/Desktop/ohos/src/build/hb/modules/ohos_build_module.py", line 65, in run
[91m[OHOS ERROR][0m     super().run()
[91m[OHOS ERROR][0m   File "/home/player/Desktop/ohos/src/build/hb/modules/interface/build_module_interface.py", line 72, in run
[91m[OHOS ERROR][0m     raise exception
[91m[OHOS ERROR][0m   File "/home/player/Desktop/ohos/src/build/hb/modules/interface/build_module_interface.py", line 70, in run
[91m[OHOS ERROR][0m     self._target_compilation()
[91m[OHOS ERROR][0m   File "/home/player/Desktop/ohos/src/build/hb/modules/ohos_build_module.py", line 103, in _target_compilation
[91m[OHOS ERROR][0m     self.target_compiler.run()
[91m[OHOS ERROR][0m   File "/home/player/Desktop/ohos/src/build/hb/services/ninja.py", line 38, in run
[91m[OHOS ERROR][0m     self._execute_ninja_cmd()
[91m[OHOS ERROR][0m   File "/home/player/Desktop/ohos/src/build/hb/services/ninja.py", line 52, in _execute_ninja_cmd
[91m[OHOS ERROR][0m     raise OHOSException('ninja phase failed', '4000')
[91m[OHOS ERROR][0m exceptions.ohos_exception.OHOSException: ninja phase failed
[91m[OHOS ERROR][0m
[91m[OHOS ERROR][0m Code:      4000
[91m[OHOS ERROR][0m
[91m[OHOS ERROR][0m Reason:    ninja phase failed
[91m[OHOS ERROR][0m
[91m[OHOS ERROR][0m Solution:  Please check the compile log at out/{compiling product}/build.log, If you could analyze build logs.
[91m[OHOS ERROR][0m 		Or you can try the following steps to solve this problem:
[91m[OHOS ERROR][0m 		  1. cd to OHOS root path
[91m[OHOS ERROR][0m 		  2. run 'hb clean --all' or 'rm -rf out build/resources/args/*.json'.
[91m[OHOS ERROR][0m 		  3. repo sync
[91m[OHOS ERROR][0m 		  4. repo forall -c 'git lfs pull'
[91m[OHOS ERROR][0m 		  5. bash build/prebuilts_download.sh
[91m[OHOS ERROR][0m 		  6. rebuild your product or component
[91m[OHOS ERROR][0m
[91m[OHOS ERROR][0m 		If you still cannot solve this problem, you could post this problem on:
[91m[OHOS ERROR][0m 		  https://gitee.com/openharmony/build/issues
[91m[OHOS ERROR][0m
```

在报错信息之上，还有很多很多行，大致意思是正在对某些文件或仓库拉补丁，输出了补丁的 commit 信息。报错中最后提示的解决办法其实是无效的，我全量删除源码、甚至重装虚拟机，都还会遇到这个问题。

仔细分析报错信息，发现报错的根本原因是在 python 中**处理一个 Exception 时，又抛出了另一个 Exception，导致程序异常终止**。上网搜索可知，这种问题的一般原因是 python 同时拉取或爬取大量网页内容，但都失败了，导致同时出现两个异常，程序崩溃。具体到我们这里，问题就是拉补丁失败了，我检查了一下我的网络环境，发现我挂着梯子，梯子质量不是那么好。尝试将梯子关掉后，再次编译，问题解决。

## 一个奇怪的报错——`GN Failed`

这是一个很奇怪的报错，我们尚未找到真正的原因所在，只知道如何暂时地绕过去。

### 问题描述与复现

问题复现方法为在编译过程中，执行以下命令：

```bash
./build.sh --product-name rk3568 --ccache
```

该命令是指导书中写的编译命令，但执行时候会出错；**与上文所述的经确认无误的编译命令不同在于没加`sudo`**。

如果按照指导书的命令来，不出意外编译将会报错：
![](https://www.qin-juan-ge-zhu.top/images/code/ohos_gn_fail_1.png)
![](https://www.qin-juan-ge-zhu.top/images/code/ohos_gn_fail_2.png)

**以下是该问题的具体描述：**

`build.log`如下：

```plaintext
Set cache size limit to 100.0 GB
[OHOS INFO] loader args:['platforms_config_file="/home/axiomer/桌面/out/preloader/ohos-sdk/platforms.build"', 'subsystem_config_file="/home/axiomer/桌面/out/preloader/ohos-sdk/subsystem_config.json"', 'example_subsystem_file=""', 'exclusion_modules_config_file="/home/axiomer/桌面/out/preloader/ohos-sdk/exclusion_modules.json"', 'source_root_dir="/home/axiomer/桌面/"', 'gn_root_out_dir="out/sdk"', 'build_platform_name=phone', 'build_xts=False', 'load_test_config=False', 'target_os=ohos', 'target_cpu=arm64', 'os_level=standard', "ignore_api_check=['xts', 'common', 'testfwk']", 'scalable_build=False', 'skip_partlist_check=False']
[OHOS INFO] Excuting gn command: /home/axiomer/桌面/prebuilts/build-tools/linux-x86/bin/gn gen --args="product_name=\"ohos-sdk\" product_path=\"/home/axiomer/桌面/productdefine/common/products\" product_config_path=\"/home/axiomer/桌面/productdefine/common/products\" device_name=\"sdk\" device_path=\"/home/axiomer/桌面/device/board/ohos/sdk\" device_company=\"ohos\" device_config_path=\"/home/axiomer/桌面/device/board/ohos/sdk\" target_cpu=\"arm64\" is_standard_system=true ohos_build_compiler_specified=\"\" ohos_build_time=1707374188101 ohos_build_datetime=\"2024-02-08 22:36:28\" build_ohos_sdk=true build_ohos_ndk=true ohos_build_enable_ccache=true ohos_build_type=\"debug\" device_type=\"default\" build_variant=\"root\" use_thin_lto=false ndk_platform=\"linux\" sdk_for_hap_build=true skip_generate_module_list_file=true enable_lto_O0=true archive_ndk=false enable_ndk_doxygen=false use_cfi=false sdk_check_flag=false sdk_platform=\"linux\" root_perf_main=\"main\" runtime_mode=\"release\"" --args=product_name="ohos-sdk" product_path="/home/axiomer/桌面/productdefine/common/products" product_config_path="/home/axiomer/桌面/productdefine/common/products" device_name="sdk" device_path="/home/axiomer/桌面/device/board/ohos/sdk" device_company="ohos" device_config_path="/home/axiomer/桌面/device/board/ohos/sdk" target_cpu="arm64" is_standard_system=true ohos_build_compiler_specified="" ohos_build_time=1707374188101 ohos_build_datetime="2024-02-08 22:36:28" build_ohos_sdk=true build_ohos_ndk=true ohos_build_enable_ccache=true ohos_build_type="debug" device_type="default" build_variant="root" use_thin_lto=false ndk_platform="linux" sdk_for_hap_build=true skip_generate_module_list_file=true enable_lto_O0=true archive_ndk=false enable_ndk_doxygen=false use_cfi=false sdk_check_flag=false sdk_platform="linux" root_perf_main="main" runtime_mode="release" /home/axiomer/桌面/out/sdk
ERROR at //build/config/BUILDCONFIG.gn:92:15: Could not read file.
    read_file("${preloader_output_dir}/build_config.json", "json")
              ^------------------------------------------
I resolved this to "/home/axiomer/桌面/out/preloader/build_config.json".
root_out_dir=//out/sdk
root_build_dir=//out/sdk
root_gen_dir=//out/sdk/gen
current_toolchain=
[91m[OHOS ERROR][0m Traceback (most recent call last):
[91m[OHOS ERROR][0m   File "/home/axiomer/桌面/build/hb/containers/status.py", line 47, in wrapper
[91m[OHOS ERROR][0m     return func(*args, **kwargs)
[91m[OHOS ERROR][0m   File "/home/axiomer/桌面/build/hb/services/gn.py", line 197, in _execute_gn_gen_cmd
[91m[OHOS ERROR][0m     SystemUtil.exec_command(gn_gen_cmd, self.config.log_path)
[91m[OHOS ERROR][0m   File "/home/axiomer/桌面/build/hb/util/system_util.py", line 64, in exec_command
[91m[OHOS ERROR][0m     LogUtil.get_failed_log(log_path)
[91m[OHOS ERROR][0m   File "/home/axiomer/桌面/build/hb/util/log_util.py", line 191, in get_failed_log
[91m[OHOS ERROR][0m     LogUtil.get_gn_failed_log(log_path)
[91m[OHOS ERROR][0m   File "/home/axiomer/桌面/build/hb/util/log_util.py", line 137, in get_gn_failed_log
[91m[OHOS ERROR][0m     raise OHOSException(
[91m[OHOS ERROR][0m exceptions.ohos_exception.OHOSException: GN Failed! Please check error in /home/axiomer/桌面/out/sdk/error.log, and for more build information in /home/axiomer/桌面/out/sdk/build.log
[91m[OHOS ERROR][0m
[91m[OHOS ERROR][0m Code:        3000
[91m[OHOS ERROR][0m
[91m[OHOS ERROR][0m Reason:      GN Failed! Please check error in /home/axiomer/桌面/out/sdk/error.log, and for more build information in /home/axiomer/桌面/out/sdk/build.log
[91m[OHOS ERROR][0m
[91m[OHOS ERROR][0m Error Type:  UNKNOWN
[91m[OHOS ERROR][0m
[91m[OHOS ERROR][0m Description: An unknown error occurred while executing 'gn gen'.
[91m[OHOS ERROR][0m
[91m[OHOS ERROR][0m Solution:    There is no solution available. You can check the 'gn_error.log' in the output directory for more information
[91m[OHOS ERROR][0m
```

报错信息中提到`ERROR at //build/config/BUILDCONFIG.gn:92:15: Could not read file.`，但是经过检查文件，**存在名为`BUILDCONFIG.gn`的文件，且开放可读权限**；但报错信息中显示无法读该文件。

### 失败尝试

在此，我进行了许多尝试，但都无一例外失败了；以下是我的尝试点，或许会有帮助：

- 根据[一个相似提问]()，对相关依赖进行安装，失败了：
  ![](https://www.qin-juan-ge-zhu.top/images/code/ohos_gn_fail_dependencies.png)
- 根据报错信息，在编译命令中添加`--no-prebuilt-sdk`选项对 ohos-sdk 的构建进行跳过，依然失败

尝试未果 T^T

### 最终方案

报错信息如下所示：

在上述报错信息中提到`Permission denied`，即权限不够；于是尝试添加`sudo`，居然跑通了！！！！

在指导书的编译指令`./build.sh --product-name rk3568 --ccache`前添加权限设置`sudo`，即指令更改为：

```bash
sudo ./build.sh --product-name rk3568 --ccache
```

不知道为什么，编译过程中始终没有向我提出权限要求，但是不加`sudo`开权限就是跑不通，很奇怪 @ \_ @也许是 OHOS 内敛不好意思申请权限呢……

## 另一个奇怪的报错——`FAILED: load BTF from vmlinux: Unknown error -22`

关于这个报错，当时的错误日志、运行日志、聊天截图均已丢失，但时日不久，记忆还算清楚，加上这个报错困扰了我好些天，因而必须记录。

### 问题简要描述

正常按照`sudo ./build.sh --product-name rk3568 --ccache`编译时，报错，主要报错信息如下：

```plaintext
die__process_unit: DW_TAG_label (0xa) @ <0x3adc> not handled!
die__process_unit: DW_TAG_label (0xa) @ <0x3bdc> not handled!
die__process_unit: DW_TAG_label (0xa) @ <0x3bef> not handled!
die__process_unit: DW_TAG_label (0xa) @ <0x3ce5> not handled!
die__process_unit: DW_TAG_label (0xa) @ <0x3cff> not handled!
die__process_unit: DW_TAG_label (0xa) @ <0x3d19> not handled!
Killed
  LD      .tmp_vmlinux.kallsyms1
  KSYMS   .tmp_vmlinux.kallsyms1.S
  AS      .tmp_vmlinux.kallsyms1.S
  LD      .tmp_vmlinux.kallsyms2
  KSYMS   .tmp_vmlinux.kallsyms2.S
  AS      .tmp_vmlinux.kallsyms2.S
  LD      ymlinux
  BTEIDS  vmlinux
FAILED: load BTF from vmlinux: Unknown error -22make[2]: *** [/home/player/harmony/out/kernel/src_tmp/linux-5.19/
Makefile:1225: vmlinux]错误 255
make[1]: *** [arch/arm64/Makefile:208: rk3568-toybrick-x0-linux.img]错误2
make[1]: 离开目录"/home/player/harmony/out/kernel/OBJ/linux-5.10"
make: *** [Makefile:192:__sub-make]错误 2
```

可以看到，报错的关键点在于`FAILED: load BTF from vmlinux: Unknown error -22`这里。查看 Makefile 对应报错位置：

```makefile
vmlinux: scripts/link-vmlinux.sh autoksyms_recursive $(vmlinux-deps) FORCE
    +$(call if_changed,link-vmlinux)

targets := vmlinux
```

### 解释

- 这段 makefile 的实际功能是链接一个虚拟 linux
  - 通过目录位置，我们可以合理猜测，这里是在进行**linux 内核编译，但失败了**
- 报错中说的`BTF`则是数据格式
  - 一般出现`load BTF from xxx`错误时，是由于系统不一致导致的（也就是不同系统 BTF 格式不一样，出现了识别错误）
- 最重要的是，**Unknown error -22 这个报错码，搜不到任何信息！**

因而，我尝试了重装系统，将我的 Ubuntu22.04 重装为 20.04，但最后**仍然会出现这个错误**，足以证明不是系统差异导致的。

### 解决

最终，我在[第二篇参考博客](https://unix.stackexchange.com/questions/616392/failed-load-btf-from-vmlinux-unknown-error-2make-makefile1162-vmlinu)里找到了答案：编译较新的 Linux 内核时，至少需要 10G+内存，而我一贯把虚拟机内存只设置为 8G。

令人好奇的是，为什么需要这么大内存？按理来说在虚拟内存空间里，物理内存不够的时候，不应该是由 OS 出面进行内存与磁盘的页面调度吗？我认为，可能是在编译过程中，其他进程占据一部分内存，而这里在链接一个虚拟 linux 文件，可能文件体积过大而尚未创建完成，所有页面一直驻留在内存中，导致内存崩溃。

总而言之，言而总之，在`VMware->虚拟机->设置->硬件->内存`中，把内存扩大，就可以完美解决该问题。经我的测试，内存 13.2G(主机总内存 16G 时候推荐的最大虚拟机内存)是能编译完成的，编译时长 6h。最终解决。

# ohos 的 NDK

NDK 编译方式比较简单，在源码根目录下执行如下命令：

```bash
# 安装依赖
./build/build_scripts/env_setup.sh

# 执行完上述命令后记得执行source ~/.bashrc或者重启终端
source ~/.bashrc

# 安装编译SDK需要的依赖包（编译镜像的时候是不依赖这些包的）
sudo apt-get install libxcursor-dev libxrandr-dev libxinerama-dev

./build.sh --product-name ohos-sdk --ccache --build-target ohos_ndk
```

编译出来的 NDK 在`out/sdk/packages/ohos-sdk/linux/native`下。当然同时也有 windows 版本的 NDK，你猜在哪里？

将编译出来的 NDK 的 zip 解压到你想要的目录下，然后将该目录添加到环境变量中，即可使用。

注意，NDK 包提供的交叉编译工具是 cmake 和 ninja，编译器是 clang 和 clang++，并没有我们熟悉的 gcc/g++和 make。除此之外，NDK 还未我们提供编译所需的全套服务，如编译工具链配置文件`ohos.toolchain.cmake`、头文件、库文件等。快说，谢谢 ohos~

为了更方便地使用 NDK，鄙人不才，写了两个脚本，分别用于 cmake 编译和单文件编译：

```bash
#!/bin/bash

#######################################################################
# File Name    : compile.sh
# Encoding     : utf-8
# Author       : We-unite
# Email        : weunite1848@gmail.com
# Created Time : 2024-11-18 15:19:15
#######################################################################

set -e

if [ $UID -eq 0 ]; then
	echo "Please do not run this script as root"
	exit 1
fi

if [ $# -ne 2 ]; then
	echo "Usage: $0 <static|shared> <v7|v8>"
	exit 1
fi

if [ $2 == "v8" ]; then
	arch=arm64-v8a
elif [ $2 == "v7" ]; then
	arch=armeabi-v7a
else
	echo "Invalid architecture: $2"
	exit 1
fi

link=$1 # static or shared
native_path=~/app/native

export PATH=$native_path/build-tools/cmake/bin:$PATH

# 使用cmake编译，编译生成的文件运行在rk3568上
cmake -B build -D OHOS_STL=c++_$link -D OHOS_ARCH=$arch \ 
    -D OHOS_PLATFORM=OHOS \ 
    -D CMAKE_TOOLCHAIN_FILE=$(find $native_path -name ohos.toolchain.cmake)
cmake --build build
```

```bash
#!/bin/bash

#######################################################################
# File Name    : compile-tiny.sh
# Encoding     : utf-8
# Author       : We-unite
# Email        : weunite1848@gmail.com
# Created Time : 2024-11-16 13:06:58
#######################################################################

set -e
# 如果是root，报错
if [ $(id -u) -eq 0 ]; then
	echo "Do not run as root"
	exit 1
fi

if [ $# -ne 2 ]; then
	echo "Usage: $0 <src file> [armv8-a|armv7-a]"
	exit 1
fi

native=~/app/native
file=$1
targetFile=${file%.*}
arch=$2

case $arch in
	armv8-a)
		compiler=$native/llvm/bin/aarch64-unknown-linux-ohos
		targetPlatform=aarch64-linux-ohos
		;;
	armv7-a)
		compiler=$native/llvm/bin/armv7-unknown-linux-ohos
		targetPlatform=arm-linux-ohos
		;;
	*)
		echo "Unsupported arch"
		exit 1
		;;
esac

case ${file##*.} in
	c)
		compiler=$compiler-clang
		;;
	cpp)
		compiler=$compiler-clang++
		;;
	*)
		echo "Unsupported file type"
		exit 1
		;;
esac

export CPATH=

$compiler -o $targetFile $file -Wall \
	--target=$targetPlatform \
	--sysroot=$native/sysroot \
	-march=$arch -mfloat-abi=softfp
```

# 完结撒花

本次鸿蒙开发环境的搭建过程可谓一波三折，总结几个最大的坑点，或许可以作为编译的经验罢：

- **有报错，试试添加权限！**
- 贫贱程序猿百事哀，编译 OpenHarmony 系统需要**足够的硬件配置**
  - 内存 10G+
  - 磁盘 160G+

不说了，抓紧攒点钱开学升级电脑配置要紧……磁盘快炸了……
