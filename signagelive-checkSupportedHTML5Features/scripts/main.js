window.addEventListener('widget-init', function (e) {
    var success = document.getElementById('success');

    Signagelive.checkSupportedHTML5Features(['cssanimations', 'flexbox', 'es6collections', 'arrow'])
        .then(function (results) {
            success.innerText = JSON.stringify(results);
        })
        .catch(function (error) {
            success.innerText = error.message;
        });
});