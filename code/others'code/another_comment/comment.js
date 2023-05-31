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
document.write(script.outerHTML);