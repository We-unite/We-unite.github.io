<!-- 鸿蒙开发环境搭建 -->

[toc]

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

这里我用的是 VMWare+Ubuntu22.04 虚拟机。

## 软件包依赖

安装依赖在博客中都有讲，但**少了一部分依赖项**，我因而将所有必要的依赖项整理到一个脚本里了：

```bash
#!/bin/bash

##########################################################################
# File Name    : harmony.sh
# Encoding     : utf-8
# Author       : We-unite
# Email        : weunite1848@gmail.com
# Created Time : 2024-02-07 12:32:50
##########################################################################

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

# 配置 repo 工具

**注意：前两条命令需要以 root 身份执行！！！**

```bash
# 以下两条命令需要以root身份执行
curl -s https://gitee.com/oschina/repo/raw/fork_flow/repo-py3 > /usr/local/bin/repo
chmod a+x /usr/local/bin/repo

# 这条普通身份也可以
pip3 install -i https://repo.huaweicloud.com/repository/pypi/simple requests
```

之所以前两条命令需要以 root 身份而不能是 sudo，是因为`/usr/local/bin`是一个只有 root 用户才有写权限的目录，而 sudo 命令虽然是以 root 身份执行，但**重定向时候 sudo 用的也是当前用户身份**，权限不足，自然报错。（**如果是管道，那么 sudo 也是只对当前命令有效，而不是对后续的整个管道有效。**）

# 系统源码编译

## 获取源码

通过 repo + https/ssh 下载：

```bash
# 通过http下载
repo init -u https://gitee.com/openharmony/manifest.git -b master --no-repo-verify
# 或者也可以通过ssh下载
# repo init -u git@gitee.com:openharmony/manifest.git -b master --no-repo-verify
repo sync -c
repo forall -c 'git lfs pull'
```

## prebuilts 与编译

```bash
# 先在源码根目录下执行脚本，安装编译器及二进制工具
bash build/prebuilts_download.sh
# 再执行如下命令进行版本编译
sudo ./build.sh --product-name rk3568 --ccache
```

## 编译完成

编译所生成的文件都归档在 out 目录下，结果镜像输出在源码根目录下的 out/rk3568/packages/phone/images 目录下。

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

# 完结撒花 ❀

本次鸿蒙开发环境的搭建过程可谓一波三折，总结几个最大的坑点，或许可以作为编译的经验罢：

- **有报错，试试添加权限！**
- 贫贱程序猿百事哀，编译 OpenHarmony 系统需要**足够的硬件配置**
  - 内存 10G+
  - 磁盘 160G+

不说了，抓紧攒点钱开学升级电脑配置要紧……磁盘快炸了……
