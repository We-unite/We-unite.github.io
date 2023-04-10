function book(opening, closed) {
    if (opening == document.getElementById(opening).className) {
        document.getElementById(opening).style.display = "block", document.getElementById(opening).className = closed, document.getElementById(closed).innerHTML = "关闭"
    } else {
        document.getElementById(opening).style.display = "none", document.getElementById(opening).className = opening, document.getElementById(closed).innerHTML = "我要看总集"
    }
}