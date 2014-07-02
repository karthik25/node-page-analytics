var secs = 0;
function timer() {
    setTimeout(function () {
        secs++;
        postMessage(secs);
        timer();
    }, 1000);
}

timer();
