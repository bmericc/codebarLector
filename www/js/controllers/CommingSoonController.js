(function() {
    'use strict';
    var module = angular.module('CommingSoon', []);

    module.controller('CommingSoonController', function($scope, $http) {

        $scope.searchString = "";
        $scope.isWorking = false;
        $scope.products = [];
        $scope.connectionFail = false;

        $scope.init = function() {
            console.log('inicializando');
            $scope.isWorking = true;
            var request = $http({
                method: "get",
                url: 'http://www.nakaoutdoors.com.ar/webservices/proximamente.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            // Store the data-dump of the FORM scope.
            request.success(this.httpSuccess);
            // Store the data-dump of the FORM scope.
            request.error(this.httpError);
        }

        $scope.httpError = function(data, status, headers, config) {
            $scope.connectionFail = true;
            $scope.isWorking = false;
        }

        $scope.httpSuccess = function(data, status, headers, config) {
            $scope.products = data.result.child_products;
            $scope.isWorking = false;
            $scope.connectionFail = false;
        }
    });


})();
