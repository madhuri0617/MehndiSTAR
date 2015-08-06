angular.module('starter.controllers')
.controller('CameraCtrl', ['$timeout','$state','$location','$cordovaCamera', '$scope','$rootScope','cameraUploadService','$ionicScrollDelegate','$ionicLoading','$ionicPopup','$localstorage','$log', function CameraCtr($timeout,$state,$location,$cordovaCamera, $scope,$rootScope,cameraUploadService,$ionicScrollDelegate,$ionicLoading,$ionicPopup,$localstorage,$log) {
    $scope.apk = localStorage.getItem("MehndiSTARapk");
        $log.debug("apk: "+$scope.apk);
        if($scope.apk === 'true')
        {
            $log.debug("apk on CameraCtrl..");
            $scope.$on('$ionicView.beforeEnter', function() {
                $log.debug("analytics worked for mobile on CameraCtrl..");
                analytics.trackView('CameraUpload');
            });
        }
        else{
            $log.debug("CameraUpload screen");
            ga('send', 'pageview', {
                'page': '/CameraUpload',
                'title': 'CameraUpload'
            });
        }
    $scope.loginPopup = function() {
        var alertPopup = $ionicPopup.alert({
          title: 'Login',
          //template: 'Are you sure you want to delete this Post?',
          templateUrl:'PopUps/LoginPopUp.html',
          cssClass: '', // String, The custom CSS class name
          cancelText: '', // String (default: 'Cancel'). The text of the Cancel button.
          cancelType: '',//'button button-small button-default', // String (default: 'button-default'). The type of the Cancel button.
          okText: '', // String (default: 'OK'). The text of the OK button.
          okType: ' button-upload' // String (default: 'button-positive'). The type of the OK button.
        });
        alertPopup.then(function(res) {
          if(res) {
            $log.debug('You are sure');
            angular.element(document.querySelector("#tabMyprofile")).addClass("active");
            angular.element(document.querySelector("#tabUpload")).removeClass("active");
            angular.element(document.querySelector("#tabCamera")).removeClass("active");
            angular.element(document.querySelector("#tabSearch")).removeClass("active");
            angular.element(document.querySelector("#tabHome")).removeClass("active");
            $location.path('app/login');

          } else {
            $log.debug('You are not sure');
          }
        });
    };
    $localstorage.set('CurrentPage',$state.current.name);
    $localstorage.set('FromPage','app/camera');
    $scope.MyID=$localstorage.get('sessionMyID');
    if(!$scope.MyID)
    {
        $scope.loginPopup();
//        angular.element(document.querySelector("#tabHome")).removeClass("active");
    }            
                            
    function setTabClass() {
        angular.element(document.querySelector("#tabCamera")).removeClass("active");
        angular.element(document.querySelector("#tabMyprofile")).addClass("active");
    };
    angular.element(document.querySelector("#tabSearch")).removeClass("active");
    angular.element(document.querySelector("#tabHome")).removeClass("active");
    angular.element(document.querySelector("#tabMyprofile")).removeClass("active");
    angular.element(document.querySelector("#tabUpload")).removeClass("active");
    angular.element(document.querySelector("#tabCamera")).addClass("active");
    $scope.form={};
    $scope.loading = true;
    $localstorage.set('CurrentPage',$state.current.name);
    $localstorage.set('FromPage','app/camera');
    $scope.loadingWheel = function() {
        $ionicLoading.show({
            template: '<ion-spinner icon="circles"/>'
        });
    };
    $scope.uploadPopup = function() {
        var alertPopup = $ionicPopup.alert({
          title: 'Success',
          template: 'Your mehndi design is uploaded successfully.',
          okType: ' button-upload'
        });
        alertPopup.then(function(res) {
            $scope.fileUpload = "";
        });
    };
    $scope.errorPopup = function(msg) {
        $ionicPopup.alert({
          title: 'Error',
          template: msg,
          okType: ' button-upload' 
        });
    };
    $scope.toggleGroup = function(group) {
       if ($scope.isGroupShown(group)) {
         $scope.shownGroup = null;
       } else {
         $scope.shownGroup = group;
       }
    };
    $scope.toggleGroup1 = function(group) {
        if ($scope.isGroupShown(group)=== true) {
          $scope.shownGroup = null;
        }
    };
    $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
    };
    $scope.check = function(tag)
    {
        if(tag.name === 'Common')
        {
            tag.check = true;
        }
        else
        {
            if(tag.check===false)
            {
                tag.check = true;
            }
            else if(tag.check=== true)
            {
                tag.check = false;
            }
        }
    };

    $scope.getPhoto = function () 
    {
        var options = { 
            quality : 100, 
            destinationType : Camera.DestinationType.DATA_URL, 
            sourceType : Camera.PictureSourceType.CAMERA, 
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 2000,
            targetHeight: 2000,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function (imageData) {
            $('#Selectedimage').show();
            $('#Selectedimage').attr('src', "data:image/jpeg;base64,"+imageData);
//            alert(imageData);
            $scope.fileUpload = "data:image/jpeg;base64," + imageData;
        }, function (err) {
            $scope.msg = "An error occured: " + err;
//                $scope.msg = "Oops! Something went wrong. Our team will look into this issue.";
                $scope.errorPopup($scope.msg);
        });
    };  
    $scope.tagList=[{name:"Common",check:true,disable:true}];       
    var ogList=["Hand Design", "Feet Design","Indian","Pakistani","Moghlai","Arabic","Indo-Arabic","Bridal"];     
    for(var i=0;i<ogList.length;i++)
    {
        $scope.tagList.push({name:ogList[i],check:false});
    }    
    $scope.upload = function () 
    {
        var tagName=[];
        for(var i=0;i<$scope.tagList.length;i++)
        {
            if($scope.tagList[i].check)
            tagName.push($scope.tagList[i].name);
        }           
        if(!$scope.fileUpload)
        {
            var msg= "You must capture a picture to upload.";
            $scope.errorPopup(msg);
            $scope.loading = false;
            $ionicLoading.hide();
        }
        else
        {
            $scope.loadingWheel();
            if(!$scope.form.form.desc)
            {
                $scope.form.form.desc = "";
            }
            var image = $scope.fileUpload;
            $scope.uploadCameraDetails = {
                    userID : $localstorage.get('sessionMyID'),																// begining of response set used for scroll down
                    imageData : image,													// tagName used for filtering the response on toggle click
                    desc : $scope.form.form.desc,
                    tagName : tagName
            };
//                
            //service call
            cameraUploadService.uploadCameraImage($scope.uploadCameraDetails).then(function (response) {
                $timeout(callAtTimeout, 10000);
                function callAtTimeout() 
                {
                    $log.debug("uploadImage", response.data);
                    $scope.uploadPopup();
                    $scope.loading = false;
                    $ionicLoading.hide();
                    $ionicScrollDelegate.scrollTop();
                    $('#Selectedimage').hide();
                     $('#Selectedimage').attr('src', "");
                    $scope.form.form.desc = "";
                    $scope.toggleGroup1(3);
                    $('input:checkbox').removeAttr('checked');
                    $scope.tagList=[{name:"Common",check:true,disable:true}];
                     var ogList=["Hand Design", "Feet Design","Indian","Pakistani","Moghlai","Arabic","Indo-Arabic","Bridal"];
                    for(var i=0;i<ogList.length;i++)
                    {
                       $scope.tagList.push({name:ogList[i],check:false});
                    }
                }
            },
            function (error) {
                $scope.msg = "Oops! Something went wrong. Our team will look into this issue.";
                $scope.errorPopup($scope.msg);
                $scope.loading = false;
                $ionicLoading.hide();
                $log.debug("Error uploadImage", error);
             });
        }
    };
}]);
