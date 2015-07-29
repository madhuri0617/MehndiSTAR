angular.module('starter.controllers')
.controller('MyProfileDetailsCtrl', ['$stateParams','$localstorage','$scope','$rootScope','$http','$location','MyProfileService','$ionicScrollDelegate','$ionicLoading','$ionicPopup','FullImgService','CommonServiceDate','$log', function MyProfileDetailsCtrl($stateParams,$localstorage,$scope,$rootScope,$http,$location,MyProfileService,$ionicScrollDelegate,$ionicLoading,$ionicPopup,FullImgService,CommonServiceDate,$log) {
    $scope.apk = localStorage.getItem("MehndiSTARapk");
        $log.debug("apk: "+$scope.apk);
        if($scope.apk === 'true')
        {
            $log.debug("apk on MyProfileDetailsCtrl..");
            $scope.$on('$ionicView.beforeEnter', function() {
                $log.debug("analytics worked for mobile on MyProfileDetailsCtrl..");
                analytics.trackView('MyProfile');
            });
        }
        else{
            $log.debug("MyProfile screen");
            ga('send', 'pageview', {
                'page': '/MyProfile',
                'title': 'MyProfile'
            });
        }
    $scope.errorPopup = function(msg) {
        $ionicPopup.alert({
          title: 'Error',
          template: msg,
          okType: ' button-upload' 
        });
    };
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
    $localstorage.set('FromPage','app/MyProfile/posts');
    $scope.MyID=$localstorage.get('sessionMyID');
    if(!$scope.MyID)
    {
        $scope.loginPopup();
//        angular.element(document.querySelector("#tabHome")).removeClass("active");
    }
    else
    {
    $scope.loading = true;
//        $localstorage.set('zoomImagePage',false);
    $scope.loadingWheel = function() {
        $log.debug("wheel");
        $ionicLoading.show({
            template: '<ion-spinner icon="circles"/>'
        });
    };
    $scope.myPostsLikesFromURL = $stateParams.myPostsLikes;
    $localstorage.set('FromPage','app/MyProfile/posts');
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
        angular.element(document.querySelector("#tabUpload")).removeClass("active");
        angular.element(document.querySelector("#tabCamera")).removeClass("active");
    };
    setTabClass();
    var mpc = this;
    mpc.MyId = $localstorage.get('sessionMyID');
    $log.debug("MyId in userProfile controller: "+mpc.MyId);
    mpc.Posts=[];
    $scope.postLikesAvailable = false;
    $scope.filterEvenStartFrom = function (index) {
        return function (item) {
            return index++ % 2 === 1;
        };
    };
    mpc.getCommentClickedImageId = function(imageid)
    {
        $log.debug("Comment clicked image id: " +imageid);
        $localstorage.set('commentClickedChk','true');
        $location.path("app/FullSizeImage/"+imageid);
    };
    mpc.user =   {
        userID:$localstorage.get('sessionMyID')
    };
    mpc.getOwnInfo = function(){
        $scope.loadingWheel();
        $log.debug('inside getowninfo',mpc.user);
        MyProfileService.getOwnInfo(mpc.user).then(function (response) {
                $log.debug(response.data);
                mpc.OwnInfo = response.data;
                $localstorage.set('currentPath',mpc.OwnInfo.DPPath);
//                    alert("DP: "+mpc.OwnInfo.DPPath);
//                    alert("name: "+mpc.OwnInfo.userName);
//                    $rootScope.currentPath = mpc.OwnInfo.DPPath;
                $scope.loadinggetOwninfo = true;
                $log.debug("owninfo completed")
                $log.debug('mydetails:',mpc.OwnInfo);
        },
        function (error) {
            $scope.msg = "Oops! Something went wrong. Our team will look into this issue.";
            $scope.errorPopup($scope.msg);
            $scope.loading = false;
            $ionicLoading.hide();
            $log.debug("Error in getOwnInfo Service", error);
        });
    };
    mpc.getOwnInfo();
    $scope.moredata = false;
    $scope.moredesigns = false;
    $scope.totalPosts = 0;
    $scope.loadMoreData=function()
    {
        $scope.moredesigns = false;
        $log.debug("loadmoredata:    @@@@@@: ",mpc.Posts );
        mpc.Posts.push(mpc.dumy[$scope.counter]);
        $scope.counter += 1;   
        $log.debug("mpc.Posts.length @@@@@@ :",mpc.Posts.length,$scope.totalPosts);
        if(mpc.Posts.length === $scope.totalPosts)
        {
            $scope.moredata=true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };
    mpc.getDesignsOwnPosts = function()
    {
        $localstorage.set('FromPage','app/MyProfile/posts');
        $location.path("app/MyProfile/posts");
        $scope.IsPostTabActive = true;
        $scope.IsLikeTabActive = false; 
    };
    mpc.getDesignsOwnLikes = function()
    {
        $localstorage.set('FromPage','app/MyProfile/likes');
        $location.path("app/MyProfile/likes");
        $scope.IsLikeTabActive = true;
        $scope.IsPostTabActive = false;
    };   
    mpc.getOwnPost = function(){
        $scope.like = false;
        $scope.loadingWheel();
        $log.debug("inside getPost");
        $log.debug("mpc.user",mpc.user);
        MyProfileService.getOwnPost(mpc.user).then(function (response) {
            $log.debug(response.data);
                    //mpc.Posts = response.data;
                if(response.data[0].message)
                {
                    $scope.noDataPopup("Posts","No posts found.");
                    $scope.postLikesAvailable = false;
                }
                else
                {                            
                    //mpc.Posts = response.data;
                    //mpc.Posts = [];

                    mpc.dumy = response.data;
                    $scope.counter = 0;
                    $scope.totalPosts = mpc.dumy.length;
                    for (var i = 0; i < response.data.length; i++) {
                        var dateStr = new Date(response.data[i].uploadDate);
                        var dateToShow = CommonServiceDate.getPostDate(dateStr);
                        response.data[i].uploadDate = dateToShow;
                    }
                    if($scope.totalPosts>20)
                    {
                        for( ; $scope.counter<20; $scope.counter++)
                        {
                            mpc.Posts.push(mpc.dumy[$scope.counter]);
                        }   
                    }
                    else
                    {
                        mpc.Posts = response.data;
                        $scope.moredata = true;
                    }
                    $scope.postLikesAvailable = true;
                }
                $log.debug("posts completed");
                $ionicScrollDelegate.scrollTop();
                $scope.loading = false;
                $ionicLoading.hide();
                $log.debug('mpc.Posts posts',mpc.Posts,mpc.Posts.length);
            },
            function (error) {
                $scope.msg = "Oops! Something went wrong. Our team will look into this issue.";
                $scope.errorPopup($scope.msg);
                $scope.loading = false;
                $ionicLoading.hide();
               $log.debug("Error in getOwnPost Service", error);
            });
    };
//    mpc.getOwnPost();
    mpc.getOwnLike = function(){
        $scope.like = true;
        $scope.loadingWheel();
        MyProfileService.getOwnLike(mpc.user).then(function (response) {
            $log.debug(response.data);
            if(response.data[0].message)
            {
                $scope.noDataPopup("Likes","No likes found.");
                $scope.postLikesAvailable = false;
            }
            else
            {
               mpc.Posts = [];
               mpc.dumy = response.data;
               $scope.counter = 0;
               $scope.totalPosts = mpc.dumy.length;
                for (var i = 0; i < response.data.length; i++) {
                    var dateStr = new Date(response.data[i].uploadDate);
                    var dateToShow = CommonServiceDate.getPostDate(dateStr);
                    response.data[i].uploadDate = dateToShow;
                }
                if($scope.totalPosts>20)
                {
                    for( ; $scope.counter<20; $scope.counter++)
                    {
                        mpc.Posts.push(mpc.dumy[$scope.counter]);
                    } 
                }
                else
                {
                    mpc.Posts = response.data;
                    $scope.moredata = true;
                }
                $scope.postLikesAvailable = true;
            }
            $ionicScrollDelegate.scrollTop();
            $scope.loading = false;
            $ionicLoading.hide();
            $log.debug('mpc.Posts likes',mpc.Posts,mpc.Posts.length);
        },
        function (error) {
            $scope.msg = "Oops! Something went wrong. Our team will look into this issue.";
            $scope.errorPopup($scope.msg);
            $scope.loading = false;
            $ionicLoading.hide();
           $log.debug("Error in getOwnLikes Service", error);
        });
    };
    if($scope.myPostsLikesFromURL === 'posts')
    {
        mpc.getOwnPost(); 
        $localstorage.set('FromPage','app/MyProfile/posts');
        $scope.IsPostTabActive = true;
        $scope.IsLikeTabActive = false; 
    }
    else
    {
        mpc.getOwnLike();
        $localstorage.set('FromPage','app/MyProfile/likes');
        $scope.IsLikeTabActive = true;
        $scope.IsPostTabActive = false;
    }
    mpc.sendimgID = function (imgid){
        $log.debug('myprofile page');
        $log.debug('img id to be passed:',imgid);
        $localstorage.set('commentClickedChk','false');
        $localstorage.set('sessionImageID',imgid);
        $location.path("app/FullSizeImage/"+imgid);
    };    
    mpc.sendEditimgID = function (imgid){
        $log.debug('img id to be passed:',imgid);
        $localstorage.set('sessionImageID',imgid);
    }; 
    $scope.ClickedLikedMyProfile = function (post){          
        $log.debug("image like clicked ", post);
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
                    if($scope.like === true)
                    {
                        $scope.loadingWheel();
                        mpc.getOwnLike();
                    }
                        //alert("$scope.likesCount" + $scope.likesCount);
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
    }
}]);
