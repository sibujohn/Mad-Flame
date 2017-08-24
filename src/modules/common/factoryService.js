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

factoryApp.factory('signalRHubProxy', ['$rootScope', 
    function ($rootScope) {
        function signalRHubProxyFactory(serverUrl, hubName, startOptions) {
            var connection = $.hubConnection('');
            var proxy = connection.createHubProxy(hubName);
            connection.start(startOptions).done(function () { });
            
            return {
                on: function (eventName, callback) {
                    proxy.on(eventName, function (result) {
                        $rootScope.$apply(function () {
                            if (callback) {
                                callback(result);
                            }
                        });
                    });
                },
                off: function (eventName, callback) {
                    proxy.off(eventName, function (result) {
                        $rootScope.$apply(function () {
                            if (callback) {
                                callback(result);
                            }
                        });
                    });
                },
                invoke: function (methodName, callback) {
                    proxy.invoke(methodName)
                        .done(function (result) {
                            $rootScope.$apply(function () {
                                if (callback) {
                                    callback(result);
                                }
                            });
                        });
                },
                connection: connection
            };
        };

        return signalRHubProxyFactory;    
}]);