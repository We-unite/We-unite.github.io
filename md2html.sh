#!/bin/bash

##########################################################################
# File Name    : md2html.sh
# Encoding     : utf-8
# Author       : We-unite
# Email        : weunite1848@gmail.com
# Created Time : 2023-12-15
##########################################################################

# origin是输入的第一个参数，指源文件名
# src是原文件名前边加一个.，是源文件的复制
# dst是原文件名的md后缀改成html
origin=$1
src="."$origin
dst=${origin%.*}".html"

cp $origin $src
# src中所有的“```...”替换成“```”，其中...指换行前的所有内容
sed -i 's/```.*$/```/g' $src
pandoc -s $src -o $dst
rm $src

sed -i '/<style/,/<\/style>/d' $dst
sed -i 's/<body>/<body>\n<div class="pandoc">\n<div class="main">/' $dst
sed -i 's/<\/body>/<script src="https:\/\/www.qin-juan-ge-zhu.top\/common\/js\/comment.js"><\/script>\n<\/div>\n<\/div>\n<\/body>/' $dst
sed -i 's/\t/    /g' $dst
sed -i 's/<\/head>/<link rel="stylesheet" href="https:\/\/www.qin-juan-ge-zhu.top\/common\/CSS\/pandoc.css">\n<script type="text\/javascript" src="https:\/\/www.qin-juan-ge-zhu.top\/common\/script4code.js"><\/script><\/head>/' $dst
