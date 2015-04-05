(function() {
    'use strict';
    var module = angular.module('Carrousel', []);

    module.controller('CarrouselController', function($scope, $http) {
        $scope.slides4 = [];
        

        $scope.addSlides = function(target, style, qty) {
            for (var i = 0; i < qty; i++) {
                this.addSlide(target, style);
            }
        }

         $scope.addSlide = function(target, style) {
            var i = target.length;
            target.push({
                label: 'slide #' + (i + 1),
                img: 'http://lorempixel.com/450/150/' + style + '/' + (i % 10),
                color: "#fc0003",
                odd: (i % 2 === 0)
            });
        }

        $scope.addSlides($scope.slides4, 'nature', 5);
    });

})();
