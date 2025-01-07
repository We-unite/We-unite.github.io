#!/bin/bash

##########################################################################
# File Name    : md2html.sh
# Encoding     : utf-8
# Author       : We-unite
# Email        : weunite1848@gmail.com
# Created Time : 2023-12-15
##########################################################################

origin=$1                 # 源文件名
src="."$origin            # 源文件的复制
dst=${origin%.*}".html"   # 目标文件

if [ $# -ne 2 ] || [ ${origin##*.} != "md" ]; then
    echo "Usage: $0 <markdown file> <html title>"
    exit 1
elif [ ! -f $origin ]; then
    echo "Error: $1 does not exist"
    exit 1
fi

cp $origin $src
pandoc --no-highlight --mathjax=none -s $src -o $dst --metadata title="$2"
rm $src

# 处理多行代码块，将<pre class="xxx"><code>替换为<pre class="language-xxx"> 
sed -i -E ':a;N;$!ba;s|<pre[^>]*class="([^"]+)"[^>]*>[[:space:]]*<code[^>]*>|<pre><code class="language-\1">|g' $dst
sed -i '/<style/,/<\/style>/d' $dst
# 修改body的样式
sed -i 's/<body>/<body>\n<div class="pandoc">\n<div class="main">/' $dst
# 添加评论区
sed -i 's/<\/body>/<script src="https:\/\/www.qin-juan-ge-zhu.top\/common\/js\/comment.js"><\/script>\n<\/div>\n<\/div>\n<\/body>/' $dst
sed -i 's/\t/    /g' $dst
# 添加样式
sed -i 's/<\/head>/<link rel="stylesheet" href="https:\/\/www.qin-juan-ge-zhu.top\/common\/CSS\/pandoc.css">\n<script type="text\/javascript" src="https:\/\/www.qin-juan-ge-zhu.top\/common\/script4code.js"><\/script><\/head>/' $dst

# 检查是否有数学公式，有则添加mathjax
if grep -Eq "math inline|math display" $dst; then
    sed -i 's|</head>|<script type="text/javascript" async\
    src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML"></script>\
    <script type="text/x-mathjax-config">\
        MathJax.Hub.Config({\
            tex2jax: {\
                inlineMath: [["$","$"], ["\\\\(","\\\\)"]],\
                processEscapes: true\
            }\
        });\
        </script>\
    </head>|' "$dst"
fi

# 检查是否有mermaid有则告警
grep -n "language-mermaid" $dst
if [ $? -eq 0 ]; then
    echo "Convertion Warning: mermaid is included, may you need to replace it with a picture???"
fi
