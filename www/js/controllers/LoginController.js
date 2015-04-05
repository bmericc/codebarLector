(function() {
    'use strict';
    var module = angular.module('Login', []);


    module.controller('LoginController', function($scope, $http, userData) {
        $scope.userData = userData;
        $scope.isWorking = false;
        $scope.editMode = false;
        $scope.buyOptions = {};
        $scope.shouldAskForConfirmationBeforeLeave = false;

        $scope.login = function() {
            if ($scope.isWorking) return;
            if (!$scope.userData.userName) {
                messageWindowError('La dirección de mail no es válida');
                return;
            }
            $scope.isWorking = true;

            var request = $http({
                method: "post",
                url: 'http://www.nakaoutdoors.com.ar/usuarios/applogin.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },

                data: '_method=POST&data[Login][login]=' + $scope.userData.userName + '&data[Login][password]=' + $scope.userData.password + '&',
            });


            // Store the data-dump of the FORM scope.
            request.success(this.httpSuccess);


            // Store the data-dump of the FORM scope.
            request.error(this.httpError);

        }

        $scope.httpError = function(data, status, headers, config) {
            $scope.isWorking = false;
            messageWindowError("Oops! Algo ha salido mal. Reintenta en un momento");
        }

        $scope.httpSuccess = function(data, status, headers, config) {
            $scope.isWorking = false;
            if (data.result.logedIn === 1) {
                window.localStorage.setItem("user", $scope.userData.userName);
                window.localStorage.setItem("password", $scope.userData.password);
                window.localStorage.setItem("logedIn", true);
                $scope.userData.check_password = $scope.userData.password;
                $scope.userData.profileData = data.result.Usuario;
                $scope.userData.profileData.provincia_id = parseInt($scope.userData.profileData.provincia_id);
                $scope.userData.profileData.iva_facturacion = parseInt($scope.userData.profileData.iva_facturacion);
                window.localStorage.setItem("profileData", JSON.stringify(data.result.Usuario));
                $scope.userData.logedIn = true;
                ons.navigator.resetToPage('templates/pages/PageHome.html');
            } else if (data.result.logedIn === -2) {
                messageWindowError('Nombre de usuario o contraseña inválidas');
                $scope.logout(false);
            }
        }



        $scope.init = function() {
            if (ons.navigator.getCurrentPage().name === 'templates/forms/FormProfile.html') {
                $scope.userData.refreshUserDetails();
                ons.navigator.on('prepop', $scope.onPrePop)
                    //$scope.userData = ons.navigator.getCurrentPage().options.userData; 
                return;
            }
            if ($scope.userData.logedIn === true) {
                ons.navigator.resetToPage('templates/forms/FormProfile.html');
            } else {
                $scope.userData.userName = window.localStorage.getItem('user');
                $scope.userData.password = window.localStorage.getItem('password');
                $scope.userData.check_password = window.localStorage.getItem('password');
            }

        }



        $scope.onPrePop = function(event) {
            if ($scope.editMode && ons.navigator.getCurrentPage().name === 'templates/forms/FormProfile.html') {
                if ($scope.shouldAskForConfirmationBeforeLeave) {
                    $scope.shouldAskForConfirmationBeforeLeave = false;
                    return;
                }
                ons.notification.confirm({
                    buttonLabel: 'Sí',
                    title: 'Atención!',
                    message: '¿Desea salir sin guardar los cambios?',
                    callback: function(idx) {
                        switch (idx) {
                            case 0:
                                //do nothing
                                break;
                            case 1:
                                $scope.onPrePopConfirm(1);
                                break;
                        }
                    }
                });
                event.cancel();
            }
        }




        $scope.onPrePopConfirm = function(buttonIndex) {
            if (buttonIndex == 1) {
                $scope.shouldAskForConfirmationBeforeLeave = true;
                ons.navigator.popPage();
                $scope.editMode = false;
            }
        }

        $scope.getBuyOptions = function() {
            var request = $http({
                method: "get",
                url: 'http://www.nakaoutdoors.com.ar/pedidos/buy_options.json',
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
        }

        $scope.httpGetBuyOptiondError = function() {

        }

        $scope.logout = function(pConfirm) {
            if (pConfirm) {
                ons.notification.confirm({
                    buttonLabel: 'Sí',
                    title: 'Información',
                    message: '¿Desea Salir?',
                    callback: function(idx) {
                        switch (idx) {
                            case 0:
                                //do nothing
                                break;
                            case 1:
                                $scope.onConfirm(1);
                                break;
                        }
                    }
                });
            } else {
                $scope.onConfirm(1);
            }

        }

        $scope.askCallSoporte = function(cod_sucursal) {
            try {
                ons.notification.confirm({
                    buttonLabel: 'Sí',
                    title: 'Contacto',
                    message: '¿Desea llamar a soporte?',
                    callback: function(idx) {
                        switch (idx) {
                            case 0:
                                //do nothing
                                break;
                            case 1:
                                $scope.onConfirm(1);
                                break;
                        }
                    }
                });
            } catch (e) {
                console.log(e);
                //alert(e);
            }
        }

        $scope.onConfirm = function(buttonIndex) {
            if (buttonIndex == 1) {
                $scope.isWorking = true;
                userData.logout($scope.logoutSuccess, $scope.logoutError);
            }
        }

        $scope.logoutError = function(data, status, headers, config) {
            $scope.isWorking = false;
            console.log("Oops! Algo ha salido mal. Reintenta en un momento");
        }

        $scope.logoutSuccess = function(data, status, headers, config) {
            $scope.isWorking = false;
            $scope.userData.reset();
        }

        $scope.editProfile = function() {
            $scope.shouldAskForConfirmationBeforeLeave = false;
            $scope.editMode = true;
            $scope.getBuyOptions();
        }

        $scope.saveProfile = function() {
            if ($scope.isWorking) return;
            $scope.shouldAskForConfirmationBeforeLeave = true;
            if ($scope.formUser.$invalid) {
                messageWindow("Debe completar todos los obligatorios");
                return;
            }

            if (userData.check_password != userData.password) {
                userData.check_password = "";
                messageWindow("Las contraseñas no coinciden");
                return;
            }
            $scope.isWorking = true;
            var request = $http({
                method: "post",
                url: 'http://www.nakaoutdoors.com.ar/client/usuarios/edit.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },

                data: '_method=POST&data[Usuario][nombre]=' + userData.profileData.nombre + '&data[Usuario][apellido]=' + userData.profileData.apellido + '&data[Usuario][mail]=' + userData.profileData.mail + '&data[Usuario][cod_area]=' + userData.profileData.cod_area + '&data[Usuario][celular]=' + userData.profileData.celular + '&data[Usuario][direccion]=' + userData.profileData.direccion + '&data[Usuario][terminal]=' + userData.profileData.terminal + '&data[Usuario][codigo_postal]=' + userData.profileData.codigo_postal + '&data[Usuario][provincia_id]=' + userData.profileData.provincia_id + '&data[Usuario][telefono]=' + userData.profileData.telefono + '&data[Usuario][iva_facturacion]=' + userData.profileData.iva_facturacion + '&data[Usuario][razon_social]=' + userData.profileData.razon_social + '&data[Usuario][cuit]=' + userData.profileData.cuit + '&data[Usuario][localidad]=' + userData.profileData.localidad + '&data[Usuario][partido]=' + userData.profileData.partido + '&data[Usuario][dir_facturacion]=' + userData.profileData.dir_facturacion + '&data[Usuario][nombre_fantasia]=' + userData.profileData.nombre_fantasia + '&data[Usuario][imagen]=' + userData.profileData.imagen + '&data[Usuario][perfil]=' + userData.profileData.perfil + '&data[Usuario][password]=' + userData.password + '&data[Usuario][check_password]=' + userData.check_password + '&data[Usuario][login]=' + userData.userName

            });


            // Store the data-dump of the FORM scope.
            request.success($scope.httpSaveProfileSuccess);


            // Store the data-dump of the FORM scope.
            request.error($scope.httpSaveProfileError);

            //http://www.nakaoutdoors.com.ar/client/usuarios/edit.json
        }

        $scope.httpSaveProfileError = function(data, status, headers, config) {
            $scope.isWorking = false;
            messageWindowError('Oops! Algo ha salido mal. Reintenta en un momento', null, 'Sin Conección', 'Bueno');
        }

        $scope.httpSaveProfileSuccess = function(data, status, headers, config) {
                $scope.isWorking = false;
                if(data.result)
                {
                    if(data.result.code == 9)
                    {
                        messageWindowError(data.result.messagge);
                        return;
                    }

                }
                $scope.editMode = false;
                window.localStorage.setItem('user', userData.userName);
                window.localStorage.setItem('password', userData.password);
                $scope.userData.refreshUserDetails();
            }
            // Upload image to server
        $scope.onCameraSuccess = function(pImageData) {
            var request = $http({
                method: "post",
                url: 'http://www.nakaoutdoors.com.ar/client/usuarios/edit.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },

                data: '_method=POST&data[Usuario][nombre]=' + userData.profileData.nombre + '&data[Usuario][apellido]=' + userData.profileData.apellido + '&data[Usuario][mail]=' + userData.profileData.mail + '&data[Usuario][cod_area]=' + userData.profileData.cod_area + '&data[Usuario][celular]=' + userData.profileData.celular + '&data[Usuario][direccion]=' + userData.profileData.direccion + '&data[Usuario][terminal]=' + userData.profileData.terminal + '&data[Usuario][codigo_postal]=' + userData.profileData.codigo_postal + '&data[Usuario][provincia_id]=' + userData.profileData.provincia_id + '&data[Usuario][telefono]=' + userData.profileData.telefono + '&data[Usuario][iva_facturacion]=' + userData.profileData.iva_facturacion + '&data[Usuario][razon_social]=' + userData.profileData.razon_social + '&data[Usuario][cuit]=' + userData.profileData.cuit + '&data[Usuario][localidad]=' + userData.profileData.localidad + '&data[Usuario][partido]=' + userData.profileData.partido + '&data[Usuario][dir_facturacion]=' + userData.profileData.dir_facturacion + '&data[Usuario][nombre_fantasia]=' + userData.profileData.nombre_fantasia + '&data[Usuario][imagen]=' + pImageData + '&data[Usuario][perfil]=' + userData.profileData.perfil + '&'

            });

            // Store the data-dump of the FORM scope.
            request.success($scope.httpSaveProfileSuccess);


            // Store the data-dump of the FORM scope.
            request.error($scope.httpSaveProfileError);

        }

        $scope.onCameraFail = function(pMessage) {
            $scope.isWorking = false;
            messageWindowError("Error al subir imagen: " + pMessage);
        }

        // Take a picture using the camera or select one from the library
        $scope.takePicture = function(e) {
            if ($scope.isWorking) return;
            $scope.isWorking = ture;
            navigator.camera.getPicture($scope.onCameraSuccess, $scope.onCameraFail, {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL
            });
        }

        $scope.getPictureFromGallery = function() {
            $scope.isWorking = true;
            // Retrieve image file location from specified source
            navigator.camera.getPicture($scope.uploadPhoto, function(message) {
                messageWindowError('Error al obtener la imagen');
                $scope.isWorking = false;
            }, {
                quality: 50,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY

            });

        }

        $scope.pictureFromGalleryInformation = function(pImageUri) {
            messageWindow(pImageUri);
        }

        $scope.uploadPhoto = function(imageURI) {
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
            options.mimeType = "image/png";

            var params = new Object();
            params.value1 = "test";
            params.value2 = "param";
            options.params = params;

            var ft = new FileTransfer();
            ft.upload(imageURI, "http://www.nakaoutdoors.com.ar/usuarios/upload_avatar.json", $scope.win, $scope.fail, options);
        }

        $scope.win = function(r) {
            messageWindow("Code = " + r.responseCode);
            messageWindow("Response = " + r.response);
            messageWindow("Sent = " + r.bytesSent);
            $scope.isWorking = false;
        }

        $scope.fail = function(error) {
            messageWindowError("An error has occurred: Code = " + error.code);
            $scope.isWorking = false;
        }




    });

    module.directive('profileEdit', function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/modules/profile/profileEdit.html'
        };
    });

    module.directive('profileRead', function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/modules/profile/profileRead.html'
        };
    });

})();
