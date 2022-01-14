window.addEventListener('widget-init', function (e) {
    var success = document.getElementById('success');

    Signagelive.getDisplayProperties()
        .then(function (displayProperties) {
            success.innerText = JSON.stringify(displayProperties);
        })
        .catch(function (error) {
            success.innerText = error.message;
        });
});