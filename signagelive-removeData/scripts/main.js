window.addEventListener('widget-init', function (e) {
    var key = Widget.preferences['Key']
    var shared = Widget.preferences['Shared'] == "true" ? true : false;
    var success = document.getElementById('success');

    Signagelive.removeData(key, shared)
        .then(function () {
            success.innerText = "Key: " + key + " and value pair removed";
        })
        .catch(function (error) {
            success.innerText = error.message;
        });
});