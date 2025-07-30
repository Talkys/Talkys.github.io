var lns = atob("TGludXg=");
var wns = atob("V2lu");

var plt = navigator.platform;

var mc = atob("bWFpbi1jb250ZW50");

document.getElementById(mc).style.display = "block";
var gen = document.getElementsByClassName("general");
for (let i = 0; i < gen.length; i++) {
    gen[i].style.display = "block";
}


document.addEventListener("DOMContentLoaded", () => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari)
    {
        window.location.href = '/fallback.html'
    }
    
})