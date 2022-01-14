[Element.prototype,Document.prototype,DocumentFragment.prototype].forEach(function(e){e.hasOwnProperty("prepend")||Object.defineProperty(e,"prepend",{configurable:!0,enumerable:!0,writable:!0,value:function(){var e=Array.prototype.slice.call(arguments),t=document.createDocumentFragment();e.forEach(function(e){var r=e instanceof Node;t.appendChild(r?e:document.createTextNode(String(e)))}),this.insertBefore(t,this.firstChild)}})});
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.Promise=t()}(this,function(){"use strict";function e(){}function t(e){if(!(this instanceof t))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],u(e,this)}function n(e,n){for(;3===e._state;)e=e._value;0!==e._state?(e._handled=!0,t._immediateFn(function(){var t=1===e._state?n.onFulfilled:n.onRejected;if(null!==t){var i;try{i=t(e._value)}catch(e){return void r(n.promise,e)}o(n.promise,i)}else(1===e._state?o:r)(n.promise,e._value)})):e._deferreds.push(n)}function o(e,n){try{if(n===e)throw new TypeError("A promise cannot be resolved with itself.");if(n&&("object"==typeof n||"function"==typeof n)){var o=n.then;if(n instanceof t)return e._state=3,e._value=n,void i(e);if("function"==typeof o)return void u(function(e,t){return function(){e.apply(t,arguments)}}(o,n),e)}e._state=1,e._value=n,i(e)}catch(t){r(e,t)}}function r(e,t){e._state=2,e._value=t,i(e)}function i(e){2===e._state&&0===e._deferreds.length&&t._immediateFn(function(){e._handled||t._unhandledRejectionFn(e._value)});for(var o=0,r=e._deferreds.length;r>o;o++)n(e,e._deferreds[o]);e._deferreds=null}function u(e,t){var n=!1;try{e(function(e){n||(n=!0,o(t,e))},function(e){n||(n=!0,r(t,e))})}catch(e){if(n)return;n=!0,r(t,e)}}var f=setTimeout;return t.prototype.catch=function(e){return this.then(null,e)},t.prototype.then=function(t,o){var r=new this.constructor(e);return n(this,new function(e,t,n){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.promise=n}(t,o,r)),r},t.prototype.finally=function(e){var t=this.constructor;return this.then(function(n){return t.resolve(e()).then(function(){return n})},function(n){return t.resolve(e()).then(function(){return t.reject(n)})})},t.all=function(e){return new t(function(t,n){function o(e,u){try{if(u&&("object"==typeof u||"function"==typeof u)){var f=u.then;if("function"==typeof f)return void f.call(u,function(t){o(e,t)},n)}r[e]=u,0==--i&&t(r)}catch(e){n(e)}}if(!e||void 0===e.length)throw new TypeError("Promise.all accepts an array");var r=Array.prototype.slice.call(e);if(0===r.length)return t([]);for(var i=r.length,u=0;r.length>u;u++)o(u,r[u])})},t.resolve=function(e){return e&&"object"==typeof e&&e.constructor===t?e:new t(function(t){t(e)})},t.reject=function(e){return new t(function(t,n){n(e)})},t.race=function(e){return new t(function(t,n){for(var o=0,r=e.length;r>o;o++)e[o].then(t,n)})},t._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e)}||function(e){f(e,0)},t._unhandledRejectionFn=function(e){void 0!==console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)},t});

var instance = null;

