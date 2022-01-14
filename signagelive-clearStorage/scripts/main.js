window.addEventListener('widget-init', function (e) {
    var success = document.getElementById('success');

    Signagelive.clearStorage()
    success.innerText = "All key-value pairs removed";
});