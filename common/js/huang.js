var isOpen = false;
function openNav() {
    document.getElementById("mySidenav").style.width = "300px";
    isOpen = true;
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    isOpen = false;
}