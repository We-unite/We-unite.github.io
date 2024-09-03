# 背景说明

本文档对[godo](https://git.qin-juan-ge-zhu.top/godo)编写过程中新了解到的技术、遇到的问题进行简要说明，以备所需。

# 系统调用

As is universually acknowledged, 操作系统、尤其是类 Unix 操作系统，以系统调用的形式对应用程序提供服务。系统调用是名称，有系统调用号与之对应（同一版本的内核在不同架构的 cpu 上，系统调用号可能不一样）。有的时候我们需要了解一些内核行为，但却不知道从何下手。可以通过查看内核源码来学习。

系统调用可以在源码中查找到。由于本项目使用的是 centos 7，内核版本 3.10.0-1160、cpu 为 x86-64 架构，兹以该版本内核为例说明。

要查看 fork 的系统调用号，查看`arch/x86/syscalls/syscall_64.tbl`。想要查看其具体的实现，则在源码根目录下**执行`grep -rInP "SYSCALL_DEFINE\d\(fork"`**，其中 SYSCALL_DEFINE+数字是 kernel 中定义的宏，展开即完整的函数声明。通过这种查找办法，我们可以快速地定位内核中对系统调用的处理函数，查看其工作原理。查看其他的内核相关内容也可以采取类似办法，即**先用 grep 定位大致范围、看都有什么地方用到，然后找到真正起作用的地方，读相关代码。**

使用这些系统调用有两种办法：

- 在 C 语言中直接调用同名函数，但大概率经过了 glibc 的封装
- 手动封装。如下：

```c
#include <stdio.h>
#include <sys/syscall.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

int main(){
    pid_t pid = syscall(SYS_fork);
    // syscall是一个变参函数，第一个参数是系统调用号，接下来的是系统调用的各个参数
    // syscall定义在 unistd.h
    // SYS_fork定义在 sys/syscall.h
    if(pid == 0) {
        printf("Child!\n");
    } else {
        printf("Parent!\n");
    }
    return 0;
}
```

这种封装方式与经常被用来当作 os 教材的 Linux-0.11/0.12 有所区别。Linux-0.11 环境上，unistd.h 大致如下：

```c
#ifndef _UNISTD_H
#define _UNISTD_H

...
#include <sys/stat.h>
#include <sys/times.h>
#include <sys/utsname.h>
#include <utime.h>

#ifdef __LIBRARY__

#define __NR_setup	0	/* used only by init, to get system going */
#define __NR_exit	1
#define __NR_fork	2
#define __NR_read	3
#define __NR_write	4
#define __NR_open	5
#define __NR_close	6
...

#define _syscall0(type,name) \
  type name(void) \
{ \
long __res; \
__asm__ volatile ("int $0x80" \
	: "=a" (__res) \
	: "0" (__NR_##name)); \
if (__res >= 0) \
	return (type) __res; \
errno = -__res; \
return -1; \
}

#define _syscall1(type,name,atype,a) \
type name(atype a) \
{ \
long __res; \
__asm__ volatile ("int $0x80" \
	: "=a" (__res) \
	: "0" (__NR_##name),"b" ((long)(a))); \
if (__res >= 0) \
	return (type) __res; \
errno = -__res; \
return -1; \
}

...
#endif /* __LIBRARY__ */
...

#endif
```

可以看到，Linux-0.11 上，封装的一般方法为：

```c
#define __LIBRARY__ // 一定要在unistd.h之前
#include <unistd.h>
#include <stdio.h>

syscall0(int, fork); // 宏替换后这就是个名为fork的函数的具体实现了
int main() {
    if(fork() == 0) {
        printf("Child!\n");
    } else {
        printf("Parent!\n");
    }
    return 0;
}
```

但是无论如何，一般情况下不推荐手动封装，这不是 release 版该有的做法。

此外，从汇编代码来看，Linux-0.11 所用的 80386 芯片，不提供专门的系统调用指令，因而该系统使用的是`int 0x80`中断指令，通过注册中断处理函数进行对应处理；而**现代 x86 提供了专门的 syscall 指令**，Linux 系统直接用该指令进行系统调用。

## 系统调用中的进程与线程

一般地，在 Linux 系统上，我们以 pid 指代进程号，而进程可以有多个线程。很显然，真正被调度执行的单元应该是线程，换言之，**是 thread 而非 process 真正地对应着内核中 tasks 表里的一个 task，而每个 task 才具有独一无二的 id**。

### 常见系统调用的分析

看看这个：

```c
extern int pthread_create (pthread_t *__restrict __newthread,
			   const pthread_attr_t *__restrict __attr,
			   void *(*__start_routine) (void *),
			   void *__restrict __arg) __THROWNL __nonnull ((1, 3));
```

`pthread_create`函数的第一个参数，就是一个 pthread_t 类型的指针，处理后将 task 的 id 写到指针指向的区域。

让我们来看一段简单的代码：

```c
// test.c
#include <stdio.h>
#include <pthread.h>
#include <sys/syscall.h>
#include <sys/types.h>
#include <unistd.h>

void *test(void *args) {
    printf("Hello, I'm %d\n", getpid());
}

int main() {
    pthread_t pthid;
    int pid;
    pthread_create(&pthid, NULL, test, NULL);
    printf("main: thread %ld\n", pthid);
    pthread_join(pthid, NULL);
    if ((pid = fork()) == 0) {
        printf("Hello, I'm %d\n", getpid());
        return 0;
    }
    printf("main: child process %d\n",pid);
    if ((pid = syscall(SYS_fork)) == 0) {
        printf("Hello, I'm %d\n", getpid());
        return 0;
    }
    printf("main: child process %d\n",pid);
    return 0;
}
```

当我们使用`strace ./test`来查看上述代码时，会发现情况如下：

```c
clone(child_stack=0x7f3dd28bbff0, flags=CLONE_VM|CLONE_FS|CLONE_FILES|CLONE_SIGHAND|CLONE_THREAD|CLONE_SYSVSEM|CLONE_SETTLS|CLONE_PARENT_SETTID|CLONE_CHILD_CLEARTID, parent_tidptr=0x7f3dd28bc9d0, tls=0x7f3dd28bc700, child_tidptr=0x7f3dd28bc9d0) = 21756
write(1, "main: thread 139903502108416\n", 29) = 29
clone(child_stack=NULL, flags=CLONE_CHILD_CLEARTID|CLONE_CHILD_SETTID|SIGCHLD, child_tidptr=0x7f3dd308e9d0) = 21757
--- SIGCHLD {si_signo=SIGCHLD, si_code=CLD_EXITED, si_pid=21757, si_uid=1000, si_status=0, si_utime=0, si_stime=0} ---
write(1, "main: child process 21757\n", 26) = 26
fork()                                  = 21758
--- SIGCHLD {si_signo=SIGCHLD, si_code=CLD_EXITED, si_pid=21758, si_uid=1000, si_status=0, si_utime=0, si_stime=0} ---
write(1, "main: child process 21758\n", 26) = 26
exit_group(0)                           = ?
+++ exited with 0 +++
```

从这样的输出里，我们可以清晰地看到，**无论是`pthread_create`还是`fork`（指库函数），本质上都是封装了`clone`系统调用，即使 Linux 本身提供了专门的 fork 系统调用。**也许这是 glibc 和 Linux 都想在添加功能的基础上保证代码兼容性？花开两朵各表一枝了属于是。

这一结论也可以从 glibc 的代码中得到验证：

```c
// 文件 glibc-2.18/nptl/sysdeps/unix/sysv/linux/pt-fork.c
pid_t
__fork (void)
{
  return __libc_fork ();
}
strong_alias (__fork, fork)


// 文件 glibc-2.18/nptl/sysdeps/unix/sysv/linux/fork.c
pid_t
__libc_fork (void)
{
  ... // 一堆不知所云的代码
#ifdef ARCH_FORK
  pid = ARCH_FORK ();
#else
# error "ARCH_FORK must be defined so that the CLONE_SETTID flag is used"
  pid = INLINE_SYSCALL (fork, 0);
#endif
  ... // 又是一堆不知所云的代码
}

// 文件 glibc-2.18/nptl/sysdeps/unix/sysv/linux/x86_64/fork.c
#define ARCH_FORK() \
  INLINE_SYSCALL (clone, 4,						      \
		  CLONE_CHILD_SETTID | CLONE_CHILD_CLEARTID | SIGCHLD, 0,     \
		  NULL, &THREAD_SELF->tid)

// 文件 glibc-2.18/sysdeps/unix/sysv/linux/x86_64/syscall.S

/* Please consult the file sysdeps/unix/sysv/linux/x86-64/sysdep.h for
   more information about the value -4095 used below.  */
	.text
ENTRY (syscall)
	movq %rdi, %rax		/* Syscall number -> rax.  */
	movq %rsi, %rdi		/* shift arg1 - arg5.  */
	movq %rdx, %rsi
	movq %rcx, %rdx
	movq %r8, %r10
	movq %r9, %r8
	movq 8(%rsp),%r9	/* arg6 is on the stack.  */
	syscall			/* Do the system call.  */
	cmpq $-4095, %rax	/* Check %rax for error.  */
	jae SYSCALL_ERROR_LABEL	/* Jump to error handler if error.  */
	ret			/* Return to caller.  */

PSEUDO_END (syscall)
```

可以看到，fork 库函数实际上是掉入了`__libc_fork`，在经过各种处理之后，如果 glibc 中该平台的相关代码里定义了 ARCH_FORK 宏，则调用之；否则会直接调用`INLINE_SYSCALL`（这是 glibc 各个平台的代码里都有的宏）；而如果直接调用`syscall`函数手动封装系统调用，则调用什么就是什么。`syscall`函数调用过程涉及延迟绑定等问题，就不是这里的重点了，而且我也没太搞明白，有机会单开一篇吧。

### 进程与线程

对于一个进程而言，它有很多线程，每个线程有一个号，但整个进程都有主线程的号，称为 tgid，只有一个 tgid 能真正地代表一个进程，而 pid 事实上是 task 的编号。

对于 netlink connector 而言，它听到的 fork 并不是 fork，而是 clone；对于 audit，也只能听到 clone 而听不到 fork。这是因为在内核中，fork 也是通过调用 clone 的处理函数来进行的。clone 创建的是一个 task，至于具体是进程还是线程，取决于用的 flag 参数，参见 manual 手册。

因而，无论使用 connector 还是 audit，拿到的都是 pid，只不过 connector 可以直接拿到 tgid、据此确定是进程还是线程，而 audit 只能拿到 pid，需要从 clone 的参数里查看是进程还是线程，且拿不到 tgid。这也就是我在项目中选择使用 connector 听进程消息的原因。

干巴巴说了这么多，其实就是想说，pid 也许在不同的语境下有不同含义。

# docker 使用的技术

## cgroup

Linux 下用来控制进程资源的东西。没学明白，留缺。姑且抄点书上的内容来占个位置吧。

cgroup 是 control group 的简写，是 Linux 内核提供的一个特性，用于限制和隔离一组进程对系统资源的使用，也即做进程的 QoS。控制的资源主要包括 cpu、内存、block IO、网络带宽等。该特性自 2.6.24 开始进入内核主线，目前各大发行版都默认打开了该特性。

从实现角度，cgroup 实现了一个通用的进程分组框架，而不同类型资源的具体管理由各个 cgroup 子系统实现。截至内核 4.1，已经实现的子系统及其作用如下：

| 子系统     | 作用                                      |
| ---------- | ----------------------------------------- |
| devices    | 设备权限控制                              |
| cpuset     | 分配指定的 cpu 和内存节点                 |
| cpu        | 控制 cpu 占用率                           |
| cpuacct    | 统计 cpu 使用情况                         |
| memory     | 限制内存使用上限                          |
| freezer    | 冻结暂停 cgroup 中的进程                  |
| net_cls    | 配合 tc（traffic controller）限制网络带宽 |
| net_prio   | 设置进程网络流量优先级                    |
| huge_tlb   | 限制 huge_tlb 的使用                      |
| perf_event | 允许 Perf 工具基于 cgroup 分组做性能监测  |

cgroup 原生接口通过 cgroupfs 提供，类似于 procfs 和 sysfs，是一种虚拟文件系统。具体使用与分析参见《Docker 进阶与实战》。

## namespace

namespace 是将内核的全局资源做封装，使每个 namespace 拥有独立的资源，进程在各自的 namespace 中对相同资源的使用不会互相干扰。比如主机名 hostname 作为全局资源，执行 sethostname 系统调用会影响到其他进程；内核通过实现 UTS namespace，将不同进程分割在不同的 namespace 中，实现了隔离，一个 namespace 修改主机名不影响别的 namespace。

目前内核实现了以下几种 namespace：

| namespace | 作用                                |
| --------- | ----------------------------------- |
| IPC       | 隔离 System V IPC 和 POSIX 消息队列 |
| Network   | 隔离网络资源                        |
| Mount     | 隔离文件系统挂载点                  |
| PID       | 隔离进程 ID                         |
| UTS       | 隔离主机名和域名                    |
| User      | 隔离用户 ID 与组 ID                 |

对 namespace 的操作主要通过`clone/setns/unshare`三个系统调用来实现。详细的使用也不写了，没用过的东西就不全抄。记得读书和自己实验，补到这里。

### 文件系统

众所周知，docker 的文件系统是分层的，有镜像文件等一堆东西。文件系统分为若干层，在开启 docker 的时候会被联合挂载到同一个点下，作为 docker 的根目录。这叫做联合挂载，即将多个目录和文件系统挂载到同一个目录下，其中可能有覆盖等。

docker 进程运行在宿主机的内核上，但是根文件系统又要用 docker 自己挂载的目录，且后来的进程也需要进入该目录。这里采用的技术是 pivot_root，该系统调用允许进程切换根目录。

在根目录挂载完成之后，docker 拉起一个初始 shell（正如 Linux-0.11 启动的时候也会有一个 shell 干活），这是 docker 中第一个进程，它调用 pivot_root 切换根目录。在切换完成之后，当我们执行 docker exec 时，这是一个 docker 的新的进程，但该进程不再 pivot_root，而是打开第一个进程的 namespace，通过 setns 系统调用，将自己的 namespace 设置为与其相同。由于 mnt 的 namespace 的存在，进程的根目录也就与第一个进程一样了。

# 书籍列表

**毕业之前读完这些属实是有点难为人了，一个比一个硬，一次性啃完能给我门牙崩了；但是定点投放耗材市场之后，估计也不会有啥精力琢磨这些玩意了**。能读一点是一点吧。

感觉自己现在已经染上班味了，绝症，没得治。

- SRE：Google 运维解密
- Linker and Loader
- 有空自己解析一下 ELF？
- Docker 进阶与实战
- containerd 原理剖析与实战
- Linux 内核源码情景分析
- [LFS](https://www.linuxfromscratch.org/lfs/) 网站，自己从软件包开始搭建 Linux
- 构建嵌入式 Linux 系统

也许我应该把它们列入进阶版：

- gcc 技术大全
- 黑客调试技术大全
