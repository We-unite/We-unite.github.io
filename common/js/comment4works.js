// 插入一个hr标签，与上下距离各20px
document.write('<hr style="margin-top: 3em; margin-bottom: 1.5em;">');

// 插入一个<p></p>标签，，居中展示，字体加粗，内容为“一起来讨论吧！\n留下邮箱，接收后续评论喔~”，行距1.5，与下边距离1em
document.write('<p style="text-align: center; font-weight: bold; line-height: 1.5; margin-bottom: 1em;">一起来讨论吧！<br>留下邮箱，接收后续评论喔~</p>');

// 创建一个div，id为vcomments
var div = document.createElement('div');
div.id = 'vcomments';

// 创建一个script标签，内容是一个函数，用于初始化评论框
var script = document.createElement('script');
script.innerHTML = `new Valine({
    el: '#vcomments',
    appId: 'PuxNi7oFVivphGeGB7ccO5my-gzGzoHsz',
    appKey: 'K25IlfrYqQ7QuVbG2017h3TC'
})`;
//将div写在引用本条script标签之后
document.write(div.outerHTML);
//将script添加到上述div之后
document.write(script.outerHTML)

// 发现并绑定Valine评论框
var count = 0;
var domTimer = setInterval(function () {
    if (++count > 50) clearInterval(domTimer);
    if (document.querySelector('#veditor')) {
        clearInterval(domTimer);
        var cdraw = new CaveDraw({
            element: "#veditor",
            readOnlyMode: false, // valine 不提交form，而是过滤评论框数据后发送，所以评论框不能readonly。
            afterUpdateEditor: ()=>{ // 手动触发valine对评论框数据的过滤
                document.querySelector('#veditor').focus();
                document.querySelector('#veditor').blur();
            },
            controls: ['brush', 'eraser', 'bucket', 'clear', 'undo', 'redo', 'save']
        });
    }
}, 200);
