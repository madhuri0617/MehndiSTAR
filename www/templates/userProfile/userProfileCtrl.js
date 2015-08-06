angular.module('starter.controllers')
.controller('uploaderCtrl', ['$state','$stateParams','$http','$scope','$rootScope','userProfileService','$ionicScrollDelegate','$ionicLoading','$ionicPopup','$location','$localstorage','FullImgService','CommonServiceDate','$log', function uploaderCtrl($state,$stateParams,$http,$scope,$rootScope,userProfileService,$ionicScrollDelegate,$ionicLoading,$ionicPopup,$location,$localstorage,FullImgService,CommonServiceDate,$log) {
    $scope.loading = true;
    $rootScope.zoomImagePage = false;
    $scope.UserIDFromURL = $stateParams.uid;
    $scope.PostsLikesFromURL = $stateParams.PostsLikes;
    $log.debug($scope.PostsLikesFromURL);
    $scope.apk = localStorage.getItem("MehndiSTARapk");
    $log.debug("apk: "+$scope.apk);
    if($scope.apk === 'true')
    {
        $log.debug("apk on userProfileCtrl..");
        $scope.$on('$ionicView.beforeEnter', function() {
            $log.debug("analytics worked for mobile on userProfileCtrl..");
            analytics.trackView('UserProfile');
        });
    }
    else{
            $log.debug("UserProfile screen");
            ga('send', 'pageview', {
                'page': '/UserProfile',
                'title': 'UserProfile'
            });
        }
//        $localstorage.set('zoomImagePage',false);
//       $rootScope.zoomImagePage = $localstorage.get('zoomImagePage');
    $log.debug("$rootScope.zoomImagePage"+$rootScope.zoomImagePage);
    $scope.loadingWheel = function() {
        $ionicLoading.show({
            template: '<ion-spinner icon="circles"/>'
        });
    };
    
    $scope.loadingWheel();
    $scope.noDataPopup = function(msg1,msg2) {
        $ionicPopup.alert({
          title: msg1,
          template: msg2,
          okType: ' button-upload' 
      });
    };
    function setTabClass() {
       angular.element(document.querySelector("#tabMyprofile")).addClass("active");
       angular.element(document.querySelector("#tabHome")).removeClass("active");
       angular.element(document.querySelector("#tabSearch")).removeClass("active");
    };
    setTabClass();
    $scope.filterEvenStartFrom = function (index) {
        return function (item) {
            return index++ % 2 === 1;
        };
    };
    $scope.errorPopup = function(msg) {
        $ionicPopup.alert({
          title: 'Error',
          template: msg,
          okType: ' button-upload' 
        });
    };
    var uc = this;
    uc.MyId = $localstorage.get('sessionMyID');
    $log.debug("MyId in userProfile controller: "+uc.MyId);
    uc.Posts=[];
    $scope.postLikesAvailable = false;
    $log.debug("User ID: " +$localstorage.get('sessionUserID'));
    $log.debug("My ID: " +$localstorage.get('sessionMyID'));
    uc.user={};
    uc.user.userID = $localstorage.get('sessionUserID');
    uc.user.sessionID=$localstorage.get('sessionMyID');       
    uc.getUserInfo = function(){
        userProfileService.getUserInfo(uc.user).then(function (response) {
            $log.debug('response of getUserInfo',response.data);
            uc.Profile = response.data;
            $scope.profilePhoto = uc.Profile.DPPathHigh;
            $scope.loadinggetOwninfo = true;
            $log.debug('uc.Profile',uc.Profile);
        },
        function (error) {
            $scope.msg = "Oops! Something went wrong. Our team will look into this issue.";
            $scope.errorPopup($scope.msg);
            $scope.loading = false;
            $ionicLoading.hide();
            $log.debug("Error in getUserInfo Service", error);
        });
    };
    $scope.moredata = false;
    $scope.moredesigns = false;
    $scope.totalPosts = 0;
    $scope.loadMoreData=function()
    {
        $scope.moredesigns = false;
        $log.debug("loadmoredata: ",uc.Posts );
        uc.Posts.push(uc.dumy[$scope.counter]);
        $scope.counter += 1;   
        $log.debug("uc.Posts.length: ",uc.Posts.length,$scope.totalPosts);
        if(uc.Posts.length === $scope.totalPosts)
        {
            $scope.moredata=true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };
    uc.getDesignsPosts = function()
    {
        $scope.loadingWheel();
        $localstorage.set('CurrentPage',$state.current.name);
        $localstorage.set('FromPage','app/userprofile/'+ $scope.UserIDFromURL+'/posts');
        $location.path("app/userProfile/"+$scope.UserIDFromURL+'/posts');
        $scope.IsPostTabActive = true;
        $scope.IsLikeTabActive = false; 
    };
    uc.getDesignsLikes = function()
    {
        $localstorage.set('CurrentPage',$state.current.name);
        $scope.loadingWheel();
        $localstorage.set('FromPage','app/userprofile/'+ $scope.UserIDFromURL+'/likes');
        $location.path("app/userProfile/"+$scope.UserIDFromURL+'/likes');
        $scope.IsLikeTabActive = true;
        $scope.IsPostTabActive = false;
    };
    uc.getUserPost = function(){
        $scope.loadingWheel();
        userProfileService.getUserPost(uc.user).then(function (response) {
            //uc.Posts = response.data;
            //uc.Posts = [];
            uc.dumy = response.data;
            $scope.counter = 0;
            $scope.totalPosts = uc.dumy.length;
            for (var i = 0; i < response.data.length; i++) {
                    var dateStr = new Date(response.data[i].uploadDate);
                    var dateToShow = CommonServiceDate.getPostDate(dateStr);
                    response.data[i].uploadDate = dateToShow;
            }
            if($scope.totalPosts>20)
            {
                for( ; $scope.counter<20; $scope.counter++)
                {
                    uc.Posts.push(uc.dumy[$scope.counter]);
                }   
            }
            else
            {
                uc.Posts = response.data;
                $scope.moredata = true;
            }
            $scope.postLikesAvailable = true;
            $ionicScrollDelegate.scrollTop();
            $scope.loading = false;
            $ionicLoading.hide();
            $log.debug('uc.Posts posts',uc.Posts,uc.Posts.length);
        },
        function (error) {
            $scope.msg = "Oops! Something went wrong. Our team will look into this issue.";
            $scope.errorPopup($scope.msg);
            $scope.loading = false;
            $scope.moredata = true;
            $ionicLoading.hide();
            $log.debug("Error in getUserPost Service", error);
        });               
    };
    uc.getUserLike = function(){
        $scope.loadingWheel();
        userProfileService.getUserLike(uc.user).then(function (response) {
                    //$log.debug("response likes", response.data);
            if(response.data[0].message)
            {
                $scope.noDataPopup("Likes","No likes found.");
                $scope.postLikesAvailable = false;
            }
            else
            {
               $scope.loadingWheel();
               uc.Posts = [];
               uc.dumy = response.data;
               $scope.counter = 0;
               $scope.totalPosts = uc.dumy.length;
                for (var i = 0; i < response.data.length; i++) {
                        var dateStr = new Date(response.data[i].uploadDate);
                        var dateToShow = CommonServiceDate.getPostDate(dateStr);
                        response.data[i].uploadDate = dateToShow;
                }
                if($scope.totalPosts>20)
                {
                    for( ; $scope.counter<20; $scope.counter++)
                    {
                        uc.Posts.push(uc.dumy[$scope.counter]);
                    } 
                }
                else
                {
                    uc.Posts = response.data;
                    $scope.moredata = true;
                }
                $scope.postLikesAvailable = true;
            }
                $ionicScrollDelegate.scrollTop();
                $scope.loading = false;
                $ionicLoading.hide();
                $log.debug('uc.Posts likes',uc.Posts,uc.Posts.length);
        },
        function (error) {
            $scope.msg = "Oops! Something went wrong. Our team will look into this issue.";
            $scope.errorPopup($scope.msg);
            $scope.loading = false;
            $scope.moredata = true;
            $ionicLoading.hide();
            $log.debug("Error in getUserLike Service", error);
        });               
    };     
    if($scope.PostsLikesFromURL === 'posts')
    {
        $localstorage.set('CurrentPage',$state.current.name);
        $scope.loadingWheel();
        uc.getUserPost(); 
        $localstorage.set('FromPage','app/userprofile/'+ $scope.UserIDFromURL+'/posts');
        $scope.IsPostTabActive = true;
        $scope.IsLikeTabActive = false; 
    }
    else
    {
        $localstorage.set('CurrentPage',$state.current.name);
        $scope.loadingWheel();
        uc.getUserLike();
        $localstorage.set('FromPage','app/userprofile/'+ $scope.UserIDFromURL+'/likes');
        $scope.IsLikeTabActive = true;
        $scope.IsPostTabActive = false;
    }
    uc.getpostid=function(pid){
            $log.debug('user profile page');
            $localstorage.set('commentClickedChk','false');
            $log.debug('postid to be passed:',pid);
            $location.path("app/FullSizeImage/"+pid);
    };
    uc.getCommentClickedImageId = function(imageid)
    {
        $log.debug("Comment clicked image id: " +imageid);
        $localstorage.set('commentClickedChk','true');
        $location.path("app/FullSizeImage/"+imageid);
    };
    uc.zoomProfile = function()
    {
        $log.debug("zoomProfile");
        $localstorage.set('imageToZoom',$scope.profilePhoto);
//        $location.path('app/zoomImage');
        $rootScope.controlzoom = localStorage.getItem("controlZoom");
//            alert($rootScope.controlzoom);
        if($rootScope.controlzoom === 'zoomImageController')
        $location.path('app/zoomImage');
        if($rootScope.controlzoom === 'ZoomDesktopController')
        $location.path('app/ZoomDesktop');
    };
    $scope.ClickedLikedUserProfile = function (post){
            // $log.debug("image like clicked ", post);
        var MyID=$localstorage.get('sessionMyID');
        $log.debug('inide checkLogin() myid:',MyID);
        $log.debug('inide checkLogin() $rootScope.sessionMyID:)',$rootScope.sessionMyID);
       if(!MyID)
       {
           $log.debug(" inside login");
           $scope.loginPopup();
       }
       else
       {
           var imgDetails = {
                    postID  : post._id,                        
                    userID:$localstorage.get('sessionMyID')//'55041c5ec20ec607edaf7729' 
            };
            if (post.liked) 
            {
                //callunlike
                //alert('called unlike');
                $scope.loadingWheel();
                FullImgService.unlikeClicked(imgDetails).then(function (response) {
                    post.liked=false;
                    post.cntLikes = post.cntLikes - 1;
                    $scope.loadingLike = false;
                    $ionicLoading.hide();
                },
                function (error) {
                    $scope.msg = "Oops! Something went wrong. Our team will look into this issue.";
                    $scope.errorPopup($scope.msg);
                    $scope.loading = false;
                    $ionicLoading.hide();
                    $log.debug("error in unlike", error);
                });                    
            }
            else
            {
                $scope.loadingWheel();
                FullImgService.likeClicked(imgDetails).then(function (response) {
                    post.liked=true;
                    post.cntLikes = post.cntLikes + 1;
                    $scope.loadingLike = false;
                    $ionicLoading.hide();
                },
                function (error) {
                    $scope.msg = "Oops! Something went wrong. Our team will look into this issue.";
                    $scope.errorPopup($scope.msg);
                    $scope.loading = false;
                    $ionicLoading.hide();
                    $log.debug("error in like", error);
                });                   
            }  
        }
    };   
}]);


