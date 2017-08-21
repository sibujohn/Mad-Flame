var factoryApp = angular.module("factoryApp", []);

factoryApp.service('factoryService', ['$http',
    function($http) {
        var serviceObject = {};

        serviceObject.ajaxRequests = function(url, method, data){
            return $http({
                method: method,
                url: 'https://private-f1e052-madflamesgoogle.apiary-mock.com/'+url,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: data
            });
        }

        return serviceObject;
    }
]);