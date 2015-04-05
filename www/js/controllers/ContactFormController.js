(function() {
    'use strict';
    var module = angular.module('ContactForm', []);
    module.controller('ContactFormController', function($scope, $http, userData) {

        if (userData.profileData) {
            $scope.nombre = userData.profileData.login;
            $scope.email = userData.profileData.mail;
            $scope.telefono = userData.profileData.celular;
            $scope.ubicacion = userData.profileData.provincia;
        } else if (userData.lastProfileData) {
            $scope.nombre = userData.lastProfileData.login;
            $scope.email = userData.lastProfileData.mail;
            $scope.telefono = userData.lastProfileData.celular;
            $scope.ubicacion = userData.lastProfileData.provincia;
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
                url: 'http://www.nakaoutdoors.com.ar/contactos.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: '_method=POST&data[Contacto][nombre]=' + $scope.nombre + '&data[Contacto][liam]=' + $scope.email + '&data[Contacto][telefono]=' + $scope.telefono + '&data[Contacto][ubicacion]=' + $scope.ubicacion + '&data[Contacto][consulta]=' + $scope.consulta + '&data[Contacto][mail]=' + hashMail + '&data[Contacto][maps]=&' + '&data[Contacto][ant]=' + hashAnt + '&data[Contacto][url]=contactos&',
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

        $scope.submitContact = function() {
            if ($scope.formContact.$invalid) {
                prompt("Debe completar todos los campos.");
                return;
            }

            $scope.getHash();
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
            alert("Ooosp!, algo ha salido mal, reintente en un momento");
            $scope.isWorking = false;
        }

        $scope.httpSuccess = function(data, status, headers, config) {
            messageWindow('Su consulta ha sido enviada con éxito');
            ons.navigator.popPage();
        }
    });

    module.controller('ContactController', function($scope) {
        $scope.cods_sucursal = {
            VICENTE_LOPEZ: 0,
            CAPITAL: 1
        };

        $scope.askCallSucursal = function(cod_sucursal) {
            $scope.cod_sucursal = cod_sucursal;
            try {

                ons.notification.confirm({
                    title: 'Contacto',
                    buttonLabels: ['Llamar ahora', 'Tal vez mas tarde'],
                    message: '¿Desea llamar a la sucursal?',
                    callback: function(idx) {
                        switch (idx) {
                            case 0:
                                $scope.onConfirm(1)
                                break;
                            case 1:
                                //do nothing
                                break;
                        }
                    }
                });
            } catch (e) {
                alert(e);
            }
        }

        $scope.onConfirm = function(buttonIndex) {
            if (buttonIndex == 1) {
                $scope.callSucursal();
            }
        }


        $scope.callSucursal = function() {
            switch ($scope.cod_sucursal) {
                case this.cods_sucursal.VICENTE_LOPEZ:
                    phonedialer.dial(
                        "01147979435",
                        function(err) {
                            if (err == "empty") alert("Unknown phone number");
                            else alert("Dialer Error:" + err);
                        },
                        function(success) {
                            //alert('Dialing succeeded');
                        }
                    );
                    break;
                case this.cods_sucursal.CAPITAL:
                    phonedialer.dial(
                        "45462853",
                        function(err) {
                            if (err == "empty") alert("Unknown phone number");
                            else alert("Dialer Error:" + err);
                        },
                        function(success) {
                            //alert('Dialing succeeded');
                        }
                    );
                    break;
            }
        }
        $scope.emailSucursal = function(cod_sucursal) {
            switch (cod_sucursal) {
                case this.cods_sucursal.VICENTE_LOPEZ:
                    var link = "mailto:info@nakaoutdoors.com.ar" + "?subject=" + escape("Consulta") + "&body=" + escape("Estimados Naka Outdoors:\n");
                    window.open(link, 'silentFrame');
                    break;
                case this.cods_sucursal.CAPITAL:
                    var link = "mailto:urquiza@nakaoutdoors.com.ar" + "?subject=" + escape("Consulta") + "&body=" + escape("Estimados Naka Outdoors:\n");
                    window.open(link, 'silentFrame');
                    break;
            }
        }



    });
})();
