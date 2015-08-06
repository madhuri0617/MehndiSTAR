
//var baseURL = 'http://api-ratemymehendi.rhcloud.com';
//var baseURL = 'http://192.168.2.135:8181';
var baseURL = 'http://api.mehndistar.com/v2';
var app = angular.module('starter', ['ngAnimate','ionic','openfb','starter.controllers','ngCordova','appFilereader','autocomplete','Services','ngStorage','ionic.utils'])
.run(['$rootScope', '$ionicPlatform','OpenFB','$localstorage','$ionicPopup','$log',function($rootScope, $ionicPlatform,OpenFB,$localstorage,$ionicPopup,$log) {    
//      alert("inside app.js**********************");  
      $rootScope.MehndiSTARapk=$localstorage.get('MehndiSTARapk');
      document.addEventListener("deviceready", function() {
          navigator.splashscreen.hide();
            if(typeof analytics !== undefined) {
                analytics.startTrackerWithId("UA-65574899-1");
                 $log.debug(analytics);
                 $log.debug("analytics worked for mobile on app.js..***************");
            } else {
                 $log.debug("Google Analytics Unavailable");
            }                       

    });
    //        code for google analytics.
        $log.debug("inside app.js above google analytics");
        if($rootScope.MehndiSTARapk !=='true'){ 
              (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
                    $log.debug("analytics worked for browser..");
                    ga('create', 'UA-65574899-2', 'auto');
                    ga('send', 'pageview', {
                    'page': '/App',
                    'title': 'App'
                  });
            }
        
    $log.debug("inside app.js",$rootScope.MehndiSTARapk);
    $rootScope.sessionMyID=$localstorage.get('sessionMyID');
    $log.debug("$rootScope.sessionMyID",$rootScope.sessionMyID);
    $rootScope.IsLoggedIn=$localstorage.get('IsLoggedIn');
    $log.debug("$rootScope.IsLoggedIn",$rootScope.IsLoggedIn);
//    OpenFB.init('896457927079961','https://www.facebook.com/connect/login_success.html');
//   OpenFB.init('896457927079961','http://192.168.2.138:8100/oauthcallback.html');
    OpenFB.init('896457927079961','http://mehndistar.com/oauthcallback.html');
    $ionicPlatform.ready(function() {
        if(navigator.splashscreen){
                setTimeout(function () {
                    navigator.splashscreen.hide();
                }, 100);
        }
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        if(window.Connection) {
            if(navigator.connection.type === Connection.NONE) {
                $localstorage.set('internet','false');
//                var alertPopup = $ionicPopup.alert({
//                    title: "Internet Disconnected",
//                    content: "No internet connection is found on your device.",
//                    okType: ' button-upload' 
//                });
//                alertPopup.then(function(result) {         
//                        ionic.Platform.exitApp();          
//                });
            }
            if(navigator.connection.type === Connection.CELL_2G) {
                var alertPopup = $ionicPopup.alert({
                    title: "Slow Internet",
                    content: "Internet speed is slow on your device.",
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
        
////        code for google analytics.
//        $log.debug("inside app.js above google analytics");
//        if($rootScope.MehndiSTARapk !=='true'){ 
//              (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
//                    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
//                    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
//                    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
//                    $log.debug("analytics worked for browser..");
//                    ga('create', 'UA-65574899-2', 'auto');
//                    ga('send', 'pageview', {
//                    'page': '/App',
//                    'title': 'App'
//                  });
//            }
//        
    });
    $ionicPlatform.registerBackButtonAction(function (event) {
        if($localstorage.get('FromPage')==="app/home" && $localstorage.get('CurrentPage') === "app.home"){
            if($localstorage.get('sessionMyID'))
            {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Exit',
                    template: 'Are you sure you want to exit? You will be logged out from MehndiSTAR.',
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
    $logProvider.debugEnabled(false);
//    $logProvider.debugEnabled(true);
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
    .state('app.feedback',
         {
        url: "/feedback",
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
    .state('app.galleryupload', {
        cache:false,
        url: "/galleryupload",
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
    .state('app.myprofile', {
        cache:false,
        url: "/myprofile/:myPostsLikes",
        views: {
          'menuContent': {
                templateUrl: "templates/myProfile/MyProfile.html",
                controller:'MyProfileDetailsCtrl as mpc'
            }
        }
    })
    .state('app.edituploadedpicdetails', {
        cache:false,
        url: "/edituploadedpicdetails",
        views: {
          'menuContent': {
                templateUrl: "templates/EditPic/EditUploadedPicDetails.html",
                controller:"EditPicCtrl as epc"
            }
        }
    })
    .state('app.dpchangecamera', {
        cache:false,
        url: "/dpchangecamera",
        views: {
          'menuContent': {
                templateUrl: "templates/EditDp/DpChangeCamera.html",
                controller : "EditDpCtrl"
            }
        }
    })
    .state('app.dpchangegallery', {
        cache:false,
        url: "/dpchangegallery",
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
    .state('app.fullsizeimage', {
        cache:false,
        url: "/fullsizeimage/:imageid",
        views: {
          'menuContent': {
                templateUrl: "templates/FullSizeImage/FullSizeImage.html",
                controller:'FullSizeImgCtrl as fsc'
            }
        }
    }) 
    .state('app.fullsizefb', {
        cache:false,
        url: "/fullsizefb/:imageid",
        views: {
          'menuContent': {
                templateUrl: "templates/FullSizeImage/FullSizeFb.html",
                controller:'FullSizeImgCtrl as fsc'
            }
        }
    })    
    .state('app.zoomimage', {
        cache:false,
        url: "/zoomimage",
        views: {
          'menuContent': {
                templateUrl: "templates/zoomImage/zoomImage.html",
                controller:'zoomImageController'
            }
        }
    })   
    .state('app.zoomdesktop', {
        cache:false,
        url: "/zoomdesktop",
        views: {
          'menuContent': {
                templateUrl: "templates/zoomImage/ZoomDesktop.html",
                controller: 'ZoomDesktopController'
            }
        }
    })
    .state('app.userprofile', {
        cache:false,
        url: "/userprofile/:uid/:PostsLikes",
        views: {
          'menuContent': {
                templateUrl: "templates/userProfile/userProfile.html",
                controller:'uploaderCtrl as uc'
            }
        }
    })    
    .state('app.aboutus', {
        cache:false,
        url: "/aboutus",
        views: {
          'menuContent': {
                templateUrl: "templates/aboutUS/aboutUs.html",
                controller: 'aboutUsCtrl'
            }
        }
    })
    .state('app.privacypolicy', {
        cache:false,
        url: "/privacypolicy",
        views: {
          'menuContent': {
                templateUrl: "templates/privacyPolicy.html"
            }
        }
    })
    .state('app.termsandconditions', {
        cache:false,
        url: "/termsandconditions",
        views: {
          'menuContent': {
                templateUrl: "templates/termsAndConditions.html"
            }
        }
    });
  // if none of the above states are matched, use this as the fallback
//    $urlRouterProvider.otherwise('/app/home/Common/popular');
      $urlRouterProvider.otherwise(function($injector, $location){
//        console.log($location.path());
        var path = $location.path(), normalized = path.toLowerCase();
        if (path !== normalized) {
            //instead of returning a new url string, I'll just change the $location.path directly so I don't have to worry about constructing a new url string and so a new state change is not triggered
            $location.replace().path(normalized);
        }else{
             $location.path('/app/home/Common/popular');
        }
        
});
});

