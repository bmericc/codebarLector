(function() {
    'use strict';
    var module = angular.module('GenericSelect', []);

    module.controller('GenericSelectController', function($scope, $http) {
    	$scope.genericSelectOptions = [];
		$scope.genericSelectReturnVariable = null;
    	$scope.init = function(pOptions, pReturnVariable)
    	{
    		$scope.genericSelectOptions = pOptions;
    		$scope.genericSelectReturnVariable = pReturnVariable;
    	}

    	$scope.clichHandler = function()
    	{

    	}
    });

})();
