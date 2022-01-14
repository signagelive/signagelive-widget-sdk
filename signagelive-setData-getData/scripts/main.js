window.addEventListener('widget-init', function (e) {
    var key = Widget.preferences['Key']
    var value = Widget.preferences['Value']
    var shared = Widget.preferences['Shared'] == "true" ? true : false;
    var success = document.getElementById('success');

    success.innerHTML = "Setting " + value + " with Signagelive.setData() <br>";
    Signagelive.setData(key, value, shared).then(function () {
        success.innerHTML += "Value stored, getting with Signagelive.getData() <br>";
        Signagelive.getData(key).then(function (data) {
            success.innerHTML += data + " returned from Signagelive getData";
        });
    });
});