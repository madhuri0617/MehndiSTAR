angular.module('starter.controllers')
.controller('zoomImageController',['$location','$rootScope','$localstorage','$scope','$log',function zoomImageController($location,$rootScope,$localstorage,$scope,$log)
{
    $scope.imagetoZoom = $localstorage.get('imageToZoom');
    $scope.apk = localStorage.getItem("MehndiSTARapk");
    $log.debug("apk: "+$scope.apk);
    if($scope.apk === 'true')
    {
        $log.debug("apk on zoomImageCtrl..");
        $scope.$on('$ionicView.beforeEnter', function() {
            $log.debug("analytics worked for mobile on zoomImageCtrl..");
            analytics.trackView('ZoomImage');
        });
    }
    else{
            $log.debug("ZoomImage screen");
            ga('send', 'screenview', {'screenName': 'ZoomImage'});
        }
    if(!$scope.imagetoZoom)
    {
        $location.path('app/home/Common/popular');
    }
    else
    {
        $rootScope.zoomImagePage = true;
        $localstorage.set('FromPage','app/zoomImage');
    //  $localstorage.set('zoomImagePage',true)
    //  $rootScope.zoomImagePage = $localstorage.get('zoomImagePage');
        $log.debug("$rootScope.zoomImagePage"+$rootScope.zoomImagePage);
        $log.debug("inside zoomImageController"); 
    //  alert($rootScope.imageToZoom);
        $('#img').attr('src',  $localstorage.get('imageToZoom'));
        function wlCommonInit(){
             $(".panzoom-elements").panzoom({ });
        }
        wlCommonInit();
    }
}]);


