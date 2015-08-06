angular.module('starter.controllers')
.controller('zoomImageController',['$state','$location','$rootScope','$localstorage','$scope','$log',function zoomImageController($state,$location,$rootScope,$localstorage,$scope,$log)
{
    $localstorage.set('CurrentPage',$state.current.name);
    $localstorage.set('FromPage','app/zoomimage');
    $scope.imagetoZoom = $localstorage.get('imageToZoom');
    $scope.apk = localStorage.getItem("MehndiSTARapk");
    $log.debug("apk: "+$scope.apk);
    if($scope.apk === 'true')
    {
        $log.debug("apk on zoomImageCtrl..");
        $scope.$on('$ionicView.beforeEnter', function() {
            $log.debug("analytics worked for mobile on zoomImageCtrl..");
            analytics.trackView('PostDetails_ZoomImage');
        });
    }
    else{
            $log.debug("ZoomImage screen");
            ga('send', 'pageview', {
                'page': '/ZoomImage',
                'title': 'ZoomImage'
            });
        }
    if(!$scope.imagetoZoom)
    {
        $location.path('app/home/Common/popular');
    }
    else
    {
        $rootScope.zoomImagePage = true;
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


