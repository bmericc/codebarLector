(function() {
    'use strict';
    var module = angular.module('Cart', []);


    module.controller('CartController', function($scope, $http, shoppingCart, userData) {
        $scope.shoppingCart = shoppingCart;
        $scope.cantidad = 1;
        $scope.Math = window.Math;
        $scope.talle = {
            id: null,
            name: null
        };
        if ($scope.product) {
            if ($scope.product.selected_option) {
                for (var i = 0; $scope.talle.id === null && i < $scope.product.options.length; i++) {
                    if ($scope.product.options[i].id === $scope.product.selected_option) {
                        $scope.talle = $scope.product.options[i];
                    }
                }

            }
        }

        $scope.isWorking = false;
        $scope.products = [];
        $scope.isCart = true;

        $scope.formaEnvio = {};

        $scope.observaciones = "";

        $scope.tipoDeEnvio = {};
        $scope.tipoSeguro = {};
        $scope.buyOptions = {};
        $scope.sucursal_CA_options = [];
        $scope.sucursal_CA = {};

        $scope.sucursal_CA_direccion_options = [];
        $scope.sucursal_CA_direccion = {};



        $scope.metodo_ca_options = [{
            id: 4,
            name: "A Sucursal"
        }, {
            id: 5,
            name: "A Domicilio"
        }];
        $scope.metodo_ca = {};
        //---Este valor esta hardcodeado hasta que se incorpore en el webservice buy_options.json
        $scope.sucursal_options = [{
            id: "1",
            name: "Casa Central - STOCKS DE LA WEB"
        }, {
            id: "2",
            name: "Sucursal Capital - CONSULTAR STOCK"
        }];
        $scope.sucursal = {};


        $scope.selectCallback = function(pObj) {
            console.log(pObj);
            console.log($scope.talle);
        }

        $scope.getDireccionSucursalesCA = function() {
            $scope.sucursal_CA_direccion = {};
            var request = $http({
                method: "get",
                url: 'http://www.nakaoutdoors.com.ar/envios/getDireccionesCA.json?code=' + $scope.sucursal_CA.id + '&rnd=' + Math.random().toString().split('.')[1],
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            // Store the data-dump of the FORM scope.
            request.success($scope.httpGetDireccionSucursalesCASuccess);

            // Store the data-dump of the FORM scope.
            request.error($scope.httpDireccionSucursalesCAError);
        }

        $scope.httpGetDireccionSucursalesCASuccess = function(data, status, headers, config) {
            $scope.sucursal_CA_direccion_options = data.result.address;
            console.log($scope.sucursal_CA_options);
        }

        $scope.httpDireccionSucursalesCAError = function() {

            }
            //------------------------[CADORNA]


        $scope.getSucursalesCA = function(pSucursal) {
            if (pSucursal) {
                pSucursal = userData.profileData.provincia_id;
            }
            if (pSucursal) {
                var request = $http({
                    method: "get",
                    url: 'http://www.nakaoutdoors.com.ar/envios/getLocalidadesCA.json?province_id=' + pSucursal + '&rnd=' + Math.random().toString().split('.')[1],
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                // Store the data-dump of the FORM scope.
                request.success(this.httpGetSucursalesCASuccess);

                // Store the data-dump of the FORM scope.
                request.error(this.httpSucursalesCAError);
            }
        }

        $scope.httpGetSucursalesCASuccess = function(data, status, headers, config) {
            $scope.sucursal_CA_options = data.result.location;
            console.log($scope.sucursal_CA_options);
        }

        $scope.httpSucursalesCAError = function() {

        }

        $scope.addToCart = function() {
            if ($scope.product.options && !$scope.talle.id) {
                messageWindow('Debe elegir una opción');
                return;
            }
            $scope.isWorking = true;
            var request = $http({
                method: "post",
                url: 'http://www.nakaoutdoors.com.ar/articulos/carrito_add.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },

                data: '_method=POST&data[Articulo][id]=' + $scope.product.id + '&data[Articulo][cantidad]=' + $scope.cantidad + '&data[Articulo][opcion]=' + $scope.talle.id + '&data[Articulo][nombre_opcion]=' + $scope.talle.name + '&'
            });

            // Store the data-dump of the FORM scope.
            request.success(this.httpSuccess);

            // Store the data-dump of the FORM scope.
            request.error(this.httpError);
        }

        $scope.httpError = function(data, status, headers, config) {
            messageWindowError('Oops! Algo ha salido mal. Reintenta en un momento', null, 'Sin Conección', 'Bueno');
        }

        $scope.httpSuccess = function(data, status, headers, config) {
            shoppingCart.refreshCartDetails();
            $scope.products = data.result;
            $scope.isWorking = false;
            var strConfirmationText = ' ' + $scope.cantidad + ' item' + ($scope.cantidad > 1 ? 's' : '') + ' agregado' + ($scope.cantidad > 1 ? 's' : '') + ' al carrito.';
            /*            navigator.notification.confirm(
                            strConfirmationText, // message
                            $scope.onPromtAddToCartOk, // callback to invoke with index of button pressed
                            'Éxito', // title
                            ['Ver Carrito', 'Seguir'] // buttonLabels
                        );*/
            window.scrollTo(0, 0);
            ons.notification.confirm({
                buttonLabel: 'Sí',
                title: 'Información',
                animation: 'none',
                message: strConfirmationText,
                buttonLabels: ['Seguir', 'Ver Carrito'],
                callback: function(idx) {
                    switch (idx) {
                        case 0:
                            //do nothing
                            break;
                        case 1:
                            $scope.onPromtAddToCartOk(1);
                            break;
                    }
                }
            });
        }



        $scope.onPromtAddToCartOk = function(buttonIndex) {
            switch (buttonIndex) {
                case 1:
                    ons.navigator.pushPage('templates/pages/Cart.html');
                    break;
            }
            //ons.navigator.popPage();
        }

        $scope.init = function() {
            $scope.shoppingCart.refreshCartDetails();
            $scope.getBuyOptions();
            $scope.getSucursalesCA(userData.profileData.provincia_id);
        }

        $scope.completarDatosEnvio = function() {
            if (!$scope.shoppingCart.cartData.items.length) {
                messageWindow("Su carrito de compras esta vacío");
                return;
            }
            ons.navigator.pushPage('templates/forms/CartDatosEnvio.html')
        }


        $scope.enviarPedido = function() {
            if ($scope.formPedido.$invalid) {
                messageWindow("Debe completar todos los campos marcados con asterisco (*)");
                return;
            }

            if ($scope.formaEnvio.id === 5 && $scope.metodo_ca.id == null) {
                messageWindow("Debe indicar si se envía a una sucursal de correo argentino o a su domicilio");
                return;
            }

            if ($scope.formaEnvio.id === 5 && $scope.metodo_ca.id == 4 && !$scope.sucursal_CA.id) {
                messageWindow("Debe indicar a que sucursal de Correo Argentino envía su pedido");
                return;
            }

            if (!$scope.formaDePago) {
                messageWindow("Debe indicar el tipo de pago");
                return;
            }


            $scope.isWorking = true;
            var request = $http({
                method: "post",
                url: 'http://www.nakaoutdoors.com.ar/pedidos/carrito_index.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'data[Pedido][nombre]=' + userData.profileData.nombre +
                    '&data[Pedido][apellido]=' + userData.profileData.apellido +
                    '&data[Pedido][mail]=' + userData.profileData.mail +
                    '&data[Pedido][cod_area]=' + userData.profileData.cod_area +
                    '&data[Pedido][celular]=' + userData.profileData.celular +

                    '&data[Pedido][tipo_seguro]=' + $scope.tipoSeguro.id +
                    '&data[Pedido][forma_envio]=' + $scope.formaEnvio.id +

                    /*data[Pedido][envioa] => [ 1 si es OCA a domicilio / 2 si es OCA a sucursal ]
                    data['Pedido'][envio_prioridad] => [ 1 si es OCA envio normal / 2 si es OCA prioritario ]*/


                    '&data[Pedido][metodo_ca]=' + $scope.metodo_ca.id +
                    '&data[Pedido][provincia_ca_id]=' + userData.profileData.provincia_id +
                    '&data[Pedido][sucursal_ca]=' + $scope.sucursal_CA.id +
                    '&data[Pedido][dni]=' + userData.profileData.DNI +

                    '&data[Pedido][sucursal]=' + $scope.sucursal.id +
                    '&data[Pedido][dni]=' + $scope.userData.profileData.DNI +
                    '&data[Pedido][direccion]=' + userData.profileData.direccion +
                    '&data[Pedido][terminal]=' + userData.profileData.terminal +
                    '&data[Pedido][codigo_postal]=' + userData.profileData.codigo_postal +
                    '&data[Pedido][provincia_id]=' + userData.profileData.provincia_id +
                    '&data[Pedido][forma_pago]=' + $scope.formaDePago +
                    '&data[Pedido][telefono]=' + userData.profileData.telefono +
                    '&data[Pedido][observaciones]=' + $scope.observaciones +
                    '&data[Pedido][iva_facturacion]=' + userData.profileData.iva_facturacion +
                    '&data[Pedido][razon_social]=' + userData.profileData.razon_social +
                    '&data[Pedido][cuit]=' + userData.profileData.cuit + '&'
            });



            // Store the data-dump of the FORM scope.
            request.success(this.httpEnviarPedidoSuccess);


            // Store the data-dump of the FORM scope.
            request.error(this.httpEnviarPedidoError);

        }

        $scope.httpEnviarPedidoError = function(data, status, headers, config) {
            messageWindowError('Oops! Algo ha salido mal. Reintenta en un momento', null, 'Sin Conección', 'Bueno');
        }

        $scope.httpEnviarPedidoSuccess = function(data, status, headers, config) {
            messageWindow('Su pedido ha sido enviado con éxito.', goBackOnePage);
            $scope.shoppingCart.refreshCartDetails();
            $scope.isWorking = false;
        }

        $scope.eliminarDelCarrito = function(id) {
            $scope.isWorking = true;
            var request = $http({
                method: "get",
                url: 'http://www.nakaoutdoors.com.ar/articulos/carrito_del.json?rnd=' + Math.random().toString().split('.')[1] + '&id=' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            // Store the data-dump of the FORM scope.
            request.success(this.httpEliminarDelCarritoSuccess);


            // Store the data-dump of the FORM scope.
            request.error(this.httpEliminarDelCarritoError);
        }

        $scope.httpEliminarDelCarritoError = function(data, status, headers, config) {
            messageWindowError('Oops! Algo ha salido mal. Reintenta en un momento', null, 'Sin Conección');
            $scope.isWorking = false;
        }

        $scope.httpEliminarDelCarritoSuccess = function(data, status, headers, config) {
            messageWindow('Item eliminado.', null, 'Éxito');
            $scope.shoppingCart.refreshCartDetails();
            $scope.isWorking = false;
        }

        $scope.quantityIncrement = function() {
            $scope.cantidad++;
        }
        $scope.quantityDecrement = function() {
            $scope.cantidad--;
            $scope.cantidad = $scope.cantidad < 1 ? 1 : $scope.cantidad;
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
            $scope.buyOptions.sucursal_options = $scope.sucursal_options;
        }

        $scope.httpGetBuyOptiondError = function() {

        }

    });
})();
