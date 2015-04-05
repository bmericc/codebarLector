(function() {
    'use strict';
    var module = angular.module('PendingCalifications', []);

    module.controller('PendingCalificationsController', function($scope, $http, userData) {
        $scope.userData = userData;
        $scope.calificationBeingEdited = -1;
        $scope.isWorking = false;
        $scope.connectionFail = false;

       

        $scope.calificationForm = {
            valoracion: 0
        };
        $scope.starOptions = [{
            'label': '-- Elija una calificación --',
            'value': "0"
        }, {
            'label': '1 Estrella',
            'value': "1"
        }, {
            'label': '2 Estrellas',
            'value': "2"
        }, {
            'label': '4 Estrellas',
            'value': "4"
        }, {
            'label': '5 Estrellas',
            'value': "5"
        }]

        $scope.id = "";

        $scope.setCalificationBeingEdited = function(pProductId, pProduct) {
            if($scope.calificationBeingEdited != pProductId)
            {
                $scope.calificationBeingEdited = pProductId;
                $scope.calificationForm.status = pProduct.review.status;
                $scope.calificationForm.valoracion = pProduct.review.score;
                $scope.calificationForm.comentario = pProduct.review.review;
            }
        }

        /*
        data[Valoracion][id]  -> EL ID del review que te paso anteriormente
        data[Valoracion][valoracion] -> Te lo paso como score... va del 1 al 5... aca necesito que me pases con estos nombres que son los que van a BD.
        data[Valoracion][comentario] -> El review en si... recorda restringir a minimo 50 caracteres.
        // Los siguientes campos mandamelos auque realmente no se si seria necesarios.
        data[Valoracion][articulo_id] - > ID del articulo pasado en el JSON de pendientes.
        data[Valoracion][usuario_id] - > ID del usuario logueado
        data[Valoracion][estado] -> Es el "status" actual de la valoracion, tambien pasado en el JSON de pendientes.
        */

        $scope.submitCalification = function(pProduct, pCalificationForm) {
            if ($scope.isWorking) return;

            if(pCalificationForm.comentario.length < 50)
            {
                promptError('La calificación debe tener mas de 50 letras.');
                return;
            }
            $scope.isWorking = true;


            var request = $http({
                method: "post",
                url: 'http://www.nakaoutdoors.com.ar/client/articulos/valorar.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },

                data: '_method=POST&data[Valoracion][estado]=' + pProduct.review.status + '&data[Valoracion][id]=' + pProduct.review.id + '&data[Valoracion][valoracion]=' + pCalificationForm.valoracion + '&data[Valoracion][comentario]=' + pCalificationForm.comentario + '&data[Valoracion][articulo_id]=' + pProduct.id + '&data[Valoracion][usuario_id]=' + $scope.userData.profileData.id + '&',
            });

            // Store the data-dump of the FORM scope.
            request.success(this.httpSuccess);

            // Store the data-dump of the FORM scope.
            request.error(this.httpError);
        }

        $scope.httpError = function(data, status, headers, config) {
            $scope.isWorking = false;
            promptError("Oops! Algo ha salido mal. Reintenta en un momento");
        }

        $scope.httpSuccess = function(data, status, headers, config) {
            prompt('Su calificación ha sido enviada con éxito y ahora esta a la espera de ser revisada. Puede cambiarla cuantas veces lo desee hasta que sea aprobada.');
            $scope.isWorking = false;
            $scope.userData.refreshUserDetails();
        }
    });


})();
