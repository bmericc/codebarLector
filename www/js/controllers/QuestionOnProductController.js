(function() {
    'use strict';
    var module = angular.module('QuestionOnProduct', []);
    module.controller('QuestionOnProductController', function($scope, $http, userData) {

        if (userData.profileData) {
            $scope.nombre = userData.profileData.nombre + ' ' + userData.profileData.apellido;
            $scope.email = userData.profileData.mail;
            $scope.telefono = userData.profileData.celular;
            $scope.ubicacion = userData.profileData.localidad;
            $scope.user_id = userData.profileData.id;
        } else if (userData.lastProfileData) {
            $scope.nombre = userData.lastProfileData.login;
            $scope.email = userData.lastProfileData.mail;
            $scope.telefono = userData.lastProfileData.celular;
            $scope.ubicacion = userData.lastProfileData.localidad;
            $scope.user_id = userData.lastProfileData.id;
        } else {
            $scope.nombre = "";
            $scope.email = "";
            $scope.telefono = "";
            $scope.ubicacion = "";
        }

        $scope.consulta = "";
        $scope.isWorking = false;

        $scope.sendContact = function() {

            var hashMail = $scope.hashMail;
            var hashAnt = $scope.hashAnt;

            var request = $http({
                method: "post",
                url: 'http://www.nakaoutdoors.com.ar/articulos/index.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: '_method=POST&data[Opinion][nombre]=' + $scope.product.title + '&data[Opinion][articulo_id]=' + $scope.product.id + '&data[Opinion][usuario_id]=' + $scope.user_id + '&data[Opinion][name]=' + $scope.nombre + '&data[Opinion][liam]=' + $scope.email + '&data[Opinion][telefono]=' + $scope.telefono + '&data[Opinion][ubicacion]=' + $scope.ubicacion + '&data[Opinion][message]=' + $scope.consulta + '&data[Opinion][mail]=' + hashMail + '&data[Opinion][maps]=&' + '&data[Opinion][ant]=' + hashAnt + '&data[Opinion][url]=contactos&',
            });


            // Store the data-dump of the FORM scope.
            request.success(this.httpSuccess);


            // Store the data-dump of the FORM scope.
            request.error(this.httpError);

        }

        $scope.goBack = function() {
            if ($scope.isWorking === true) return;
            ons.navigator.popPage();
        }

        $scope.getHash = function() {
            if ($scope.isWorking === true) return;
            $scope.isWorking = true;
            var request = $http({
                method: "get",
                url: 'http://www.nakaoutdoors.com.ar/webservices/hash.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });


            // Store the data-dump of the FORM scope.
            request.success(this.httpGetHashSuccess);


            // Store the data-dump of the FORM scope.
            request.error(this.httpError);
        }

        $scope.httpGetHashSuccess = function(data) {
            var hashObj = data.result;
            $scope.hashMail = hashObj.mail;
            $scope.hashAnt = hashObj.ant;

            $scope.sendContact();
        }

        $scope.httpError = function(data, status, headers, config) {
            messageWindowError("Ooosp!, algo ha salido mal, reintente en un momento");
            $scope.isWorking = false;
        }

        $scope.httpSuccess = function(data, status, headers, config) {
            messageWindow('Su consulta ha sido enviada con éxito');
            var image = userData.logedIn == 'true'?userData.profileData.imagen:'http://www.nakaoutdoors.com.ar/img/avatar/sin_avatar_thumb.jpg';
            $scope.product.questions.unshift({
                user: {
                    name: $scope.nombre,
                    image: image,
                    is_client: 1
                },
                message: $scope.consulta,
                response: null
            });
            ons.navigator.popPage();
        }
    });
})();
