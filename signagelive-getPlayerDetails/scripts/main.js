window.addEventListener('widget-init', function (e) {
    var success = document.getElementById('success');

    Signagelive.getPlayerDetails()
        .then(function (playerDetails) {
            success.innerText = JSON.stringify(playerDetails);
        })
        .catch(function (error) {
            success.innerText = error.message;
        });

});