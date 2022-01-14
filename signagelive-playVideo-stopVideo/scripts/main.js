window.addEventListener('widget-init', function (e) {
    // Use the new playVideo() SDK API to play a single video
    Signagelive.playVideo(
        'media/video.mp4',        // File to play (relative to index.html)
        0,                      // x pos
        0,                      // y pos
        1920,                   // width
        1080,                   // height
        false,                   // loop video
        false,                  // 4k video (supported screens only)
        // Video events
        { 
            onTimeUpdate: onVideoTimeUpdate,
            onComplete: onVideoComplete,
            onError: onVideoError
        }
    ).then(function(success) {
        // Was playback successful?
        success
            ? console.log('Video playback started successfully.')
            : console.error('Video playback failed.');
    });
 
    function onVideoTimeUpdate(video, currentTime) {
        var message = 'Video Time Update: ' + currentTime;
    }
 
    function onVideoComplete(video) {
        var message = 'Video Complete';
        console.log(message);
        Signagelive.stopVideo();
    }
 
    function onVideoError(video, errorMessage) {
        var message = 'Video Error: ' + errorMessage;
        console.error(message);
    }
});