function Signagelive() {
    if (instance !== null) {
        throw new Error(
            "Cannot instantiate more than one Signagelive, use Signagelive.getInstance()"
        );
    }
    var self = this;
    self.readyToDisplaySent = false;
    self.messages = {};
    self.logCounter = 0;
    self.videoCallbacks = null;
    self.widgetClosingCallback = null;
    // Create IE + others compatible event handler
    var eventMethod = window.addEventListener ?
        "addEventListener" :
        "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
    // Listen to message from parent window
    eventer(
        messageEvent,
        function(e) {
            if (e.source == window) return;
            var message = JSON.parse(e.data);
            var params = [message.messageId, message.returnValue];
            if (self[message.method]) self[message.method].apply(self, params);
        },
        false
    );

    // Send Ready Event
    self.sendReadyToDisplay = function() {
        if (!self.readyToDisplaySent) {
            self.readyToDisplaySent = true;
            var message = {
                method: "ready",
                successCallback: "onDisplaySuccess",
                errorCallback: "onDisplayError"
            };
            return sendMessage(message);
        }
    };
    self.onDisplaySuccess = function(messageId) {
        self.messages[messageId].resolve();
    };
    self.onDisplayError = function(messageId, error) {
        self.messages[messageId].reject(new Error(error.reason));
    };

    // Get Data (Key/Value pairs)
    self.getData = function(key, shared) {
        var message = {
            method: "getData",
            params: [key, shared],
            successCallback: "onGotDataSuccess",
            errorCallback: "onGotDataError"
        };
        return sendMessage(message);
    };
    self.onGotDataSuccess = function(messageId, data) {
        self.messages[messageId].resolve(data);
    };
    self.onGotDataError = function(messageId, error) {
        self.messages[messageId].reject(new Error(error.reason));
    };

    // Set Data (Key/Value pairs)
    self.setData = function(key, value, shared) {
        var message = {
            method: "setData",
            successCallback: "onDataSetSuccess",
            errorCallback: "onDataSetError",
            params: [key, value, shared] // Shared
        };
        return sendMessage(message);
    };
    self.onDataSetSuccess = function(messageId) {
        self.messages[messageId].resolve();
    };
    self.onDataSetError = function(messageId, error) {
        self.messages[messageId].reject(new Error(error.reason));
    };

    // List stored data keys
    self.listStoredDataKeys = function(shared) {
        var message = {
            method: "listStoredDataKeys",
            successCallback: "onListStoredDataKeysSuccess",
            errorCallback: "onListStoredDataKeysError",
            params: [shared] // Shared
        };
        return sendMessage(message);
    };
    self.onListStoredDataKeysSuccess = function(messageId, keys) {
        self.messages[messageId].resolve(keys);
    };
    self.onListStoredDataKeysError = function(messageId, error) {
        self.messages[messageId].reject(new Error(error.reason));
    };

    // Remove Data
    self.removeData = function(key, shared) {
        var message = {
            method: "removeData",
            successCallback: "onRemoveDataSuccess",
            errorCallback: "onRemoveDataError",
            params: [key, shared] // Shared
        };
        return sendMessage(message);
    };
    self.onRemoveDataSuccess = function(messageId) {
        self.messages[messageId].resolve();
    };
    self.onRemoveDataError = function(messageId, error) {
        self.messages[messageId].reject(new Error(error.reason));
    };

    // Clear Storage
    self.clearStorage = function() {
        var message = {
            method: "clearStorage",
            successCallback: "onClearStorageSuccess",
            errorCallback: "onClearStorageError",
            params: [] // Shared
        };
        return sendMessage(message);
    };
    self.onClearStorageSuccess = function(messageId) {
        self.messages[messageId].resolve();
    };
    self.onClearStorageError = function(messageId, error) {
        self.messages[messageId].reject(new Error(error.reason));
    };

    // Allow widget to register to be notified when the media player is going to move next
    self.onWidgetClosing = function(cb) {
        self.widgetClosingCallback = cb;
    };
    // Basic implementation at this stage - may be expanded as per Widget SDK in the future
    self.onWidgetClosingNotificationReceived = function(messageId, data) {
        if (self.widgetClosingCallback) {
            self.widgetClosingCallback();
        }
    }

    // Get Player Details
    self.getPlayerDetails = function() {
        var message = {
            method: "getPlayerDetails",
            params: [],
            successCallback: "onGetPlayerDetailsSuccess",
            errorCallback: "onGetPlayerDetailsError"
        };
        return sendMessage(message);
    };
    self.onGetPlayerDetailsSuccess = function(messageId, data) {
        self.messages[messageId].resolve(data);
    };
    self.onGetPlayerDetailsError = function(messageId, error) {
        self.messages[messageId].reject(new Error(error.reason));
    };

    // Get Display properties
    self.getDisplayProperties = function() {
        var message = {
            method: "getDisplayProperties",
            params: [],
            successCallback: "onGetDisplayPropertiesSuccess",
            errorCallback: "onGetDisplayPropertiesError"
        };
        return sendMessage(message);
    };
    self.onGetDisplayPropertiesSuccess = function(messageId, data) {
        self.messages[messageId].resolve(data);
    };
    self.onGetDisplayPropertiesError = function(messageId, error) {
        self.messages[messageId].reject(new Error(error.reason));
    };

    // Get Supported TLS version
    self.getTLSSupportInfo = function() {
        var message = {
            method: "getTLSSupportInfo",
            params: [],
            successCallback: "onGetTLSSupportInfoSuccess",
            errorCallback: "onGetTLSSupportInfoError"
        };
        return sendMessage(message);
    };
    self.onGetTLSSupportInfoSuccess = function(messageId, data) {
        self.messages[messageId].resolve(data);
    };
    self.onGetTLSSupportInfoError = function(messageId, error) {
        self.messages[messageId].reject(new Error(error.reason));
    };
    // Check supported HTML features
    self.checkSupportedHTML5Features = function(featuresToCheck) {
        var message = {
            method: "checkSupportedHTML5Features",
            params: [featuresToCheck],
            successCallback: "onCheckSupportedHTML5FeaturesSuccess",
            errorCallback: "onCheckSupportedHTML5FeaturesError"
        };
        return sendMessage(message);
    };
    self.onCheckSupportedHTML5FeaturesSuccess = function(messageId, results) {
        self.messages[messageId].resolve(results);
    };
    self.onCheckSupportedHTML5FeaturesError = function(messageId, error) {
        self.messages[messageId].reject(new Error(error.reason));
    };

    // Request move next
    self.requestMediaPlayerMoveToNextAsset = function() {
        var message = {
            method: "requestMediaPlayerMoveToNextAsset",
            params: [],
            successCallback: "onRequestMediaPlayerMoveToNextAssetSuccess",
            errorCallback: "onRequestMediaPlayerMoveToNextAssetError"
        };
        return sendMessage(message);
    };
    self.onRequestMediaPlayerMoveToNextAssetSuccess = function(messageId) {
        self.messages[messageId].resolve();
    };
    self.onRequestMediaPlayerMoveToNextAssetError = function(messageId, error) {
        self.messages[messageId].reject(new Error(error.reason));
    };

    // Get online Status
    self.getOnlineStatus = function() {
        var message = {
            method: "getOnlineStatus",
            params: [],
            successCallback: "onGetOnlineStatusSuccess",
            errorCallback: "onGetOnlineStatusError"
        };
        return sendMessage(message);
    };
    self.onGetOnlineStatusSuccess = function(messageId, data) {
        self.messages[messageId].resolve(data);
    };
    self.onGetOnlineStatusError = function(messageId, error) {
        self.messages[messageId].reject(new Error(error.reason));
    };
	
    // Play video (native video playback only implemented on Tizen currently)
	self.playVideo = function(uris, x, y, width, height, loop, play4k, callbacks) {
        self.videoCallbacks = callbacks;
        // Only Tizen implements the playVideo() API natively right now so for all other players
        // we need to just mock it in the SDK itself
        var mockPlayVideoAPI = (navigator.userAgent.indexOf('Tizen') != -1) === false;
        if (mockPlayVideoAPI) {
            return mockPlayVideo(uris, x, y, width, height, loop, play4k, callbacks);
        }
        else {
            var message = {
                method: "playVideo",
                successCallback: "onPlayVideoSuccess",
                errorCallback: "onPlayVideoError",
                params: [uris, x, y, width, height, loop, play4k]
            };
            return sendMessage(message);
        }
    };    
    self.onPlayVideoSuccess = function(messageId, result) {
        self.messages[messageId].resolve(result);
    };
    self.onPlayVideoError = function(messageId, error) {
        self.messages[messageId].reject(new Error(error.reason));
    };

    // Stop video (native implementation Tizen only)
	self.stopVideo = function() {
        var mockPlayVideoAPI = (navigator.userAgent.indexOf('Tizen') != -1) === false;
        if (mockPlayVideoAPI) {
            return mockStopVideo();
        }
        else {
            var message = {
                method: "stopVideo",
                successCallback: "onStopVideoSuccess",
                errorCallback: "onStopVideoError",
                params: []
            };
            return sendMessage(message);
        }
    };
    self.onStopVideoSuccess = function(messageId, result) {
        self.messages[messageId].resolve(result);
    };
    self.onStopVideoError = function(messageId, error) {
        self.messages[messageId].reject(new Error(error.reason));
    };

    self.onVideoError = function(messageId, data) {
        if (self.videoCallbacks && self.videoCallbacks.onError) {
            self.videoCallbacks.onError(data.video, data.errorMessage);
        }
    };

    self.onVideoTimeUpdate = function(messageId, data) {
        if (self.videoCallbacks && self.videoCallbacks.onTimeUpdate) {
            if((navigator.userAgent.indexOf('Tizen') != -1)) {
                data.currentTime = (data.currentTime/1000);
            }
            self.videoCallbacks.onTimeUpdate(data.video, data.currentTime);
        }
    };

    self.onVideoComplete = function(messageId, data) {
        if (self.videoCallbacks && self.videoCallbacks.onComplete) {
            self.videoCallbacks.onComplete(data.video);
        }
    };

    self.log = function(msg) {
        if (self.logCounter == 30) {
            self.logCounter = 0;
            $('#trace-log').html("");
        }

        console.log(msg);
        $('#trace-log').append("<div>" + msg + "</div>");

        self.logCounter++;
    }

    var videoPlaylist = [];
    var playlistPosition = 0;
    function mockPlayVideo(uris, x, y, width, height, loop) {
        var isVideoPlaylist = Array.isArray(uris);
        videoPlaylist = uris;
        playlistPosition = 0;
        // Return a promise
        if (isVideoPlaylist) {
            return new Promise(function(resolve, reject) {
                // Store the resolve function of the promise which can be hardcoded as we can only have
                // 1 video play at a time
                self.messages["mockVideoPlaying"] = resolve;
                // Create 1st video element
                var video1 = document.createElement("video");
                video1.id = 'sl_video_1';
                video1.style.position = 'absolute';
                video1.style.top = y + 'px;';
                video1.style.left = x + 'px;';
                video1.style.width = width + 'px;';
                video1.style.height = height + 'px;';
                video1.style.visibility = 'hidden';
                // Add to DOM
                document.body.prepend(video1);
                // Add event listeners
                video1.addEventListener('playing', onMockedVideo1Playing);
                video1.addEventListener('timeupdate', onMockedVideoTimeUpdate);
                video1.addEventListener('ended', onMockedVideo1Ended);
                video1.addEventListener('error', onMockedVideoError, true);
                // Create 1st video element
                var video2 = document.createElement("video");
                video2.id = 'sl_video_2';
                video2.style.position = 'absolute';
                video2.style.top = y + 'px;';
                video2.style.left = x + 'px;';
                video2.style.width = width + 'px;';
                video2.style.height = height + 'px;';
                video2.style.visibility = 'hidden';
                // Add to DOM
                document.body.prepend(video2);
                // Add event listeners
                video2.addEventListener('playing', onMockedVideo2Playing);
                video2.addEventListener('timeupdate', onMockedVideoTimeUpdate);
                video2.addEventListener('ended', onMockedVideo2Ended);
                video2.addEventListener('error', onMockedVideoError, true);
                    // Play the first video
                video1.src = videoPlaylist[playlistPosition];
                video1.load();
                video1.play();
            });
        }
        else {
            return new Promise(function(resolve) {
                self.messages["mockVideoPlaying"] = resolve;
                // Create 1st video element
                var video1 = document.createElement("video");
                video1.id = 'sl_video_1';
                video1.style.position = 'absolute';
                video1.style.top = y + 'px;';
                video1.style.left = x + 'px;';
                video1.style.width = width + 'px;';
                video1.style.height = height + 'px;';
                video1.style.visibility = 'visible';
                video1.loop = true;
                video1.autoplay = true;
                video1.muted = true;
                // Add to DOM
                document.body.prepend(video1);
                video1.src = uris;
                // Add event listeners
                video1.addEventListener('playing', onMockedVideoPlaying);
                video1.addEventListener('timeupdate', onMockedVideoTimeUpdate);
                video1.addEventListener('ended', onMockedVideoEnded);
                video1.addEventListener('error', onMockedVideoError, true);
            });
        }
    }

    function mockStopVideo() {
        return new Promise(function(resolve, reject) {
            var video1 = document.getElementById("sl_video_1");
            var video2 = document.getElementById("sl_video_2");
            if (video1) {
                video1.pause();
                video1.currentTime = 0;
                video1.style.visibility = 'hidden';
                video1.remove();
            }
            if (video2) {
                video2.pause();
                video2.currentTime = 0;
                video2.style.visibility = 'hidden';
                video2.remove();
            }
            resolve();
        });
    }

    function updateVideoPlayingIndex() {
        playlistPosition = (playlistPosition + 1) % videoPlaylist.length;
    }

    function onMockedVideoTimeUpdate(event) {
        var currentVideoSrc = this.currentSrc;
        var currentTime = this.currentTime;
        self.videoCallbacks.onTimeUpdate(currentVideoSrc, currentTime);
    }
    function onMockedVideoPlaying(event) {
        self.messages["mockVideoPlaying"](true);
    }
    function onMockedVideo1Playing(event) {
        self.messages["mockVideoPlaying"](true);
        // Show video 1 and hide video2
        var video1 = document.getElementById("sl_video_1");
        var video2 = document.getElementById("sl_video_2");
        video1.style.visibility = 'visible';
        video2.style.visibility = 'hidden';
        // Preload the next video
        updateVideoPlayingIndex();
        video2.src = videoPlaylist[playlistPosition];
        video2.load();

    }
    function onMockedVideo2Playing(event) {
        self.messages["mockVideoPlaying"](true);
        // Show video 1 and hide video2
        var video1 = document.getElementById("sl_video_1");
        var video2 = document.getElementById("sl_video_2");
        video2.style.visibility = 'visible';
        video1.style.visibility = 'hidden';
        // Preload the next video
        updateVideoPlayingIndex();
        video1.src = videoPlaylist[playlistPosition];
        video1.load();

    }
    function onMockedVideoEnded(event) {
        var currentVideoSrc = this.currentSrc;
        self.videoCallbacks.onComplete(currentVideoSrc);
    }
    function onMockedVideo1Ended(event) {
        var currentVideoSrc = this.currentSrc;
        self.videoCallbacks.onComplete(currentVideoSrc);
        // Move next
        var video2 = document.getElementById("sl_video_2");
        video2.play();
    }
    function onMockedVideo2Ended(event) {
        var currentVideoSrc = this.currentSrc;
        self.videoCallbacks.onComplete(currentVideoSrc);
        // Move next
        var video1 = document.getElementById("sl_video_1");
        video1.play();
    }

    function onMockedVideoError(event) {
        var currentVideoSrc = this.currentSrc;
        self.messages["mockVideoPlaying"](false);
        var error = event;
        if (event.path && event.path[0]) {
            error = event.path[0].error;
        }
        self.videoCallbacks.onComplete(currentVideoSrc, error);
    }

    function sendMessage(message) {
        var messageSent = new Promise(function(resolve, reject) {
            try {
                var messageId = uuidv4();
                message.messageId = messageId;
                message.windowId = window.name;
                self.messages[messageId] = {
                    resolve: resolve,
                    reject: reject
                };
                if (parent) {
                    parent.postMessage(JSON.stringify(message), "*");
                }
                else {
                    reject(new Error("Parent window not found"));
                }
            } catch (e) {
                reject(e);
            }
        });
        return messageSent;
    }

    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

Signagelive.getInstance = function() {
    if (instance === null) {
        instance = new Signagelive();
    }
    return instance;
};

window.Signagelive = Signagelive.getInstance();