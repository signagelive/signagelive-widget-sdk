window.addEventListener('widget-init', function (e) {
    var success = document.getElementById('success');

    Signagelive.getTLSSupportInfo()
        .then(function (maxSupportedTLSVersion) {
            success.innerText = JSON.stringify(maxSupportedTLSVersion);
        })
        .catch(function (error) {
            success.innerText = error.message;
        });
});