angular.module('starter.controllers')
.controller('GalleryUploadCtrl', ['$http','$scope','$rootScope','galleryUploadService','$location','$state','$ionicScrollDelegate','$ionicLoading','$ionicPopup','$localstorage','cameraUploadService','$log',  function ($http,$scope,$rootScope,galleryUploadService,$location,$state,$ionicScrollDelegate,$ionicLoading,$ionicPopup,$localstorage,cameraUploadService,$log){
    $scope.apk = localStorage.getItem("MehndiSTARapk");
    $log.debug("apk: "+$scope.apk);
    if($scope.apk === 'true')
    {
        $log.debug("apk on galleryUploadCtrl..");
        $scope.$on('$ionicView.beforeEnter', function() {
            $log.debug("analytics worked for mobile on galleryUploadCtrl..");
            analytics.trackView('Gallery Upload');
        });
    }
    else{
            $log.debug("GalleryUpload screen");
            ga('send', 'screenview', {'screenName': 'GalleryUpload'});
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
    $localstorage.set('FromPage','app/galleryUpload');
    $scope.MyID=$localstorage.get('sessionMyID');
    if(!$scope.MyID)
    {
        $scope.loginPopup();
//        angular.element(document.querySelector("#tabHome")).removeClass("active");
    }
    function setTabClass() {
       angular.element(document.querySelector("#tabUpload")).removeClass("active");
       angular.element(document.querySelector("#tabMyprofile")).addClass("active");
     };
    angular.element(document.querySelector("#tabSearch")).removeClass("active");
    angular.element(document.querySelector("#tabHome")).removeClass("active");
    angular.element(document.querySelector("#tabMyprofile")).removeClass("active");
    angular.element(document.querySelector("#tabUpload")).addClass("active");
    angular.element(document.querySelector("#tabCamera")).removeClass("active");
    $scope.form={};
    
    $scope.loading = true;
    $scope.mobile = localStorage.getItem("mobile");
    $localstorage.set('FromPage','app/galleryUpload');
    $scope.loadingWheel = function() {
        $ionicLoading.show({
            template: '<ion-spinner icon="circles"/>'
        });
    };
    $scope.uploadPopup = function() {
        var alertPopup = $ionicPopup.alert({
          title: 'Success',
          template: 'Design uploaded',
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
    $scope.tagList=[{name:"Common",check:true,disable:true}];     
    var ogList=["Hand Design", "Feet Design","Indian","Pakistani","Moghlai","Arabic","Indo-Arabic","Bridal"];         
    for(var i=0;i<ogList.length;i++)
    {
        $scope.tagList.push({name:ogList[i],check:false});
    }
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
    var _upload = function (photo) 
    {
        var tagName=[];
        for(var i=0;i<$scope.tagList.length;i++)
        {
            if($scope.tagList[i].check)
            tagName.push($scope.tagList[i].name);
        }
        if(!photo)
        {
            var msg = 'You have to select image';
            $scope.errorPopup(msg);
        }
        else
        {
            if(photo.size <= 80000000)
                {
                    $scope.loadingWheel();
                    if(!$scope.form.form.desc)
                    {
                         $scope.form.form.desc="";
                    }
                    var formData = new FormData();
                    formData.append("userPhoto", photo);
                    formData.append("userID", $localstorage.get('sessionMyID'));
                    formData.append("desc", $scope.form.form.desc);
                    formData.append("tagName", tagName);
                    galleryUploadService.uploadImage(formData).then(function (response) 
                    {
                        $log.debug(response.data);
                        $scope.uploadPopup();
                        $scope.loading = false;
                        $ionicLoading.hide();
                        $ionicScrollDelegate.scrollTop();
                        $('#Selectedimage').hide();
                        $('#Selectedimage').attr('src', "");
                        $scope.form.form.desc = "";
                        $scope.toggleGroup1(7);                       
                        $('input:checkbox').removeAttr('checked');
                        $scope.tagList=[{name:"Common",check:true,disable:true}];
                        var ogList=["Hand Design", "Feet Design","Indian","Pakistani","Moghlai","Arabic","Indo-Arabic","Bridal"];
                        for(var i=0;i<ogList.length;i++)
                        {
                            $scope.tagList.push({name:ogList[i],check:false});
                        }
                    },
                    function (error) {
                            $scope.msg = "Oops! Something went wrong. Our team will look into this issue.";
                            $scope.errorPopup($scope.msg);
                            $scope.loading = false;
                            $ionicLoading.hide();
                            $log.debug(error);
                    });
                }
                else
                {
                    var msg = 'Image size is too large.<br>Limit is upto 10MB';
                    $scope.errorPopup(msg);
                }
        }
    };
    $scope.validateImage = function(file){
        var filetype = file.type.substring(0,file.type.indexOf('/'));
        if (filetype == "image") {
                return true;
        }else{
                $('#Selectedimage').attr('src', "");
                $('#Selectedimage').attr('alt', "");
                var html = '<p id="alert">Select Image file only.</p>';
                $(html).hide().prependTo(".chat-box").fadeIn(1500);
                $('#alert').delay(2000).fadeOut('slow', function(){
                        $('#alert').remove();
                });
                return false;
        }
    };
    $scope.filechange = function (ev, file) {
        $scope.fileUpload = ev.target.files[0];
        if($scope.validateImage(ev.target.files[0]))
        {
            $scope.fileType = ev.target.files[0].type;
//            alert($scope.fileType);
            if(ev.target.files[0])
            {
            $scope.fileUpload = ev.target.files[0];
            }
            $scope.fileUpload = $scope.fileUpload;
             if ($scope.fileUpload) {
                var reader = new FileReader();
                reader.onload = function (e) {
                $('#Selectedimage').attr('src', e.target.result);
                $scope.file = e.target.result;
                $scope.file = $scope.file.toString();
                $('#Selectedimage').show();
                };
                reader.readAsDataURL($scope.fileUpload);
            }
        }
    };
    $scope.upload = function () {  
        if($scope.fileUpload)
        {
            if($scope.validateImage($scope.fileUpload))
            {
                _upload($scope.fileUpload);
            }
        }
        else
        {
            var msg = 'You have to select image';
            $scope.errorPopup(msg);
        }   
    };                    
}]);



