var routeApp = angular.module("routeApp", [
    'ui.router',
    'factoryApp',
    'launchApp'
]);

routeApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when("", "/launch");

    $stateProvider
    .state("launch", {
        url: "/launch",
        views:{
            "main":{
                templateUrl: "modules/launch/launch.html",
                controller: "launchCtrl"
            }
        }
    })
});