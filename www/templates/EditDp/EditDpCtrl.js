    angular.module('starter.controllers')
.controller('EditDpCtrl', ['$timeout','$http','$scope','$rootScope','EditDpService','$location','$state','$cordovaCamera','$ionicScrollDelegate','$ionicLoading','$ionicPopup','$localstorage','$log', function EditDpCtrl($timeout,$http,$scope,$rootScope,EditDpService,$location,$state,$cordovaCamera,$ionicScrollDelegate,$ionicLoading,$ionicPopup,$localstorage,$log) 
   {
        $scope.apk = localStorage.getItem("MehndiSTARapk");
        $log.debug("apk: "+$scope.apk);
        if($scope.apk === 'true')
        {
            $log.debug("apk on EditDPCtrl..");
            $scope.$on('$ionicView.beforeEnter', function() {
                $log.debug("analytics worked for mobile on EditDPCtrl..");
                analytics.trackView('EditProfilePhoto');
            });
        }
        else{
            $log.debug("EditDp screen");
           ga('send', 'pageview', {
                'page': '/EditDP',
                'title': 'EditDP'
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
//    $localstorage.set('FromPage','app/MyProfile/posts');
    $scope.MyID=$localstorage.get('sessionMyID');
    if(!$scope.MyID)
    {
        $scope.loginPopup();
//        angular.element(document.querySelector("#tabHome")).removeClass("active");
    }
    else
    {
       //change dp:
//       $localstorage.set('zoomImagePage',false);
        $scope.fileUpload = $localstorage.get('currentPath');
        $scope.mobile = localStorage.getItem("mobile");
       $('#Selectedimage').attr('src',$localstorage.get('currentPath'));
//       $('#Selectedimage').attr('src', $rootScope.currentPath);
       $scope.loadingWheel = function() {
            $ionicLoading.show({
                template: '<ion-spinner icon="circles"/>'
            });
        };
        $localstorage.set('CurrentPage',$state.current.name);
        $localstorage.set('FromPage','app/dpchangegallery');
        $scope.uploadPopup = function() {
            var alertPopup = $ionicPopup.alert({
              title: 'Success',
              template: 'Your profile photo is updated.',
              okType: ' button-upload'
            });
            alertPopup.then(function(res) {
                $scope.fileUpload = "";
                $location.path('app/MyProfile/posts');
            });
        };
        $scope.errorPopup = function(msg) {
            $ionicPopup.alert({
              title: 'Error',
              template: msg,
              okType: ' button-upload' 
          });
        };
        $scope.form={};
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
                    $('#Selectedimage').attr('src', "data:image/jpeg;base64,"+imageData);
                    $scope.fileUpload = "data:image/jpeg;base64,"+imageData;
            }, function (err) {
                $scope.msg = "An error occured: " + err;
//                $scope.msg = "Oops! Something went wrong. Our team will look into this issue.";
                $scope.errorPopup($scope.msg);
            });
        };      
        $scope.uploadCamera = function () {         
            if(!$scope.fileUpload || $scope.fileUpload === $localstorage.get('currentPath'))
            {
                    $scope.msg="You must capture a picture for profile photo.";
                    $scope.errorPopup($scope.msg);
                    $scope.loading = false;
                    $ionicLoading.hide();
            }
            else
            {
                $scope.loadingWheel();
                var photo = $scope.fileUpload;
                $scope.uploadCameraDetails = {
			userID : $localstorage.get('sessionMyID'),															
			imageData : photo											                       
                };
                $log.debug("userID"+$localstorage.get('sessionMyID'));
//                formData.append("userPhoto", photo );
//                formData.append("userID", $rootScope.sessionMyID);
                
                //service call
                EditDpService.uploadDpCamera($scope.uploadCameraDetails).then(function (response) {
                    $timeout(callAtTimeout, 10000);
                    function callAtTimeout() 
                    {
                        $log.debug("uploadImage", response.data);
                        $scope.uploadPopup();
                        $scope.form=null;
                        $scope.loading = false;
                        $ionicLoading.hide();
                        $ionicScrollDelegate.scrollTop();
                //$location.path('app/MyProfile');
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
      // $('#Selectedimage').hide();
        var _upload = function (photo) {
            if(!photo)
            {
                        $scope.msg="You must select an image for profile photo.";
                        $scope.errorPopup($scope.msg);
            }
            else
            {
                $scope.loadingWheel();
                var formData = new FormData();
    //          $log.debug("userID"+$rootScope.sessionMyID);
                $log.debug("userID"+$localstorage.get('sessionMyID'));
                formData.append("userPhoto", photo);
                formData.append("userID", $localstorage.get('sessionMyID'));
                EditDpService.uploadDp(formData).then(function (response) {
                    $timeout(callAtTimeout, 10000);
                    function callAtTimeout() 
                    {
                        $log.debug("uploadImage", response.data);
                        $scope.uploadPopup();
                        $scope.form=null;
                        $scope.loading = false;
                        $ionicLoading.hide();
                        $ionicScrollDelegate.scrollTop();
                        //$('#Selectedimage').hide();
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
        $scope.validateImage = function(file){
            // $log.debug(file);
            var filetype = file.type.substring(0,file.type.indexOf('/'));
            $log.debug(filetype);
            if (filetype == "image") {
//                  scope.uploadDisabled = false;
//                  alert($scope.uploadDisabled)
                    return true;
            }
            else {
                $('#Selectedimage').attr('src', "");
                $('#Selectedimage').attr('alt', "");
//                    $scope.uploadDisabled = true;
                var html = '<p id="alert">Select Image file only.</p>';
                $(html).hide().prependTo(".chat-box").fadeIn(1500);
                // $('.chat-box').append(html).fadeIn('slow');
                $('#alert').delay(2000).fadeOut('slow', function(){
                        $('#alert').remove();
                });
                return false;
            }
        };
        $scope.filechange = function (ev, file) {
            $log.debug("event", ev);
            $log.debug("file", ev.target.files[0]);
            $scope.fileUpload = ev.target.files[0];
            if($scope.validateImage(ev.target.files[0]))
            {
                $scope.fileUpload = ev.target.files[0];
                $scope.fileType = ev.target.files[0].type;
    //          alert($scope.fileType);
    //          $log.debug("file upload: " , $scope.fileUpload )
                if ($scope.fileUpload) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $('#Selectedimage').attr('alt', "Select image");
                        $('#Selectedimage').attr('src', e.target.result);
                        // $('#Selectedimage').show();
                    };
                    reader.readAsDataURL($scope.fileUpload);
                }
            }      
        };
        $scope.upload = function () {
            if($scope.fileUpload !== $localstorage.get('currentPath'))
            {
                if($scope.validateImage($scope.fileUpload))
                {
    //                alert("upload");
                    _upload($scope.fileUpload);
                }
            }
            else
            {
                $scope.msg="You have must select an image for profile photo.";
                $scope.errorPopup($scope.msg);
            }
        };
    }
}]);


