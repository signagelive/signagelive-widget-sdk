window.addEventListener('widget-init', function (e) {
    var value = Widget.preferences['Value']
    var success = document.getElementById('success');

    Signagelive.log(value)
});