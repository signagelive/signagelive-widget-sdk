window.addEventListener('widget-init', function (e) {
    var timeout = Widget.preferences['Timeout']
    var container = document.getElementById('right-hand');
    var success = document.getElementById('success');

    setTimeout(function() {
        Signagelive.sendReadyToDisplay();
        container.style.backgroundColor = "#055008";
        success.innerText = "event success";
    }, timeout);
});