// 高亮、行号、一键复制等操作所需代码
// 该段代码不论如何引用，都需要出现在网页的body之后、结束之前，以保证能运行
// 否则前边需要加载的js没加完就运行，会出错
var allpre = document.getElementsByTagName("pre");
for (i = 0; i < allpre.length; i++) {
    var onepre = document.getElementsByTagName("pre")[i];
    var mycode = document.getElementsByTagName("pre")[i].innerHTML;
    onepre.innerHTML = '<div class="btn"><span class="btn-tip">已复制！</span><button class="btn" data-clipboard-action="copy">复制</button></div>' + mycode;
};

hljs.initHighlightingOnLoad();
hljs.initLineNumbersOnLoad();

$("pre").each(function () {
    $(this).attr('id', "pre" + $(this).index());
    var btns = $(this).find("button");
    $(btns).attr('data-clipboard-target', "#pre" + $(this).index())
});
var clipboard = new ClipboardJS('.btn');

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