/* 鼠标点击文字特效 */
var f_idx;
jQuery(document).ready(function ($) {
    $("body").click(function (e) {
        var font = new Array("帅气", "英俊", "机智", "善良", "阁主", "快乐", "自由", "智识", "人民", "读书", "码字", "睡觉");
        var $i = $("<span />").text(font[f_idx]);
        f_idx = Math.floor(Math.random() * (font.length - 1));
        var x = e.pageX,
            y = e.pageY;
        $i.css({
            "z-index": 99999999999999999999999999999999999999999999999999999999999999999999999999,
            "top": y - 20,
            "left": x,
            "position": "absolute",
            "font-weight": "bold",
            "color": randomColor()
        });
        $("body").append($i);
        $i.animate({
            "top": y - 180,
            "opacity": 0
        },
            1500,
            function () {
                $i.remove();
            });
    });
});
function randomColor() {//得到随机的颜色值
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return "rgb(" + r + "," + g + "," + b + ")";
}