var loginApp = angular.module("launchApp", []);

loginApp.controller('launchCtrl', ['$scope', '$rootScope', 'launchService',
    function($scope, $rootScope, launchService ){
    	var map;
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
                var searchBox = new google.maps.places.SearchBox(input);
                map.addListener('bounds_changed', function() {
                    searchBox.setBounds(map.getBounds());
                });
                searchBox.addListener('places_changed', function() {
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
                });
            }
        };
    }
]);


loginApp.service('launchService', ['factoryService', '$state',
    function(factoryService, $state) {
        var serviceObject = {};

        return serviceObject;
    }
]);