<!-- 博客代码高亮 -->

[toc]

作为一名计算机学生，代码是生活里必不可少的组件。因而自年初开始学习前端、购买域名建站的时候，我就曾想过如何在网页里实现代码高亮。奈何才疏学浅，就此搁置。

上个月在搜索如何用代码自行实现 git 基本功能的时候，误打误撞进了大佬 Nikita 的[μgit 教程](https://www.leshenko.net/p/ugit/#)，惊为天人，不仅内容详细，排版也极为美观，尤其是代码的 git diff 显示，可以清晰地看到每一步做了哪些改变，仿佛大佬亲自莅临指导。于是在开启 μgit 学习（~~尚未有所推进，笑死~~，算是个坑，**以后补吧**）的同时，与黄佬共同学习该教程所用到的代码高亮办法，发现是一个 js 插件 highlight.min.js，探索过程中又找到了一个在此基础上以表格办法为代码添加行号的 js 插件 highlightjs-line-numbers.js，形成了一份草创的为 git 仓库提供 diff 显示的[网页](https://www.qin-juan-ge-zhu.top/code/others'code/highlight.html)，按照目前的理解尚需一些其他工具，因此该网页几乎等同于完全不会，只能说“欲知后事如何，且听下回分解”了。（一段话两个坑？挖坑小能手实锤！）

同时，一个多月来我为服务器 vim 做的配置 vimrc 变化较大。万一身边有人学呢？或者，年底服务期到期了这些设置总需要有个备份吧？故而近来想着重新写一份最新的。于是我碰到了之前无法解决的问题：之前 Markdown 导出为 html 所使用的工具是 typora，在导出方面几乎无出其右者，然而并不能识别和高亮 vimscript。即使对于其他可识别的代码，导出结果也是标签套标签、css 摞 css，导出之后无论是修改代码还是更换高亮样式，蜀道之难难于上青天，除非重新导出。

这几件事便成了我为本站建立代码高亮的源动力。

过程的繁琐自不必说，让我们进入正题，**用炫丽的色彩色彩点燃我们的码农世界吧**！

需要注意的是，下文所有 html 使用的链接都是我使用的 url，我大部分替换为了`/path/to/……`，意在说明这里可以替换为自己实际的 url（官网链接、cdn 链接、本地链接等），如有遗漏可自行修改。

# 代码高亮

现在很多网站的代码高亮插件都是[highlight.js](https://highlightjs.org/)，其中文文档[在此](http://highlight.cndoc.wiki/doc)。该插件目前已支持近 200 种编程语言、有 75 套渲染样式，十分完备易用。利用 Vue、npm 等高端技术的方法就不说了，~~主要是我也不会~~，就说说最简单的用法——直接在页面中加入 highlight.js 实现代码高亮。

使用方法极为简单：

- 在 html 文档的 head 中直接引入 highlight.min.js 和自己喜欢的 style 的链接
  - 支持的 style 列表和代码语言在[官方 demo](https://highlightjs.org/static/demo/)中，可以直接下载整套代码，也可以在 F12 中只选择自己喜欢的 style 搞下来
- 将代码块用`<pre><code>……</code></pre>`包裹
- code 可以选择用 class 来标注语言，如`<code class="language-c++">……</code>`，也可以不标注，会自动识别语言
- 代码第一行与`<code>`标签同行，最后一行可与`</code>`不同行，**否则会在第一行之前出现一个空的第 0 行，代码块不对称**

```
<html>
    <head>
        <!-- 选择最喜欢的style -->
        <link
            rel="stylesheet"
            href="https://highlightjs.org/static/demo/styles/github.css"
        />
        <!-- 引入highlight.min.js -->
        <script src="https://highlightjs.org/static/highlight.min.js"></script>
        <!-- 代码加高亮 -->
        <script>
            hljs.highlightAll();
        </script>
    </head>

    <body>
        <div>
            <!-- 一段无法再简单的C++ Hello World -->
            <pre><code>#include &lt;iostream&gt;

int main()
{
        std::cout&lt;&lt;"Hello, World!"&lt;&lt;std::endl;
        return 0;
}
            </code></pre>
        </div>
    </body>
</html>
```

我们已经朝着代码块的最终目标迈出了一大步。

# 为高亮代码添加行号

想想我们的代码编辑器，就会产生一个新诉求：为已经高亮的代码添加行号。没错，前辈大牛与我们的想法完全一致。

在 highlight.js 的基础上实现添加行号的有很多，这里采用的是其中一个，[highlightjs-line-numbers.js](https://github.com/wcoder/highlightjs-line-numbers.js/)。同样地，高端的食材往往只需要最简单的做法（努力为自己的菜找理由.jpg），这里采用直接引用 js 的方式。

使用方法同样很简单，我们不得不佩服大佬：只需要在之前的基础上添加两行代码即可。如下：

```
<html>
    <head>
        <link
            rel="stylesheet"
            href="https://highlightjs.org/static/demo/styles/github.css"
        />
        <script src="https://highlightjs.org/static/highlight.min.js"></script>
        <script>
            // 请注意，以下两行代码不得改变顺序，必须是先高亮再行号，后者依赖于前者
            // 之前启动高亮用的是hljs.highlightAll()，这里换了，对于高亮的效果是一致的
            hljs.highlightAll();
            // 为代码添加行号
            hljs.initLineNumbersOnLoad();
        </script>
    </head>

    <body>
        <div>
            <!-- 一段无法再简单的C++ Hello World -->
            <pre><code>#include &lt;iostream&gt;

int main()
{
    std::cout&lt;&lt;"Hello, World!"&lt;&lt;std::endl;
    return 0;
}
            </code></pre>
        </div>
    </body>
</html>
```

在此基础上，为了使得行号进一步美观，官方甚至还给出了行号的 css，可供按需修改：

```
/* for block of numbers */
pre code td.hljs-ln-numbers {
    text-align: center;
    color: #9c9c9c;
    border-right: 0.5px solid #9c9c9c;
    vertical-align: top;
    padding-left: 0.5rem;
    padding-right: 0.8rem;
    border: none;
}

/* for block of code */
pre code td.hljs-ln-code {
    padding-left: 1rem;
    border: none;
}
```

# 一键复制

代码块的功能越来越齐全，你可曾想过像万恶的 CSDN 搞“登录后复制”那样，来一个一键复制呢？这对于看到网站的人来说是很重要的，否则直接复制下来的代码很容易出现缩进不正确等各种情况，影响心情。**说干就干！**

可是就是这一步，难倒了我整整一天。支持 highlight.js 的一键复制不少，可是支持已经投入使用的 highlightjs-line-numbers.js 的却不多；在此基础上，还要越简单越好，便于我这个菜鸡看懂和使用，所以像[这个]()使用 Vue 还语焉不详的插件遗憾出局。到底还是做网站的心疼做网站的，最终在捣鼓了一下午和一晚上之后，深夜我终于找到了一篇[文章](https://savalone.com/javascript/ueditor-highlightjs.html)，与我的要求近乎完全一致，而且文章本身用的也是文章所说的代码处理办法，体验结果甚合吾意。

## 剪贴板有关

一键复制与剪贴板有关。在这方面，[cliploard](https://github.com/zenorocha/clipboard.js)是一个好用的 js。同样地，先看一下官方 Demo 吧：

```
<script>
    <!-- 1. Define some markup -->
    <textarea id="bar">hello</textarea>
    <button class="btn" data-clipboard-action="cut" data-clipboard-target="#bar">Cut</button>
    <!-- 2. Include library -->
    <script src="../dist/clipboard.min.js">
</script>
<!-- 3. Instantiate clipboard -->
<script>
    var clipboard = new ClipboardJS(".btn");
    clipboard.on("success", function (e) {
        console.log(e);
    });
    clipboard.on("error", function (e) {
        console.log(e);
    });
</script>
```

button 的 data-clipboard-action="cut" 属性为“剪切”，data-clipboard-action="copy" 属性为“复制”。然后可以看到 button 的 data-clipboard-target 属性值 = 要进行复制的目标元素的 id。

那么我们就要在每一个 pre 里面添加一个 data-clipboard-target 属性不同的 button 按钮，并且要为这个 pre 增加一个和 button 的 data-clipboard-target 属性一样的 id，最后调用 demo 里的 js。**前进！**

## 修改`<pre>`

首先，引入 clipboard.js：

```
<script src="url/clipboard.min.js"></script>
```

为每一个 pre 添加复制按钮：

```
<script type="text/javascript">
    var allpre = document.getElementsByTagName("pre");
    for (i = 0; i < allpre.length; i++) {
        var onepre = document.getElementsByTagName("pre")[i];
        var mycode = document.getElementsByTagName("pre")[i].innerHTML;
        // 在 code 层前面增加了一个 button
        // 此处原教程由于所用的导出工具导出代码只有<pre>没有<code>，因而多套了一层<code>，特此删去
        // 教程本身的源码在此处添加了一个交互，点击复制时会出现“已复制”，此处采用
        onepre.innerHTML =
            '<div class="btn"><span class="btn-tip">已复制！</span><button class="btn" data-clipboard-action="copy">复制</button></div>' +
            mycode;
    }
</script>
```

为 pre 循环增加 id，并为 pre 内的 button 增加 data-clipboard-target 属性：

```
<script>
    $("pre").each(function () {
        $(this).attr("id", "pre" + $(this).index());
        var btns = $(this).find("button");
        $(btns).attr("data-clipboard-target", "#pre" + $(this).index());
    });
</script>
```

## 功能实现

为了简单起见，我们可以将之前的代码高亮与行号放在这里，也就是上边的各个 script 之后：

```
<script>
    hljs.highlightAll();
    hljs.initLineNumbersOnLoad();
</script>
```

而后直接复制 demo 目录内 target-textarea.html 的 js 代码：

```
<!--这个是官方 demo 的用法-->
<script>
    var clipboard = new ClipboardJS(".btn");
    clipboard.on("success", function (e) {
        console.log(e);
    });
    clipboard.on("error", function (e) {
        console.log(e);
    });
</script>
```

原教程中提供的 css：

```
pre {
    position: relative;
}
pre .btn {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    background: #333;
    color: #9c9c9c;
    border: 1px solid #232323;
}
pre .btn:hover {
    color: #fff;
}
pre:hover .btn {
    display: block;
}
```

## 教程所忘记的

除此之外，由于一键复制的某些代码与前边关联，且需要足够的时间等待文档加载结束再执行，因而所有上述功能代码需要放置在文档末尾。

就好了？我做到这的时候也这么想。可惜事与愿违，如果我们仅仅是按照上边已经说的去写开头的那份 Hello World，我们会得到如下一篇文档。

```
<html>
    <head>
        <!-- style css引入 -->
        <link
            rel="stylesheet"
            href="/path/to//thestyle/you/like"
        />
        <!-- highlight.min.js引入 -->
        <script src="/path/to/highlight.min.js"></script>
        <!-- 代码行号引入 -->
        <script src="/path/tp/highlightjs-line-numbers.min.js"></script>
        <style>
            /* for block of numbers */
            pre code td.hljs-ln-numbers {
                text-align: center;
                color: #9c9c9c;
                border-right: 0.5px solid #9c9c9c;
                vertical-align: top;
                padding-left: 0.5rem;
                padding-right: 0.8rem;
                border: none;
            }

            /* for block of code */
            pre code td.hljs-ln-code {
                padding-left: 1rem;
                border: none;
            }

            /* 一键复制所需 */
            pre {
                position: relative;
            }
            pre .btn {
                display: none;
                position: absolute;
                top: 0;
                right: 0;
                background: #333;
                color: #9c9c9c;
                border: 1px solid #232323;
            }
            pre .btn:hover {
                color: #fff;
            }
            pre:hover .btn {
                display: block;
            }
        </style>
    </head>

    <body>
        <div>
            <pre><code>#include &lt;iostream&gt;

int main()
{
&nbsp;&nbsp;std::cout&lt;&lt;"Hello, Programmer!"&lt;&lt;std::endl;
&nbsp;&nbsp;return 0;
}
            </code></pre>
        </div>
    </body>

    <!-- 功能代码 -->
    <script>
        var allpre = document.getElementsByTagName("pre");
        for (i = 0; i < allpre.length; i++) {
            var onepre = document.getElementsByTagName("pre")[i];
            var mycode = document.getElementsByTagName("pre")[i].innerHTML;
            onepre.innerHTML =
                '<div class="btn"><span class="btn-tip">已复制！</span><button class="btn" data-clipboard-action="copy">复制</button></div>' +
                mycode;
        }
        // 需要在对应js加载完后执行
        hljs.initHighlightingOnLoad();
        hljs.initLineNumbersOnLoad();

        // 给pre加id，需要等文档加载完才行
        $("pre").each(function () {
            $(this).attr("id", "pre" + $(this).index());
            var btns = $(this).find("button");
            $(btns).attr("data-clipboard-target", "#pre" + $(this).index());
        });
        var clipboard = new ClipboardJS(".btn");

        clipboard.on("success", function (e) {
            $(".btn").each(function () {
                var btntip = $(this).find("span.btn-tip");
                $(btntip).css("display", "block").delay(1000).fadeOut(200);
            });
            console.log(e);
        });

        clipboard.on("error", function (e) {
            console.log(e);
        });
    </script>
</html>
```

直接打开浏览器看效果，会发现如下几个问题：

- “复制”与“已复制”同时出现，且后者被前者遮盖，点击“复制”时候也会出现但还是被遮盖；而我们需要的是一般情况“复制”，复制过了才“已复制”
- 点击“复制”的时候，复制到的东西把“复制”这两个字也复制进去了
- 复制的时候所有内容会被全选中，一般默认是蓝底白字，十分有碍观瞻，我们需要的是点击“复制”的时候代码展示没有变化（选不选中的，看不见就行了）
- “复制”与“已复制”字体大小、按钮大小均不一致
- 还一个啥问题来着？忘了，最近脑子不好使，似乎想闹独立。

总而言之，教程内容里差点东西。由于教程本身使用的也是这一套代码，F12 理所当然地能解决一切。最后我发现，作者漏了几段重要的 css：

```
pre .btn-tip {
    display: none;
    position: absolute;
    top: 0px;
    right: 0;
    /* 将已复制放在高层，正常不显示，点击复制时候显示并盖住复制按钮 */
    z-index: 9;
    padding: 6px 12px;
    background: #333;
    color: #f5f5f5;
    border: none;
    border-radius: 4px;
}

.btn {
    display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    /* 防止把“复制”复制下来 */
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 4px;
}

/* 这一段我自己加的
代码复制时全选但不能被看到
即选中时背景色透明 */
code ::selection {
    background-color: rgba(0, 0, 0, 0);
}
```

除了加了注释说明功能的地方之外，剩的是一些不甚打紧的参数，而且效果也比较满意，因此不需要修改，直接将上述 css 加入 style 标签内就好了。此时再打开这个 html，Hello World 已经高亮，带有行号和一键复制，使用体验丝滑流畅。一切都是那么和谐，仿佛自来就是如此，什么都未发生过。

历尽千辛万苦，我们即将来到旅程的终点。

_**吗？**_

# 抽成单独的文件

样例程序已经达到预期效果，但为了做网站，我们的目标远不止于此。我们需要的是**将所需内容尽可能简单地引入已经写好的文档**（我一般是用 pandoc/Typora 将 Markdown 导出为 html），最好只是一个文件。没错，我们最后要做的，是将上边已经有的 script 标签、link 标签、style 标签和 js 代码写在同一份 js 文件里，只需要在 head 中引用该文件即可。

首先，记录一下现有的要求：

- head 中的标签
  - 需要引入 style 样式，可以考虑加随机 style
  - jquery 需要在其他的 script 之前引入，highlight.js 要在 highlightjs-line-number 之前引入，clipboard 最后引入
  - 所有要执行的 js 代码必须在文档整体完成之后再执行

经过多次试验和黄四郎的悉心指导，得到了以下的方法。

## 需要的额外 css

```
/* highlight.css */

/* for block of numbers */
pre code td.hljs-ln-numbers {
    text-align: center;
    color: #9c9c9c;
    border-right: 0.5px solid #9c9c9c;
    vertical-align: top;
    padding-left: 0.5rem;
    padding-right: 0.8rem;
    border: none;
}

/* for block of code */
pre code td.hljs-ln-code {
    padding-left: 1rem;
    border: none;
}

/* 一键复制所需 */
pre {
    position: relative;
}

pre .btn {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    background: #333;
    color: #9c9c9c;
    border: 1px solid #232323;
}

pre .btn:hover {
    color: #fff;
}

pre:hover .btn {
    display: block;
}

pre .btn-tip {
    display: none;
    position: absolute;
    top: 0px;
    right: 0;
    /* 将已复制放在高层，正常不显示，点击复制时候显示并盖住复制按钮 */
    z-index: 9;
    padding: 6px 12px;
    background: #333;
    color: #f5f5f5;
    border: none;
    border-radius: 4px;
}

.btn {
    display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    /* 防止把“复制”复制下来 */
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 4px;
}

/* 这一段我自己加的
代码复制时全选但不能被看到
即选中时背景色透明 */
code ::selection {
    background-color: rgba(0, 0, 0, 0);
}
```

## 引入 css

首先写一个为文档引入 css 的 js 函数：

```
function addLink(href, rel = "stylesheet") {
    // 默认为stylesheet
    const link = document.createElement("link");
    link.rel = rel;
    link.href = href;
    document.head.appendChild(link);
}
```

而后引入上述的额外 css：

```
// 加载高亮所需特殊css
addLink("/path/to/highlight.css");
```

还需要选择高亮 style 样式。不知道你是否和我一样有选择困难症？每次写一篇文档都去选一个 style 着实很烦。不如随机抽取：

```
// 此处负责随机选择一个代码高亮style的css并加载
// 数组内是现highlight.js所有插件名称，共计75个
const styles = [
    "a11y-dark.min.css",
    "a11y-light.min.css",
    "agate.min.css",
    "androidstudio.min.css",
    "an-old-hope.min.css",
    "arduino-light.min.css",
    "arta.min.css",
    "ascetic.min.css",
    "atom-one-dark.min.css",
    "atom-one-dark-reasonable.min.css",
    "atom-one-light.min.css",
    "base16",
    "brown-paper.min.css",
    "brown-papersq.png",
    "codepen-embed.min.css",
    "color-brewer.min.css",
    "dark.min.css",
    "default.min.css",
    "devibeans.min.css",
    "docco.min.css",
    "far.min.css",
    "felipec.min.css",
    "foundation.min.css",
    "github-dark-dimmed.min.css",
    "github-dark.min.css",
    "github.min.css",
    "gml.min.css",
    "googlecode.min.css",
    "gradient-dark.min.css",
    "gradient-light.min.css",
    "grayscale.min.css",
    "hybrid.min.css",
    "idea.min.css",
    "intellij-light.min.css",
    "ir-black.min.css",
    "isbl-editor-dark.min.css",
    "isbl-editor-light.min.css",
    "kimbie-dark.min.css",
    "kimbie-light.min.css",
    "lightfair.min.css",
    "lioshi.min.css",
    "magula.min.css",
    "mono-blue.min.css",
    "monokai.min.css",
    "monokai-sublime.min.css",
    "night-owl.min.css",
    "nnfx-dark.min.css",
    "nnfx-light.min.css",
    "nord.min.css",
    "obsidian.min.css",
    "panda-syntax-dark.min.css",
    "panda-syntax-light.min.css",
    "paraiso-dark.min.css",
    "paraiso-light.min.css",
    "pojoaque.jpg",
    "pojoaque.min.css",
    "purebasic.min.css",
    "qtcreator-dark.min.css",
    "qtcreator-light.min.css",
    "rainbow.min.css",
    "routeros.min.css",
    "school-book.min.css",
    "shades-of-purple.min.css",
    "srcery.min.css",
    "stackoverflow-dark.min.css",
    "stackoverflow-light.min.css",
    "sunburst.min.css",
    "tokyo-night-dark.min.css",
    "tokyo-night-light.min.css",
    "tomorrow-night-blue.min.css",
    "tomorrow-night-bright.min.css",
    "vs2015.min.css",
    "vs.min.css",
    "xcode.min.css",
    "xt256.min.css",
];

const href = "/path/to/styles/" + styles[~~(Math.random() * styles.length)];
addLink(href);
```

于是我们完成了 style 的高亮 style 随机选择。

## 引入 script

老规矩，先写一个引入 script 的函数：

```
// 加js的函数
function addScript(url, async = true) {
    //默认先到先得地加载
    const script = document.createElement("script");
    script.src = url;
    script.async = async;
    document.head.appendChild(script);
}
```

接下来按照上边说过的顺序（先 jQuery，再 highlight.min.js，而后 highlightjs-line-numbers.js，最后 clipboard.js）进行加载。为了防止浏览器并发地加载，**必须规定`async=false`**。

```
// 此处是各个插件
// 首先放置最高的jQuery备用
// 而后是highlight.min.js高亮代码
// 再加行号
// 最后cliploard供一键复制使用
var url = [
    "/path/to/jQuery.js",
    "/path/to/highlight.min.js",
    "/path/to/highlightjs-line-numbers.js",
    "/path/to/clipboard.min.js",
];

for (let i in url) {
    // 要求必须按顺序加载
    addScript(url[i], false);
}
```

## 执行代码

最后、也是最重要的部分，当然是要在文档末尾才执行的代码啦~所以我们要在原功能代码的基础上套一层`onload()`，如下：

```
// 以下代码负责使用上述模块，因而必须在html文档整体完成之后加载
onload = () => {
    // 导出的源码由<pre><code>……</code></pre>包裹，符合highlight.min.js要求
    // 需要在code之前加入复制按钮，要求点击之后显示已复制
    var allpre = document.getElementsByTagName("pre");
    for (i = 0; i < allpre.length; i++) {
        var onepre = document.getElementsByTagName("pre")[i];
        var mycode = document.getElementsByTagName("pre")[i].innerHTML;
        onepre.innerHTML =
            '<div class="btn"><span class="btn-tip">已复制！</span><button class="btn" data-clipboard-action="copy">复制</button></div>' +
            mycode;
    }

    // 这两行负责加载代码高亮并为代码添加行号
    hljs.initHighlightingOnLoad();
    hljs.initLineNumbersOnLoad();

    // 循环为pre标签加id
    $("pre").each(function () {
        $(this).attr("id", "pre" + $(this).index());
        var btns = $(this).find("button");
        $(btns).attr("data-clipboard-target", "#pre" + $(this).index());
    });
    var clipboard = new ClipboardJS(".btn");

    // 是否成功复制
    clipboard.on("success", function (e) {
        $(".btn").each(function () {
            var btntip = $(this).find("span.btn-tip");
            $(btntip).css("display", "block").delay(1000).fadeOut(200);
        });
        console.log(e);
    });

    clipboard.on("error", function (e) {
        console.log(e);
    });
};
```

# 综合

总而言之，现在我们得到了两份文件：

```
/* highlight.css */

/* for block of numbers */
pre code td.hljs-ln-numbers {
    text-align: center;
    color: #9c9c9c;
    border-right: 0.5px solid #9c9c9c;
    vertical-align: top;
    padding-left: 0.5rem;
    padding-right: 0.8rem;
    border: none;
}

/* for block of code */
pre code td.hljs-ln-code {
    padding-left: 1rem;
    border: none;
}

/* 一键复制所需 */
pre {
    position: relative;
}

pre .btn {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    background: #333;
    color: #9c9c9c;
    border: 1px solid #232323;
}

pre .btn:hover {
    color: #fff;
}

pre:hover .btn {
    display: block;
}

pre .btn-tip {
    display: none;
    position: absolute;
    top: 0px;
    right: 0;
    /* 将已复制放在高层，正常不显示，点击复制时候显示并盖住复制按钮 */
    z-index: 9;
    padding: 6px 12px;
    background: #333;
    color: #f5f5f5;
    border: none;
    border-radius: 4px;
}

.btn {
    display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    /* 防止把“复制”复制下来 */
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 4px;
}

/* 这一段我自己加的
代码复制时全选但不能被看到
即选中时背景色透明 */
code ::selection {
    background-color: rgba(0, 0, 0, 0);
}
```

还有一份 js：

```
// myhighlight.js
// 代码高亮、加行号、加一键复制功能

// 加js的函数
function addScript(url, async = true) {
    //默认先到先得地加载
    const script = document.createElement("script");
    script.src = url;
    script.async = async;
    document.head.appendChild(script);
}

// 加link的函数
function addLink(href, rel = "stylesheet") {
    // 默认为stylesheet
    const link = document.createElement("link");
    link.rel = rel;
    link.href = href;
    document.head.appendChild(link);
}

// 此处是各个插件
// 首先放置最高的jQuery备用
// 而后是highlight.min.js高亮代码
// 再加行号
// 最后cliploard供一键复制使用
var url = [
    "/path/to/jQuery.js",
    "/path/to/highlight.min.js",
    "/path/to/highlightjs-line-numbers.js",
    "/path/to/clipboard.min.js",
];

for (let i in url) {
    // 要求必须按顺序加载
    addScript(url[i], false);
}

// 加载高亮所需特殊css
addLink("/path/to/highlight.css");

// 此处负责随机选择一个代码高亮style的css并加载
// 数组内是现highlight.js所有插件名称，共计75个
const styles = [
    "a11y-dark.min.css",
    "a11y-light.min.css",
    "agate.min.css",
    "androidstudio.min.css",
    "an-old-hope.min.css",
    "arduino-light.min.css",
    "arta.min.css",
    "ascetic.min.css",
    "atom-one-dark.min.css",
    "atom-one-dark-reasonable.min.css",
    "atom-one-light.min.css",
    "base16",
    "brown-paper.min.css",
    "brown-papersq.png",
    "codepen-embed.min.css",
    "color-brewer.min.css",
    "dark.min.css",
    "default.min.css",
    "devibeans.min.css",
    "docco.min.css",
    "far.min.css",
    "felipec.min.css",
    "foundation.min.css",
    "github-dark-dimmed.min.css",
    "github-dark.min.css",
    "github.min.css",
    "gml.min.css",
    "googlecode.min.css",
    "gradient-dark.min.css",
    "gradient-light.min.css",
    "grayscale.min.css",
    "hybrid.min.css",
    "idea.min.css",
    "intellij-light.min.css",
    "ir-black.min.css",
    "isbl-editor-dark.min.css",
    "isbl-editor-light.min.css",
    "kimbie-dark.min.css",
    "kimbie-light.min.css",
    "lightfair.min.css",
    "lioshi.min.css",
    "magula.min.css",
    "mono-blue.min.css",
    "monokai.min.css",
    "monokai-sublime.min.css",
    "night-owl.min.css",
    "nnfx-dark.min.css",
    "nnfx-light.min.css",
    "nord.min.css",
    "obsidian.min.css",
    "panda-syntax-dark.min.css",
    "panda-syntax-light.min.css",
    "paraiso-dark.min.css",
    "paraiso-light.min.css",
    "pojoaque.jpg",
    "pojoaque.min.css",
    "purebasic.min.css",
    "qtcreator-dark.min.css",
    "qtcreator-light.min.css",
    "rainbow.min.css",
    "routeros.min.css",
    "school-book.min.css",
    "shades-of-purple.min.css",
    "srcery.min.css",
    "stackoverflow-dark.min.css",
    "stackoverflow-light.min.css",
    "sunburst.min.css",
    "tokyo-night-dark.min.css",
    "tokyo-night-light.min.css",
    "tomorrow-night-blue.min.css",
    "tomorrow-night-bright.min.css",
    "vs2015.min.css",
    "vs.min.css",
    "xcode.min.css",
    "xt256.min.css",
];

const href = "/path/to/styles/" + styles[~~(Math.random() * styles.length)];
addLink(href);

// 以下代码负责使用上述模块，因而必须在html文档整体完成之后加载
onload = () => {
    // 导出的源码由<pre><code>……</code></pre>包裹，符合highlight.min.js要求
    // 需要在code之前加入复制按钮，要求点击之后显示已复制
    var allpre = document.getElementsByTagName("pre");
    for (i = 0; i < allpre.length; i++) {
        var onepre = document.getElementsByTagName("pre")[i];
        var mycode = document.getElementsByTagName("pre")[i].innerHTML;
        onepre.innerHTML =
            '<div class="btn"><span class="btn-tip">已复制！</span><button class="btn" data-clipboard-action="copy">复制</button></div>' +
            mycode;
    }

    // 这两行负责加载代码高亮并为代码添加行号
    hljs.initHighlightingOnLoad();
    hljs.initLineNumbersOnLoad();

    // 循环为pre标签加id
    $("pre").each(function () {
        $(this).attr("id", "pre" + $(this).index());
        var btns = $(this).find("button");
        $(btns).attr("data-clipboard-target", "#pre" + $(this).index());
    });
    var clipboard = new ClipboardJS(".btn");

    // 是否成功复制
    clipboard.on("success", function (e) {
        $(".btn").each(function () {
            var btntip = $(this).find("span.btn-tip");
            $(btntip).css("display", "block").delay(1000).fadeOut(200);
        });
        console.log(e);
    });

    clipboard.on("error", function (e) {
        console.log(e);
    });
};
```

使用方法也很简单，只需要引入上边这个 myhighlight.js 即可。比如之前写好的 Hello World 页面：

```
<html>
    <head>
        <title>Hello World展示</title>
        <!-- 前边需要什么css/js还可以自己添 -->
        <!-- 这里是你需要的那些文件 -->

        <!-- 代码高亮的js -->
        <script src="/path/to/myhighlight.js"></script>
    </head>

    <body>
        <div>
            <pre><code>#include &lt;iostream&gt;

int main()
{
&nbsp;&nbsp;std::cout&lt;&lt;"Hello, Programmer!"&lt;&lt;std::endl;
&nbsp;&nbsp;return 0;
}
            </code></pre>
        </div>
    </body>
</html>
```

**代码多跑路，<kbd>Ctrl+c/v</kbd>少跑腿，国安民乐，岂不美哉？**

# 还缺点什么吗？

“还缺？这不已经好了吗？”没错，代码部分好了，但对我们而言差点东西。

## Markdown

根据上边已经有的代码高亮，现在完成手搓 html 写网页已经很轻松加愉快了，常用的无非就是那几个标签罢了。为了更简单一些，难道不能写 Markdown 吗？当然可以！

有两个特别好的小工具，一个叫[Typora](https://typora.io/)，另一个叫[pandoc](https://pandoc.org/)。前者是专门的 Markdown 编辑器，可以做到实时预览、所见即所得，主题样式也可以自由选择和安装；后者则是一个做文档转换的命令行小工具。二者都可以实现 Markdown 转 html。笔者目前是在 Linux 里写这篇文章，因而现在用的是 pandoc。

有几个点需要注意：

- Typora 是买断制收费，刚下载会有 15 天试用期，如需购买则目前是\$14.99（合￥ 89.00），一个账号最多可以同时在三个口使用（也就是一个号最多能供三个人用，可以合买）
- Typora 一部分导出功能需要 pandoc 支持
- pandoc 在各种文件类型（包括 Markdown 在内）导出为 pdf 时需要 LaTeX 支持，因而如果没有 LaTeX 那就不要导出为 pdf。
- 使用上述两种工具导出 Markdown 时，一般的代码会自带高亮，但是此种高亮是由 css 和标签一层一层摞起来的，不便于更改代码本身和代码样式，更不可能实现上述的一键复制。因而笔者建议，在编写 Markdown 时候可以标明代码块用的语言，导出之前全部删掉。如：

```
<!-- 下边用三个`作代码块示例好像不识别，改用···，请注意 -->

<!-- 写的时候 -->

···cpp
#include <iostream>
···

<!-- 导出时修改为 -->

···
#include <iostream>
···
```

## 小脚本

pandoc 导出十分方便，要改造为我们所需的 html 还需要一些批量处理。这里我写了两个脚本，按需取用。

```
# vime.sh
# 本文件用来在命令行里执行vim的文件操作
#!/bin/bash

# 第一个参数是文件名，第二个参数是vim需要做的操作，如有空格需要将整体用引号包起来
echo $1
echo $2
# 停一下，按任意键继续
read -n 1
# 执行
find -name "$1" -exec sed -i "$2" {} \;
```

另一个脚本：

```
# pan4html.sh
#!/bin/bash

# 这一行原想删除导出文件的style标签，好像没起作用
vime $1 "s/<style>*<\/style>//g"

# 给<body>内部套一层<div class="pandoc">以使用pandoc自己的style
# 我放到其他文件了
vime $1 "s/<body>/<body><div class=\"pandoc\">/g"
vime $1 "s/<\/body>/<\/div><\/body>/g"

# 给<table>套一层<div class="table-div">
# 我在上述css里将table的display修改为inline，按行内元素处理
# table的text-align设为left
# 这一层div的text-align设置为center
# 从而实现表格居中、表内文字左对齐
vime $1 "s/<table>/<div class=\"table-div\"><table>/g"
vime $1 "s/<\/table>/<\/table><\/div>/g"
```

# 碎碎念

看起来文章内容很长，实际核心内容很短。核心内容很短，但探索的经历很长。

开头已经说过，之所以需要做代码高亮、行号、一键复制功能，是因为 pandoc 和 Typora 这两个我常用的 Markdown 导出工具均不支持 vimscript 高亮。二者实际上在导出方面做的非常好，绝大多数语言都支持高亮，审美也相当不错，但是由于这一点问题，居然使我弄出了一键复制，也还是很令我自己吃惊的。

现在代码块的功能可云大备，也许以后大多数文章都会改用这一套代码高亮吧。大概是不会再改了。
