/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


angular.module('starter.controllers')
.controller('FeedbackCtrl', ['$scope','$ionicLoading','$ionicPopup','$localstorage','$log','feedBackService', function FeedbackCtrl($scope,$ionicLoading,$ionicPopup,$localstorage,$log,feedBackService) {  
        $log.debug("inside feedback controller");
        $scope.apk = localStorage.getItem("MehndiSTARapk");
        $log.debug("apk: "+$scope.apk);
        if($scope.apk === 'true')
        {
            $log.debug("apk on FeedbackCtrl..");
            $scope.$on('$ionicView.beforeEnter', function() {
                $log.debug("analytics worked for mobile on FeedbackCtrl..");
                analytics.trackView('Feedback');
            });
        }
        else{
            $log.debug("feedback screen");
            ga('send', 'screenview', {'screenName': 'feedback'});
        }
           $scope.vr = {};
        $scope.loadingWheel = function() {
            $ionicLoading.show({
                template: '<ion-spinner icon="circles"/>'
            });
        };
        $scope.uploadPopup = function() {
        var alertPopup = $ionicPopup.alert({
          title: 'Success',
          template: 'Thank You! Your feedback has been submitted.',
          okType: ' button-upload'
        });
        alertPopup.then(function(res) {
            $scope.fileUpload = "";
            //alert($scope.fileUpload);
        });
      };
      $scope.errorPopup = function(msg) {
        $ionicPopup.alert({
          title: 'Error',
          template: msg,
          okType: ' button-upload' 
        });
    };
        if($localstorage.get('sessionMyName')){
            $scope.vr.MyName = $localstorage.get('sessionMyName');
        }
//        $scope.MyName = $localstorage.get('sessionMyName');
        if($localstorage.get('sessionMyemail')){
            $scope.vr.MyEmail = $localstorage.get('sessionMyemail');
        }
//        $log.debug($scope.MyName);
//        $log.debug($scope.MyEmail);
//        if(!$scope.MyName)
//            $scope.MyName = "";
//        if(!$scope.MyEmail)
//            $scope.MyEmail = "";
        $scope.invalid = function()
        {
            
        };
        $scope.submitForm = function()
        {

        $scope.loadingWheel();
            $log.debug("inside submit");
            $log.debug("name *"+$scope.vr.MyName );
            $log.debug("email",$scope.vr.MyEmail);
            
            $log.debug("comments",$scope.vr.Comments);
            $scope.textmail = {
                name: $scope.vr.MyName ,
                email: $scope.vr.MyEmail,
                comments: $scope.vr.Comments
            };
            feedBackService.submitFeedback($scope.textmail).then(function (response) {
                        $log.debug(response.data.success);
                        if(response.data.success === "true")
                        {
                            $scope.uploadPopup();
                            $scope.loadingLike = false;
                            $ionicLoading.hide();
                        }
                        else
                        {
                            $scope.msg = "Unable to submit your feedback. Please try again later.";
                            $scope.errorPopup(msg);
                            $scope.loading = false;
                            $ionicLoading.hide();
                        }
                    },
                    function (error) {
                           $scope.msg = "Oops! Something went wrong. Our team will look into this issue.";
                           $scope.errorPopup($scope.msg);
                           $scope.loading = false;
                           $ionicLoading.hide();                      
                            $log.debug("error in feedback", error);
                    });
        };
}]);