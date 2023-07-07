# highlight_line_number highlight.js行号辅助工具

#### 介绍
改进版的highlightjs-line-numbers.js，可在vue、react等框架使用，只需要调用一个函数即可实现对highlight.js高亮处理后的代码块添加行号效果

#### 安装教程

直接将highlight-line-number.js拷贝到自己项目的/src/assets/js/目录下

#### 使用说明
以vue为例,在main.js内添加如下代码，即可实现代码高亮和添加行号，需要注意的是，在需要高亮的html元素内添加v-highlight以调用该钩子函数
```vue
import {lineNumbersBlock} from "@/assets/js/highlight-line-number"
Vue.directive('highlight', {
    update(el){
        let blocks = el.querySelectorAll('pre code');
        blocks.forEach((block)=>{
            if(block.getAttribute("highlighted")=="true"){
                return
            }
            //防止已经高亮处理过的block再次被处理
            block.setAttribute("highlighted","true")
            //高亮
            hljs.highlightElement(block)
            //添加行号
            lineNumbersBlock(block)
        })
    }
})
```


#### 自定义样式
你可以按照自己的需求自定义样式
```css
/*修改行号列样式*/
.hljs-ln-numbers {
    text-align: center;
    color: #ccc;
    border-right: 1px solid #CCC;
    vertical-align: top;
    padding-right: 5px !important;

    /* your custom style here */
}

/* 修改代码列样式 */
.hljs-ln-code {
    padding-left: 5px !important;
}
```

