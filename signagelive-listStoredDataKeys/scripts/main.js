window.addEventListener('widget-init', function (e) {
    var shared = Widget.preferences['Shared'] == "true" ? true : false;
    var success = document.getElementById('success');

    Signagelive.listStoredDataKeys(shared).then(function (data) {
        console.log(data);
        success.innerText = JSON.stringify(data) + " returned from Signagelive listStoredDataKeys";
    }).catch(function (error) {
        console.error(error.message);
        success.innerText = error.message;
    });
});