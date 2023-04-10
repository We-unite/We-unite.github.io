const yanhua = document.querySelector(".yanhua")
window.onclick = function (e) {
    for (let i = 0; i < 20; i++) {
        let x = e.pageX;
        let y = e.pageY;
        let div = document.createElement("div");
        div.style.left = x + "px";
        div.style.top = y + "px";
        div.style.backgroundColor = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
        yanhua.appendChild(div);
        div.style.setProperty("--t", y + (Math.random() - 0.5) * 300 + "px")
        div.style.setProperty("--l", x + (Math.random() - 0.5) * 300 + "px")
        div.style.animation = "yanhua 1s"
        setTimeout(() => {
            div.remove()
        }, 1000);
    }

}