<!-- 编译集成lcm模块 -->

# LCM 简介

LCM(Lightweight Communications and Marshalling)是一种轻量级的通信和编组库，是一种针对高带宽、低延迟、实时性要求高的场景下的通讯工具，用于在多个进程之间传递消息。LCM 的设计目标是提供一种简单的方法来传递结构化数据，而不需要复杂的 API 或协议定义。LCM 的消息传递是基于发布/订阅模型的，发布者和订阅者之间通过一个中心化的消息传递系统进行通信。

在机器人和自动驾驶系统中，LCM 可作为 ROS 的替代品，借以完成进程间、设备间的通讯。

为了方便地在不同进程、不同设备间传递数据，我们在 OHOS 系统中集成了 LCM 模块。

参考文档：

- [LCM 官方文档](https://lcm-proj.github.io/)
- [一篇博客](https://zhuanlan.zhihu.com/p/621943685)

# 依赖项安装

```bash
sudo apt update
sudo apt upgrade
sudo apt install build-essential cmake libglib2.0-dev
sudo apt install openjdk-8-jdk # lcm仅支持jdk8
```

# x86 的 lcm

如果我们仅仅需要 x86 架构的 lcm，执行下列命令即可：

```bash
git clone https://github.com/lcm-proj/lcm
cd lcm
mkdir build && cd build
cmake ..
make
sudo make install
```

编译完成后，注意观察<kbd>build</kbd>目录下是否有<kbd>lcm-java</kbd>文件夹，如果没有，证明没有安装 java 或者 java 版本不对。

## lcm-python

若想使用<kbd>lcm-python</kbd>，在<kbd>lcm/lcm-python</kbd>下执行`sudo python3 setup.py install`即可，使用时`import python`。

## lcm-spy 的使用

lcm-spy 是 LCM 配套的数据可视化工具。
可以通过 lcm-spy 监视 lcm 数据发送频率、数据量、数据结构，甚至实时画图。
如果安装了 JAVA，则 lcm-spy 会连同 LCM 一同被安装。

启动 lcm-spy：

```bash
export CLASSPATH=${your lcm-type class path}
lcm-spy
```

# 交叉编译

既然 lcm 用的是 cmake，何不交叉编译到 OHOS 里用呢？

首先，我们可以设置一下 Native Development Kit（NDK）的路径：

```bash
# 设置成自己的NDK工具目录
export OHOS_ROOT=~/app/native
```

```bash
$OHOS_ROOT/build-tools/cmake/bin/cmake \
      -DOHOS_STL=c++_shared \
      -DOHOS_ARCH=armv8-a \
      -DOHOS_PLATFORM=OHOS \
      -DCMAKE_TOOLCHAIN_FILE=$(find $OHOS_ROOT -name "ohos.toolchain.cmake")
```

不出意外的话，就要出意外了。果不其然，报错<kbd>Could NOT fid Glib2</kbd>。思考之后，我们认为，问题出现在 lcm 所依赖的 glib 库上：在 x86 架构上，我们直接向系统安装了`libglib2.0-dev`，而 lcm 编译时直接从系统里找到了这个库；但当交叉编译时，由于 OHOS 交叉编译工具未提供 libglib2.0-dev，lcm 找遍了系统也没找到 arm 架构下的这个库，因而直接报错。

解决方案自然是自己手动交叉编译`libglib2.0-dev`。

## Glib2.0 交叉编译

从[官网](https://download.gnome.org/sources/glib/)下载 glib-2.79.2 源码，解压后进入源码目录。

```bash
mkdir glib && cd glib
wget https://download.gnome.org/sources/glib/2.79/glib-2.79.2.tar.xz
tar -xvf glib-2.79.2.tar.xz
mkdir build
```

这里需要注意的是：

- 虽然 glib 编译需要`meson`，但它并不能直接交叉编译，OHOS 也并未提供用于交叉编译的`meson`。
- `meson`要求保证源码目录与构建目录不能相同，以保证构建过程的干净，因此我们在源码目录外新建了一个`build`目录。

接着，参考博客[这篇博客](https://t.csdnimg.cn/YfSJC)，撰写如下<kbd>meson_ohos.txt</kbd>（友情提醒，使用该文件时把<kbd>native</kbd>也就是 NDK 的路径修改为自己的路径、源平台与目标平台按需修改）：

```meson
[binaries]
c = '$OHOS_ROOT/llvm/bin/aarch64-unknown-linux-ohos-clang'
cpp = '$OHOS_ROOT/llvm/bin/aarch64-unknown-linux-ohos-clang++'
ar = '$OHOS_ROOT/llvm/bin/llvm-ar'
strip = '$OHOS_ROOT/llvm/bin/llvm-strip'
ld = '$OHOS_ROOT/llvm/bin/llvm-link'

[properties]
skip_sanity_check = true
sys_root = '$OHOS_ROOT/sysroot'
c_args = ['-L$OHOS_ROOT/sysroot/usr/lib/aarch64-linux-ohos']

[host_machine]
system = 'linux'
cpu_family = 'aarch64'
cpu = 'aarch64'
endian = 'little'

[target_machine]
system = 'ohos'
cpu_family = 'aarch64'
cpu = 'armv8a'
endian = 'little'
```

将该文件放置在<kbd>glib-2.79.2</kbd>源码目录下，而后在<kbd>build</kbd>目录下执行以下命令：

```bash
meson --cross-file=../glib-2.79.2/meson_ohos.txt ..
ninja
```

编译完成，正确地安装 glib2 到交叉编译工具链中（？？？），之后我们回到 lcm 的源码目录，重新执行 cmake 命令：

```bash
$OHOS_ROOT/build-tools/cmake/bin/cmake \
      -DOHOS_STL=c++_shared \
      -DOHOS_ARCH=armv8-a \
      -DOHOS_PLATFORM=OHOS \
      -DCMAKE_TOOLCHAIN_FILE=$(find $OHOS_ROOT -name "ohos.toolchain.cmake")
```

这次，编译成功了。万岁！
