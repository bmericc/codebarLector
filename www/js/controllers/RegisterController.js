(function() {
    'use strict';
    var module = angular.module('Register', []);


    module.controller('RegisterController', function($scope, $http) {

        $scope.searchString = "";
        $scope.isWorking = false;
        $scope.products = [];
        $scope.buyOptions = {};

        $scope.register = function() {

            $scope.isWorking = true;
            var request = $http({
                method: "post",
                url: 'http://www.nakaoutdoors.com.ar/usuarios/registro.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },

                data: '_method=POST&data[Usuario][nombre]=' + $scope.nombre + '&data[Usuario][apellido]=' + $scope.apellido + '&data[Usuario][liam]=' + $scope.email + '&data[Usuario][provincia_id]=' + $scope.provincia + '&data[Usuario][login]=' + $scope.userName + '&data[Usuario][password]=' + $scope.password + '&data[Usuario][check_password]=' + $scope.password + '&data[Usuario][ant]=' + $scope.hashAnt + '&data[Usuario][mail]=' + $scope.hashMail + '&data[Usuario][maps]=&'
            });

            // Store the data-dump of the FORM scope.
            request.success(this.httpSuccess);


            // Store the data-dump of the FORM scope.
            request.error(this.httpError);

        }

        $scope.httpError = function(data, status, headers, config) {
            messageWindowError("Oops! Algo ha salido mal. Reintenta en un momento");
        }

        $scope.httpSuccess = function(data, status, headers, config) {
            $scope.result = data.result;
            $scope.isWorking = false;
            if ($scope.result.code === 0) {
                messageWindow(decodeHtml($scope.result.messagge.replace(/<\/?[^>]+(>|$)/g, "")));
                $scope.goBack();
            } else {
                messageWindowError($scope.result.messagge);
            }
        }

        $scope.init = function() {
            $scope.getBuyOptions();
        }

        $scope.submitRegister = function() {
            if ($scope.formRegister.$invalid) {
                messageWindow("Debe completar todos los campos marcados en rojo");
                return;
            }

            if (!$scope.provincia) {
                messageWindow("Debe indicar su provincia de residencia, esto facilitará las compras a travez de la aplicación");
                return;
            }

            if ($scope.password != $scope.passwordVerification) {
                messageWindow("Las passwords no coinciden");
                return;
            }
            $scope.getHash();
        }

        $scope.getHash = function() {
            if ($scope.isWorking === true) return;
            $scope.isWorking = true;
            var request = $http({
                method: "get",
                url: 'http://www.nakaoutdoors.com.ar/webservices/hash.json?rnd=' + Math.random().toString().split('.')[1],
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });


            // Store the data-dump of the FORM scope.
            request.success(this.httpGetHashSuccess);


            // Store the data-dump of the FORM scope.
            request.error(this.httpError);
        }

        $scope.goBack = function() {
            if ($scope.isWorking === true) return;
            ons.navigator.popPage();
        }

        $scope.httpGetHashSuccess = function(data) {
            var hashObj = data.result;
            $scope.hashMail = hashObj.mail;
            $scope.hashAnt = hashObj.ant;

            $scope.register();
        }

        $scope.httpError = function(data, status, headers, config) {
            messageWindowError("Ooosp!, algo ha salido mal, reintente en un momento");
            $scope.isWorking = false;
        }

        $scope.getBuyOptions = function() {
            var request = $http({
                method: "get",
                url: 'http://www.nakaoutdoors.com.ar/pedidos/buy_options.json?rnd=' + Math.random().toString().split('.')[1],
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            // Store the data-dump of the FORM scope.
            request.success(this.httpGetBuyOptiondSuccess);

            // Store the data-dump of the FORM scope.
            request.error(this.httpGetBuyOptiondError);
        }

        $scope.httpGetBuyOptiondSuccess = function(data, status, headers, config) {
            $scope.buyOptions = data.result;
            console.log($scope.buyOptions);
        }

        $scope.httpGetBuyOptiondError = function() {

        }

    });

    module.directive('moduleComboProvincias', function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/modules/comboProvincias.html'
        };
    });

    module.directive('moduleCategoryList', function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/modules/categoryList.html'
        };
    });

    module.directive('moduleProductList', function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/modules/productList.html'
        };
    });
})();
