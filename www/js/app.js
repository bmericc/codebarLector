(function() {
    'use strict';
    var app = angular.module('myApp', ['onsen.directives', 'ngSanitize', 'QuestionOnProduct', 'Cart', 'Register', 'CommingSoon', 'MainApp', 'ContactForm', 'List', 'Login', 'GridMenu', 'PendingCalifications', 'angular-carousel', 'ngDropdowns', 'GenericSelect']);



})();

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        deviceReadyWasFired = true;
        navigator.splashscreen.hide();
        if (device.platform == 'Android') {
            subscriveToPushNotificationsAndroid();
        } else {
            subscriveToPushNotificationsIOS();
        }


    }
};


var deviceReadyWasFired = false;

function alertDismissed() {
    console.log('dummy callback');
}

function subscriveToPushNotificationsAndroid() {
    var pushNotification = window.plugins.pushNotification;
    pushNotification.register(successHandler, errorHandler, {
        "senderID": "973400049330",
        "ecb": "onNotificationGCM"
    });

}

function subscriveToPushNotificationsIOS() {
    var pushNotification = window.plugins.pushNotification;
    pushNotification.register(
        tokenHandler,
        errorHandler, {
            "badge": "true",
            "sound": "true",
            "alert": "true",
            "ecb": "onNotificationAPN"
        });
}

function tokenHandler(result) {
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
    window.localStorage.setItem('pushNotificationToken', result);
}

// result contains any message sent from the plugin call
function successHandler(result) {}

function errorHandler(error) {
    promptError(error);
}

function onNotificationGCM(e) {
    switch (e.event) {
        case 'registered':
            if (e.regid.length > 0) {
                window.localStorage.setItem('pushNotificationToken', e.regid);
            }
            break;

        case 'message':
            // this is the actual push notification. its format depends on the data model from the push server
            if (e.payload.productID) {
                gcmProductID = e.payload.productID;
            }
            if (e.payload.categoryID) {
                gcmCategoryID = e.payload.categoryID;
            }
            break;

        case 'error':
            alert('GCM error = ' + e.msg);
            break;

        default:
            alert('An unknown GCM event has occurred');
            break;
    }
}


//---google app analitycs
var gaPlugin;

function googleAnalyticsSuccess() {
    gaPlugin.trackEvent(googleAnalyticsTrackEventSuccess, googleAnalyticsTrakEventError, "Button", "Click", "event only", 1);
    gaPlugin.trackEvent(googleAnalyticsTrackEventSuccess, googleAnalyticsTrakEventError, "Application", "init", "Aplicación iniciada", 1);
}

function googleAnalyticsError() {
    console.log("error al inicializar google analytics");
}

function googleAnalyticsTrackEventSuccess() {
    console.log('evento trackeado con exito');
}

function googleAnalyticsTrakEventError() {
    console.log("error al trackear evento de google analytics");
}

window.setTimeout(function() {
    if (!deviceReadyWasFired) {
        var e = document.createEvent('Events');
        e.initEvent("deviceready");
        document.dispatchEvent(e);
    }
}, 3000);
