const yanhua = document.querySelector(".yanhua");
window.onclick = (e) => {
    for (let t = 0; t < 20; t++) {
        let t = e.pageX,
            a = e.pageY,
            n = document.createElement("div");
        (n.style.left = t + "px"),
            (n.style.top = a + "px"),
            (n.style.background = `radial-gradient(rgb(${255 * Math.random()},${255 * Math.random()},${255 * Math.random()}), transparent)`),
            yanhua.appendChild(n),
            n.style.setProperty("--t", a + 1e3 * (Math.random() - 0.5) + "px"),
            n.style.setProperty("--l", t + 1e3 * (Math.random() - 0.5) + "px"),
            (n.style.animation = "yanhua 2s"),
            setTimeout(() => {
                n.remove();
            }, 2e3);
    }
};
