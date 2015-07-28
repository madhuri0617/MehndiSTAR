
//var baseURL = 'http://api-ratemymehendi.rhcloud.com';
//var baseURL = 'http://158.69.96.25:8181';
var baseURL = 'http://api.mehndistar.com';
var app = angular.module('starter', ['ngAnimate','ionic','openfb','starter.controllers','ngCordova','appFilereader','autocomplete','Services','ngStorage','ionic.utils'])
.run(['$rootScope', '$ionicPlatform','OpenFB','$localstorage','$ionicPopup','$log',function($rootScope, $ionicPlatform,OpenFB,$localstorage,$ionicPopup,$log) {    
    $rootScope.sessionMyID=$localstorage.get('sessionMyID');
    $log.debug("$rootScope.sessionMyID",$rootScope.sessionMyID);
    $rootScope.IsLoggedIn=$localstorage.get('IsLoggedIn');
    $log.debug("$rootScope.IsLoggedIn",$rootScope.IsLoggedIn);
//    OpenFB.init('896457927079961','https://www.facebook.com/connect/login_success.html');
//   OpenFB.init('896457927079961','http://192.168.2.138:8100/oauthcallback.html');
    OpenFB.init('896457927079961','http://mehndistar.com/oauthcallback.html');
    $ionicPlatform.ready(function() {  
//        alert("hii");
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        if(window.Connection) {
            if(navigator.connection.type === Connection.NONE) {
                var alertPopup = $ionicPopup.alert({
                    title: "Internet Disconnected",
                    content: "No Internet Connection is found on your device.",
                    okType: ' button-upload' 
                });
                alertPopup.then(function(result) {         
                        ionic.Platform.exitApp();          
                });
            }
            if(navigator.connection.type === Connection.CELL_2G) {
                var alertPopup = $ionicPopup.alert({
                    title: "Internet Disconnected",
                    content: "Internet Speed is slow on your device.",
                    okType: ' button-upload' 
                });
                alertPopup.then(function(result) {         
    //                    ionic.Platform.exitApp();          
                });
            }
        }
        window.addEventListener('message', function(event){
            $log.debug('Message received:' + JSON.stringify(event.data));
            switch(event.data.action){
                case 'finishFbAuth':
                    OpenFB.oauthCallback(event.data.params.url);
                break;
            }
        });
        
//        code for google analytics.
         $rootScope.MehndiSTARapk=$localstorage.get('MehndiSTARapk');
        if($rootScope.MehndiSTARapk ==='true'){          
            if(typeof analytics !== undefined) {
                analytics.startTrackerWithId("UA-65574899-1");
                 $log.debug(analytics);
                 $log.debug("analytics worked for mobile..");
            } else {
                 $log.debug("Google Analytics Unavailable");
            }
                       
        }
        else{
              (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  $log.debug("analytics worked for browser..");
  ga('create', 'UA-65574899-2', 'auto');
  $log.debug("homeApp");
  ga('send', 'screenview', {'screenName': 'HomeAPP'});
  //ga('send', 'pageview');
        }
//        
    });
    $ionicPlatform.registerBackButtonAction(function (event) {
        if($localstorage.get('FromPage')==="app/home" ||  $localstorage.get('IsLoggedIn')==='true'){
            if($localstorage.get('sessionMyID'))
            {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Exit',
                    template: 'Are you sure you want to exit? You will be logged out from MehndiSTAR',
                    okType: ' button-upload'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                          OpenFB.logout();
                          $localstorage.remove('sessionMyID');
                          $rootScope.sessionMyID=null;
                          $localstorage.set('IsLoggedIn',false);
                          navigator.app.exitApp();
                    } else {
      //                alert('Stay here');
                    }
                });
            }
            else
            {
                 var confirmPopup = $ionicPopup.confirm({
                    title: 'Exit',
                    template: 'Are you sure you want to exit?',
                    okType: ' button-upload'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        navigator.app.exitApp();
                    } else {
      //                alert('Stay here');
                    }
                });
            }
        }
        else {
          navigator.app.backHistory();
        }
    }, 100);
}]);
/*===================================== redireciton =============================== */
app.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider,$logProvider) {
    $ionicConfigProvider.views.transition('none');
//    $logProvider.debugEnabled(false);
    $logProvider.debugEnabled(true);
    $stateProvider
    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
    })
    .state('app.search', {
        url: "/search",
        cache:false,
        views: {
          'menuContent': {
                templateUrl: "templates/search/search.html",
                controller: "SearchDesignsController"
            }
        }
    })
    .state('app.Feedback', {
        url: "/Feedback",
        cache:false,
        views: {
          'menuContent': {
                templateUrl: "templates/Feedback/Feedback.html",
                controller: "FeedbackCtrl"
            }
        }
    })
    .state('app.camera', {
        cache:false,
        url: "/camera",
        views: {
            'menuContent': {
                templateUrl: "templates/camera/camera.html",
                controller: "CameraCtrl"
            }
        }
    })
    .state('app.comment', {
        cache:false,
        url: "/comment",
        views: {
          'menuContent': {
                templateUrl: "templates/comment/comment.html",
                controller: "CommentCtrl as cmt"
            }
        }
    })  
    .state('app.galleryUpload', {
        cache:false,
        url: "/galleryUpload",
        views: {
          'menuContent': {
                templateUrl: "templates/galleryUpload/galleryUpload.html",
                controller:"GalleryUploadCtrl"
            }
        }
    }) 
    .state('app.login', {
        url: "/login",
        cache: false,
        views: {
          'menuContent': {
                templateUrl: "templates/login.html",
                controller: "LoginCtrl"
            }
        }
    })
    .state('app.MyProfile', {
        cache:false,
        url: "/MyProfile/:myPostsLikes",
        views: {
          'menuContent': {
                templateUrl: "templates/myProfile/MyProfile.html",
                controller:'MyProfileDetailsCtrl as mpc'
            }
        }
    })
    .state('app.EditUploadedPicDetails', {
        cache:false,
        url: "/EditUploadedPicDetails",
        views: {
          'menuContent': {
                templateUrl: "templates/EditPic/EditUploadedPicDetails.html",
                controller:"EditPicCtrl as epc"
            }
        }
    })
    .state('app.DpChangeCamera', {
        cache:false,
        url: "/DpChangeCamera",
        views: {
          'menuContent': {
                templateUrl: "templates/EditDp/DpChangeCamera.html",
                controller : "EditDpCtrl"
            }
        }
    })
    .state('app.DpChangeGallery', {
        cache:false,
        url: "/DpChangeGallery",
        views: {
          'menuContent': {
                templateUrl: "templates/EditDp/DpChangeGallery.html",
               controller:'EditDpCtrl'
            }
        }
    })
    .state('app.home', {
        cache:false,
        url: "/home/:tagNm/:category",
        views: {
          'menuContent': {
                templateUrl: "templates/home/home.html",
                controller: 'AppCtrl'
            }
        }
    })   
    .state('app.FullSizeImage', {
        cache:false,
        url: "/FullSizeImage/:imageid",
        views: {
          'menuContent': {
                templateUrl: "templates/FullSizeImage/FullSizeImage.html",
                controller:'FullSizeImgCtrl as fsc'
            }
        }
    }) 
    .state('app.FullSizeFb', {
        cache:false,
        url: "/FullSizeFb/:imageid",
        views: {
          'menuContent': {
                templateUrl: "templates/FullSizeImage/FullSizeFb.html",
                controller:'FullSizeImgCtrl as fsc'
            }
        }
    })    
    .state('app.zoomImage', {
        cache:false,
        url: "/zoomImage",
        views: {
          'menuContent': {
                templateUrl: "templates/zoomImage/zoomImage.html",
                controller:'zoomImageController'
            }
        }
    })   
    .state('app.ZoomDesktop', {
        cache:false,
        url: "/ZoomDesktop",
        views: {
          'menuContent': {
                templateUrl: "templates/zoomImage/ZoomDesktop.html",
                controller: 'ZoomDesktopController'
            }
        }
    })
    .state('app.userProfile', {
        cache:false,
        url: "/userProfile/:uid/:PostsLikes",
        views: {
          'menuContent': {
                templateUrl: "templates/userProfile/userProfile.html",
                controller:'uploaderCtrl as uc'
            }
        }
    })    
    .state('app.aboutUs', {
        cache:false,
        url: "/aboutUs",
        views: {
          'menuContent': {
                templateUrl: "templates/aboutUS/aboutUs.html",
                controller: 'aboutUsCtrl'
            }
        }
    })
    .state('app.privacyPolicy', {
        cache:false,
        url: "/privacyPolicy",
        views: {
          'menuContent': {
                templateUrl: "templates/privacyPolicy.html"
            }
        }
    })
    .state('app.termsAndConditions', {
        cache:false,
        url: "/termsAndConditions",
        views: {
          'menuContent': {
                templateUrl: "templates/termsAndConditions.html"
            }
        }
    });
  // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home/Common/popular');
});

