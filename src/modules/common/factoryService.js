var factoryApp = angular.module("factoryApp", []);

factoryApp.service('factoryService', ['$http',
    function($http) {
        var serviceObject = {};

        serviceObject.ajaxRequests = function(url, method, data){
            return $http({
                method: method,
                url: 'https://private-40b7e2-angulartestapi1.apiary-mock.com'+url,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: data
            });
        }

        return serviceObject;
    }
]);