var loginApp = angular.module("launchApp", []);

loginApp.controller('launchCtrl', ['$scope', '$rootScope', 'launchService',
    function($scope, $rootScope, launchService ){
    	$scope.map;
        $scope.searchBox;
        $scope.initMapScope = function(){
            setTimeout(function(){
                initMap();
            }, 1000);
        };
        function initMap(){
            if(typeof google !== 'undefined' && typeof google === 'object' && google.maps && google.maps.Map){
                $scope.map = new google.maps.Map(document.getElementById('map'), {
                    minZoom: 2,
                    zoom: 5,
                    center: {lat: 40, lng: -90},
                    scaleControl: false,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
                if(typeof $scope.map === 'object'){
                    bindIdleEventOfMap();
                    initSearchBoxFunction();
                }
            }
        };
        function initSearchBoxFunction(){
            var input = document.getElementById('place-search');
            $scope.searchBox = new google.maps.places.SearchBox(input);
            $scope.map.addListener('bounds_changed', function() {
                $scope.searchBox.setBounds($scope.map.getBounds());
            });
            $scope.searchBox.addListener('places_changed', function() {
                placeSearched();
            });
        };
        function bindIdleEventOfMap () {
            google.maps.event.addListener($scope.map, 'idle', function() {
                sendMapBounds();
            });
        };
        function placeSearched(){
            var places = $scope.searchBox.getPlaces();
            if (places.length == 0) {
                return;
            }
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                if (place.geometry.viewport) {
                // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            $scope.map.fitBounds(bounds);
        };
        function sendMapBounds(){
            var mapBounds = $scope.map.getBounds();
            var bounds = {
                MinLat:mapBounds.getSouthWest().lat(),
                MaxLat:mapBounds.getNorthEast().lat(),
                MinLng:mapBounds.getSouthWest().lng(),
                MaxLng:mapBounds.getNorthEast().lng()
            }
            launchService.sendMapBounds(bounds)
            .then(function(){
                getPins();
            });
        };
        function getPins(){
            launchService.getPins().then(function(data){
                for(var i=0; i<data.pins.length; i++){
                    var marker = new google.maps.Marker({
                        position: {
                            lat : data.pins[i].lat,
                            lng : data.pins[i].lng
                        },
                        title: data.pins[i].description,
                        map:$scope.map
                    });
                }
            });
        };
    }
]);


loginApp.service('launchService', ['factoryService', '$q',
    function(factoryService, $q) {
        var serviceObject = {};
        serviceObject.serviceUrl = "launch/";

        serviceObject.sendMapBounds = function(data){
            var def = $q.defer();
            factoryService.ajaxRequests(serviceObject.serviceUrl+"sendBounds ", "POST", data).then(function(response) {
                def.resolve(response.data);
            });            
            return def.promise;
        };
        serviceObject.getPins = function(data){
            var def = $q.defer();
            factoryService.ajaxRequests(serviceObject.serviceUrl+"getPins", "GET", data).then(function(response) {
                def.resolve(response.data);
            });            
            return def.promise;
        };
        return serviceObject;
    }
]);