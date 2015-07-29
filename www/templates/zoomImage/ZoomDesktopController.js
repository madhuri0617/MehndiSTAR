angular.module('starter.controllers')
.directive('ngMouseWheelUp', function() {
        return function(scope, element, attrs) {
            element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {
                   
            	        // cross-browser wheel delta
            	        var event = window.event || event; // old IE support
            	        var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
            	
            	        if(delta > 0) {
                            scope.$apply(function(){
                                scope.$eval(attrs.ngMouseWheelUp);
                            });
                        
                          // for IE
                          event.returnValue = false;
                          // for Chrome and Firefox
                          if(event.preventDefault) event.preventDefault();                        
                       }
            });
        };
})
.directive('ngMouseWheelDown', function() {
        return function(scope, element, attrs) {
            element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {
                   
            	        // cross-browser wheel delta
            	        var event = window.event || event; // old IE support
            	        var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
            	
            	        if(delta < 0) {
                            scope.$apply(function(){
                                scope.$eval(attrs.ngMouseWheelDown);
                            });

                          // for IE
                          event.returnValue = false;
                          // for Chrome and Firefox
                          if(event.preventDefault) event.preventDefault();                        
                       }
            });
        };
})

.controller('ZoomDesktopController',['$location','$ionicPopup','$rootScope','$localstorage','$scope','$log',function ZoomDesktopController($location,$ionicPopup,$rootScope,$localstorage,$scope,$log)
{
    $localstorage.set('FromPage','app/zoomDesktop');
    $scope.imagetoZoom = $localstorage.get('imageToZoom');
    $scope.apk = localStorage.getItem("MehndiSTARapk");
    $log.debug("apk: "+$scope.apk);
    if($scope.apk === 'true')
    {
        $log.debug("apk on zoomDesktopCtrl..");
        $scope.$on('$ionicView.beforeEnter', function() {
            $log.debug("analytics worked for mobile on zoomDesktopCtrl..");
            analytics.trackView('PostDetails_ZoomImage');
        });
    }
    else{
            $log.debug("ZoomDesktop screen");
            ga('send', 'pageview', {
                'page': '/ZoomDesktop',
                'title': 'ZoomDesktop'
            });
        }
    if(!$scope.imagetoZoom)
    {
        $location.path('app/home/Common/popular');
    }
    else
    {
        if(navigator.userAgent.match(/Firefox/i)){
            var alertPopup = $ionicPopup.alert({
                    title: "Zoom",
                    content: "Use Ctrl + Mouse Wheel to zoom on Firefox.",
                    okType: ' button-upload' 
                });
                alertPopup.then(function(result) {         
    //                    ionic.Platform.exitApp();          
            });
        }
        $rootScope.zoomImagePage = true;
    //  $localstorage.set('zoomImagePage',true)
    //  $rootScope.zoomImagePage = $localstorage.get('zoomImagePage');
        $log.debug("$rootScope.zoomImagePage"+$rootScope.zoomImagePage);                
        $log.debug("inside zoomDesktopController "+$rootScope.controlzoom ); 
    //  alert($rootScope.imageToZoom);
        $('#img').attr('src',  $localstorage.get('imageToZoom'));
        $scope.initZoom = function()
        {
            $scope.zoomWidth = 600;
            $scope.imgStyle = {width:'600px'};
        };
        $scope.zoomDown = function()
        {
            if($scope.zoomWidth>600)
            {
            $scope.zoomWidth = $scope.zoomWidth - 20;
            }
            else
            {
               $scope.zoomWidth = 600; 
            }
            $scope.imgStyle.width = $scope.zoomWidth  +'px';
        };
        $scope.zoomUp  = function()
        {
            $scope.zoomWidth = $scope.zoomWidth + 20; 
            $scope.imgStyle.width = $scope.zoomWidth +'px'; 
        }; 
    }
}]);

