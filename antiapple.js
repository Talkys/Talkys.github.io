var lns = atob("TGludXg=");
var wns = atob("V2lu");

var plt = navigator.platform;

var mc = atob("bWFpbi1jb250ZW50");

if(plt.indexOf(lns) != -1 || plt.indexOf(wns) != -1){
    document.getElementById(mc).style.display = "block";
}

if(plt.indexOf(lns != -1) && plt.indexOf(wns) == -1) {
    var lnel = document.getElementsByClassName("linuxexclusive");
    for (let i = 0; i < lnel.length; i++) {
        lnel[i].style.display = "block";
    }
    
}

if(plt.indexOf(lns == -1) && plt.indexOf(wns) != -1) {
    var lnel = document.getElementsByClassName("windowsexclusive");
    for (let i = 0; i < lnel.length; i++) {
        lnel[i].style.display = "block";
    }
}

document.getElementById("platform").innerText = plt;