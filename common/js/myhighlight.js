// 代码高亮、加行号、加一键复制功能

// 加js的函数
function addScript(url, async = true) {
    //默认先到先得地加载
    const script = document.createElement('script');
    script.src = url;
    script.async = async;
    document.head.appendChild(script);
}

// 加link的函数
function addLink(href, rel = 'stylesheet') {
    // 默认为stylesheet
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    document.head.appendChild(link);
}

// 此处是各个插件
// 首先放置最高的jQuery备用
// 而后是highlight.min.js高亮代码
// 再加行号
// 最后cliploard供一键复制使用
var url = ["https://www.qin-juan-ge-zhu.top/common/js/jQuery.js", "https://www.qin-juan-ge-zhu.top/common/highlight/highlight.min.js", "https://www.qin-juan-ge-zhu.top/common/highlight/plugs/highlightjs-line-numbers.js", "https://www.qin-juan-ge-zhu.top/common/highlight/plugs/clipboard.min.js"]

for (let i in url) {
    // 要求必须按顺序加载
    addScript(url[i], false);
}

// 加载高亮所需特殊css
addLink("https://www.qin-juan-ge-zhu.top/common/CSS/highlight.css");

// 此处负责随机选择一个代码高亮style的css并加载
// 数组内是现highlight.js所有插件名称，共计75个
const styles = ["a11y-dark.min.css", "a11y-light.min.css", "agate.min.css", "androidstudio.min.css", "an-old-hope.min.css", "arduino-light.min.css", "arta.min.css", "ascetic.min.css", "atom-one-dark.min.css", "atom-one-dark-reasonable.min.css", "atom-one-light.min.css", "base16", "brown-paper.min.css", "brown-papersq.png", "codepen-embed.min.css", "color-brewer.min.css", "dark.min.css", "default.min.css", "devibeans.min.css", "docco.min.css", "far.min.css", "felipec.min.css", "foundation.min.css", "github-dark-dimmed.min.css", "github-dark.min.css", "github.min.css", "gml.min.css", "googlecode.min.css", "gradient-dark.min.css", "gradient-light.min.css", "grayscale.min.css", "hybrid.min.css", "idea.min.css", "intellij-light.min.css", "ir-black.min.css", "isbl-editor-dark.min.css", "isbl-editor-light.min.css", "kimbie-dark.min.css", "kimbie-light.min.css", "lightfair.min.css", "lioshi.min.css", "magula.min.css", "mono-blue.min.css", "monokai.min.css", "monokai-sublime.min.css", "night-owl.min.css", "nnfx-dark.min.css", "nnfx-light.min.css", "nord.min.css", "obsidian.min.css", "panda-syntax-dark.min.css", "panda-syntax-light.min.css", "paraiso-dark.min.css", "paraiso-light.min.css", "pojoaque.jpg", "pojoaque.min.css", "purebasic.min.css", "qtcreator-dark.min.css", "qtcreator-light.min.css", "rainbow.min.css", "routeros.min.css", "school-book.min.css", "shades-of-purple.min.css", "srcery.min.css", "stackoverflow-dark.min.css", "stackoverflow-light.min.css", "sunburst.min.css", "tokyo-night-dark.min.css", "tokyo-night-light.min.css", "tomorrow-night-blue.min.css", "tomorrow-night-bright.min.css", "vs2015.min.css", "vs.min.css", "xcode.min.css", "xt256.min.css"];

const href = "https://www.qin-juan-ge-zhu.top/common/highlight/styles/" + styles[~~(Math.random() * styles.length)];
addLink(href);

// 以下代码负责使用上述模块，因而必须在html文档整体完成之后加载
onload = () => {
    // 导出的源码由<pre><code>……</code></pre>包裹，符合highlight.min.js要求
    // 需要在code之前加入复制按钮，要求点击之后显示已复制
    var allpre = document.getElementsByTagName("pre");
    for (i = 0; i < allpre.length; i++) {
        var onepre = document.getElementsByTagName("pre")[i];
        var mycode = document.getElementsByTagName("pre")[i].innerHTML;
        onepre.innerHTML = '<div class="btn"><span class="btn-tip">已复制！</span><button class="btn" data-clipboard-action="copy">复制</button></div>' + mycode;
    };

    // 这两行负责加载代码高亮并为代码添加行号
    hljs.initHighlightingOnLoad();
    hljs.initLineNumbersOnLoad();

    // 循环为pre标签加id
    $("pre").each(function () {
        $(this).attr('id', "pre" + $(this).index());
        var btns = $(this).find("button");
        $(btns).attr('data-clipboard-target', "#pre" + $(this).index())
    });
    var clipboard = new ClipboardJS('.btn');

    // 是否成功复制
    clipboard.on('success', function (e) {
        $(".btn").each(function () {
            var btntip = $(this).find("span.btn-tip");
            $(btntip).css("display", "block").delay(1000).fadeOut(200);
        });
        console.log(e);
    });

    clipboard.on('error', function (e) {
        console.log(e);
    });
};