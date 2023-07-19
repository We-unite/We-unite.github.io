$(document).ready(function () {
    var gPressed = false; // 标记是否已经按下第一个 "g" 键
    var gTimer; // 计时器变量
    var gDelay = 500; // 0.5s 内按两次 "g" 键的延迟时间

    var numKeyPressed = false; // 标记是否已经按下数字键
    var numKey = "1"; // 存储连续按下的数字键

    var isScrolling = false; // 标记是否正在滚动
    var scrollDirection = 0; // 滚动方向，1 表示向下滚动，-1 表示向上滚动
    var scrollSpeed = 3; // 连续滚动的距离
    var step_length = 200;//单次滚动距离
    var scrollInterval; // 滚动的间隔函数

    var jPressed = false; // 标记是否已经按下 j 键
    var kPressed = false; // 标记是否已经按下 k 键
    var scrollDelay = 500; // 连续滚动的延迟时间

    // 监听键盘按下事件
    $(document).keydown(function (e) {
        // 获取按下的键码
        var key = e.which;

        // 按下数字键
        if (key >= 48 && key <= 57) {
            if (!numKeyPressed) {
                numKey = "";
                numKeyPressed = true;
                numKey += String.fromCharCode(key); // 连接多位数字键
            }
            else {
                numKey += String.fromCharCode(key);
            }
            // 设置定时器，在1秒后将数字键的状态重置为未按下
            setTimeout(function () {
                numKeyPressed = false;
                numKey = "1"; // 重置数字键值
            }, 1000);
        }

        // 按下 j 键，开始连续滚动向下
        if (key === 74 && !isScrolling) {
            e.preventDefault();
            jPressed = true;
            startScrolling();
        }

        // 按下 k 键，开始连续滚动向上
        if (key === 75 && !isScrolling) {
            e.preventDefault();
            kPressed = true;
            startScrolling();
        }

        // 按下 g 键
        if (key === 71 && !e.shiftKey) {
            if (!gPressed) {
                gPressed = true; // 第一次按下 "g" 键，标记为已按下
                clearTimeout(gTimer);
                gTimer = setTimeout(function () {
                    gPressed = false; // 0.5 秒内未按下第二个 "g" 键，重置标记
                }, gDelay);
            } else {
                e.preventDefault();
                $('html, body').animate({ scrollTop: 0 }, 500); // 第二次按下 "g" 键，回到页面顶部
                clearTimeout(gTimer);
                gPressed = false; // 重置标记
            }
        }

        // 按下 Shift + g 键，滚动到页面底部
        else if (key === 71 && e.shiftKey) {
            e.preventDefault();
            $('html, body').animate({ scrollTop: $(document).height() }, 500);
        }

        // 按下h键，如有菜单则打开菜单
        if (key === 72) {
            if (isOpen) {
                closeNav();
            }
            else {
                openNav();
            }
        }
    });

    // 监听键盘松开事件
    $(document).keyup(function (e) {
        // 获取松开的键码
        var key = e.which;

        // 松开 j 键，停止连续滚动
        if (key === 74) {
            jPressed = false;
            stopScrolling();
        }

        // 松开 k 键，停止连续滚动
        if (key === 75) {
            kPressed = false;
            stopScrolling();
        }
    });

    // 开始连续滚动
    function startScrolling() {
        if (!isScrolling) {
            isScrolling = true;
            scrollDirection = jPressed ? 1 : -1;

            // 按住时间不足 0.5 秒时，只滚动一次
            if (jPressed || kPressed) {
                scrollOnce();
                setTimeout(function () {
                    if (jPressed || kPressed) {
                        startContinuousScrolling();
                    } else {
                        stopScrolling(); // 松开按键时停止连续滚动
                    }
                }, scrollDelay);
            }
        }
    }

    // 开始连续滚动
    function startContinuousScrolling() {
        scrollInterval = setInterval(function () {
            $('html, body').animate({ scrollTop: '+=' + (scrollDirection * scrollSpeed) }, 0);
        }, 1);
    }

    // 滚动一次
    function scrollOnce() {
        var num = parseInt(numKey); // 解析多位数字键
        $('html, body').animate({ scrollTop: '+=' + (scrollDirection * num * step_length) }, num * 500);
        setTimeout(() => {
            numKey = "1";//numKey复位，避免影响后续使用
            numKeyPressed = false;
        }, 100);
    }

    // 停止连续滚动
    function stopScrolling() {
        clearInterval(scrollInterval);
        isScrolling = false;
    }
});