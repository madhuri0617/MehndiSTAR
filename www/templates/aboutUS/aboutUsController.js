angular.module('starter.controllers')
.controller('aboutUsCtrl', ['$state','$scope','$log','$localstorage', function aboutUsCtrl($state,$scope,$log,$localstorage) {  
           angular.element(document.querySelector("#tabHome")).removeClass("active");
           angular.element(document.querySelector("#tabSearch")).removeClass("active");
           angular.element(document.querySelector("#tabMyprofile")).removeClass("active");
           angular.element(document.querySelector("#tabCamera")).removeClass("active");
           angular.element(document.querySelector("#tabUpload")).removeClass("active");
           $log.debug("apk: "+$scope.apk);
           $localstorage.set('CurrentPage',$state.current.name);
           $localstorage.set('FromPage','app/aboutus');
            if($scope.apk === 'true')
            {
                $log.debug("apk on aboutus..");
                $scope.$on('$ionicView.beforeEnter', function() {
                    $log.debug("analytics worked for mobile on aboutus..");
                    analytics.trackView('AboutUs');
                });
            }
            else{
                $log.debug("AboutUS screen");
            ga('send', 'pageview', {
                'page': '/AboutUS',
                'title': 'AboutUS'
            });
             }
}]);


