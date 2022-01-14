window.addEventListener('widget-init', function (e) {
    var success = document.getElementById('success');

    Signagelive.getOnlineStatus()
        .then(function (status) {
            success.innerText = JSON.stringify(status);
        })
        .catch(function (error) {
            success.innerText = error.message;
        });
});