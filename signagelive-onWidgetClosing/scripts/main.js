window.addEventListener('widget-init', function (e) {
    var textContainer = document.getElementById('text');

    registerOnWidgetClosingEventHandler();

    function registerOnWidgetClosingEventHandler() {
        Signagelive.onWidgetClosing(onWidgetClosingNotificationReceived);
        Signagelive.requestMediaPlayerMoveToNextAsset();
    }

    function onWidgetClosingNotificationReceived() {
        console.log('Widget closing. Hiding text...');
        hideText();
    }

    function hideText() {
        textContainer.hidden = true;
    }
});