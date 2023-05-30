//创建一个div，用于存放评论框
const commentElement = document.createElement("div");
commentElement.className = "comment";
commentElement.innerHTML = '<hr>';

//创建一个script，用于加载评论框
const scriptElement = document.createElement("script");

//设置script的属性
scriptElement.src = "https://giscus.app/client.js";
scriptElement.setAttribute("data-repo", "We-unite/We-unite.github.io");
scriptElement.setAttribute("data-repo-id", "R_kgDOJU0JLQ");
scriptElement.setAttribute("data-category", "Announcements");
scriptElement.setAttribute("data-category-id", "DIC_kwDOJU0JLc4CW1vs");
scriptElement.setAttribute("data-mapping", "title");
scriptElement.setAttribute("data-strict", "1");
scriptElement.setAttribute("data-reactions-enabled", "1");
scriptElement.setAttribute("data-emit-metadata", "0");
scriptElement.setAttribute("data-input-position", "top");
scriptElement.setAttribute("data-theme", "light");
scriptElement.setAttribute("data-lang", "zh-CN");
scriptElement.setAttribute("data-loading", "lazy");
scriptElement.setAttribute("crossorigin", "anonymous");
scriptElement.setAttribute("async", "");

//将script添加到div中
commentElement.appendChild(scriptElement);
//将div添加到页面中
document.write(commentElement.outerHTML);