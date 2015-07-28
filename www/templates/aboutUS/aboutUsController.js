angular.module('starter.controllers')
.controller('aboutUsCtrl', ['$scope','$log','feedBackService', function aboutUsCtrl($scope,$log) {  
           angular.element(document.querySelector("#tabHome")).removeClass("active");
           angular.element(document.querySelector("#tabSearch")).removeClass("active");
           angular.element(document.querySelector("#tabMyprofile")).removeClass("active");
           angular.element(document.querySelector("#tabCamera")).removeClass("active");
           angular.element(document.querySelector("#tabUpload")).removeClass("active");
           $log.debug("apk: "+$scope.apk);
           
            if($scope.apk === 'true')
            {
                $log.debug("apk on aboutus..");
                $scope.$on('$ionicView.beforeEnter', function() {
                    $log.debug("analytics worked for mobile on aboutus..");
                    analytics.trackView('aboutus');
                });
            }    
}]);


