(function() {
    'use strict';
    var app = angular.module('myApp', ['onsen.directives', 'ngSanitize', 'QuestionOnProduct', 'Cart', 'Register', 'CommingSoon', 'MainApp', 'ContactForm', 'List', 'Login', 'GridMenu', 'PendingCalifications', 'angular-carousel', 'ngDropdowns', 'GenericSelect']);

    app.factory('shoppingCart', function($http) {
        var returnValue = {
            firstRun: true,
            cartData: {}
        };

        returnValue.httpError = function(data, status, headers, config) {
            returnValue.isWorking = false;
            returnValue.firstRun = false;
        };

        returnValue.httpSuccess = function(data, status, headers, config) {
            returnValue.isWorking = false;
            returnValue.firstRun = false;
            returnValue.cartData = data.result;
        };

        returnValue.refreshCartDetails = function() {
            var request = $http({
                method: "get",
                url: 'http://www.nakaoutdoors.com.ar/webservices/carrito.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });


            // Store the data-dump of the FORM scope.
            request.success(this.httpSuccess);


            // Store the data-dump of the FORM scope.
            request.error(this.httpError);
        }

        if (returnValue.firstRun) {
            returnValue.refreshCartDetails();
        }
        return returnValue;
    });


    app.factory('sortOptions', function($http) {
        var returnValue = {
            firstRun: true,
            selectedSortOption: 1,
            options: {}
        };

        returnValue.httpError = function(data, status, headers, config) {
            console.log('Oops! Algo ha salido mal. Reintenta en un momento');
        };

        returnValue.httpSuccess = function(data, status, headers, config) {
            returnValue.firstRun = false;
            returnValue.options = data.result.order_options;
        };

        returnValue.refreshSortOptions = function() {
            var request = $http({
                method: "get",
                url: 'http://www.nakaoutdoors.com.ar/webservices/order_options.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });


            // Store the data-dump of the FORM scope.
            request.success(this.httpSuccess);


            // Store the data-dump of the FORM scope.
            request.error(this.httpError);
        }

        if (returnValue.firstRun) {
            returnValue.refreshSortOptions();
        }
        return returnValue;
    });




    app.factory('userData', function($http) {
        var returnValue = {
            logedIn: false,
            profileData: {},
            userName: null,
            password: null,
            check_password: null,
            lastProfileData: null,
            isWorking: false,
            pendingCalifications: null
        };
        returnValue.reset = function() {
            this.logedIn = false;
            this.lastProfileData = this.profileData;
            this.profileData = null;
            window.localStorage.setItem('logedIn', false);
            window.localStorage.setItem('profileData', null);
        }

        if (window.localStorage.getItem('logedIn')) {
            returnValue.logedIn = window.localStorage.getItem('logedIn') === 'true' ? true : false;
            returnValue.profileData = JSON.parse(window.localStorage.getItem('profileData'));
            returnValue.userName = window.localStorage.getItem('user');
            returnValue.password = window.localStorage.getItem('password');
        }

        returnValue.httpError = function(data, status, headers, config) {
            returnValue.isWorking = false;
            returnValue.reset();
        }

        returnValue.httpSuccess = function(data, status, headers, config) {
            returnValue.isWorking = false;
            if (data.result.logedIn === 1) {
                returnValue.profileData = data.result.Usuario;
                returnValue.profileData.provincia_id = parseInt(returnValue.profileData.provincia_id);
                returnValue.profileData.iva_facturacion = parseInt(returnValue.profileData.iva_facturacion);
                window.localStorage.setItem("profileData", JSON.stringify(data.result.Usuario));

                returnValue.userName = window.localStorage.getItem("user");
                returnValue.password = window.localStorage.getItem("password");
                returnValue.check_password = window.localStorage.getItem("password");
                returnValue.getPendingCalifications();
                returnValue.sendPushNotificationToken(window.localStorage.getItem("pushNotificationToken"));
                returnValue.logedIn = true;
            } else if (data.result.logedIn === -2) {
                prompt('Nombre de usuario o contraseña inválidas.', alertDismissed, 'Opa!', 'Aceptar');
                returnValue.logout();
            }
        }

        returnValue.refreshUserDetails = function() {
            var request = $http({
                method: "post",
                url: 'http://www.nakaoutdoors.com.ar/usuarios/applogin.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },

                data: '_method=POST&data[Login][login]=' + window.localStorage.getItem("user") + '&data[Login][password]=' + window.localStorage.getItem("password") + '&data[Login][token]=' + window.localStorage.getItem("pushNotificationToken")
            });


            // Store the data-dump of the FORM scope.
            request.success(this.httpSuccess);


            // Store the data-dump of the FORM scope.
            request.error(this.httpError);


        }

        returnValue.getPendingCalifications = function() {
            var request = $http({
                method: "get",
                url: 'http://www.nakaoutdoors.com.ar/client/articulos/valoraciones_pendientes_index.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });


            // Store the data-dump of the FORM scope.
            request.success(this.httpGetPendingCalificationsSuccess);


            // Store the data-dump of the FORM scope.
            request.error(this.httpGetPendingCalificationsFail);
        }

        returnValue.httpGetPendingCalificationsSuccess = function(data, status, headers, config) {
            if (data.result) {
                if (data.result.products) {
                    returnValue.pendingCalifications = data.result.products;
                }
            }
        }


        returnValue.httpGetPendingCalificationsFail = function(data, status, headers, config) {

        }

        returnValue.sendPushNotificationToken = function(pToken) {
            var request = $http({
                method: "post",
                url: 'http://www.nakaoutdoors.com.ar/mobile/device_add.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: '_method=POST&data[MobileDevice][token]=' + pToken + '&data[MobileDevice][os]=0&data[MobileDevice][description]=' + deviceType
            });


            // Store the data-dump of the FORM scope.
            request.success(this.httpSendPushNotificationTokenSuccess);


            // Store the data-dump of the FORM scope.
            request.error(this.httpSendPushNotificationTokenFail);
        }

        returnValue.httpSendPushNotificationTokenSuccess = function(data, status, headers, config) {
            console.log('token enviado con exito');
        }

        returnValue.httpSendPushNotificationTokenFail = function(data, status, headers, config) {
            console.log('error al enviar el token');
        }

        returnValue.logout = function(pSuccessCallback, pErrorCallback) {
            var request = $http({
                method: "get",
                url: 'http://www.nakaoutdoors.com.ar/usuarios/logout',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (pSuccessCallback) {
                // Store the data-dump of the FORM scope.
                request.success(pSuccessCallback);
            } else {
                // Store the data-dump of the FORM scope.
                request.success(this.logoutSuccess);

            }

            if (pErrorCallback) {
                // Store the data-dump of the FORM scope.
                request.error(pErrorCallback);
            } else {
                // Store the data-dump of the FORM scope.
                request.error(this.logoutError);
            }

        }

        returnValue.logoutError = function(data, status, headers, config) {
            console.log("Oops! Algo ha salido mal. Reintenta en un momento");
        }

        returnValue.logoutSuccess = function(data, status, headers, config) {
            returnValue.reset();
        }


        if (returnValue.logedIn) {
            returnValue.refreshUserDetails();
        }

        return returnValue;
    });

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
