var loginApp = angular.module("launchApp", []);

loginApp.controller('launchCtrl', ['$scope', '$rootScope', 'launchService',
    function($scope, $rootScope, launchService ){
    	var map;
        var searchBox;
        $scope.initMapScope = function(){
            setTimeout(function(){
                initMap();
            }, 1000);
        };
        function initMap(){
            if(typeof google !== 'undefined' && typeof google === 'object' && google.maps && google.maps.Map){
                map = new google.maps.Map(document.getElementById('map'), {
                    minZoom: 2,
                    zoom: 5,
                    center: {lat: 40, lng: -90},
                    scaleControl: false,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
                var input = document.getElementById('place-search');
                searchBox = new google.maps.places.SearchBox(input);
                map.addListener('bounds_changed', function() {
                    searchBox.setBounds(map.getBounds());
                });
                searchBox.addListener('places_changed', function() {
                    palceSearched();
                });
            }
        };
        function palceSearched(){
            var places = searchBox.getPlaces();
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
            map.fitBounds(bounds);
            getPins(bounds);
        }
        function getPins(boundary){
            launchService.getPins().then(function(data){
                for(var i=0; i<data.pins.length; i++){
                    var marker = new google.maps.Marker({
                        position: {
                            lat : data.pins[i].lat,
                            lng : data.pins[i].lng
                        },
                        title: data.pins[i].description,
                        map:map
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