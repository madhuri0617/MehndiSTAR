angular.module('starter.controllers')
.directive('focusMe', function($timeout,$log) {
  return {
            link: function(scope, element, attrs) {
              scope.$watch(attrs.focusMe, function(value) {
                if(value === true) { 
                  $log.debug('value=',value);
                  $timeout(function() {
                    element[0].focus();
                    scope[attrs.focusMe] = false;
                  });
                }
              });
            }
        };
    })
    .controller('FullSizeImgCtrl', ['$timeout','$state','OpenFB','$http','$scope','$rootScope','FullImgService','$ionicPopup','$location','$cordovaSocialSharing','$ionicLoading','$localstorage','$stateParams','CommonServiceDate','commentsService','$ionicScrollDelegate','$log', function($timeout,$state,OpenFB,$http,$scope,$rootScope,FullImgService,$ionicPopup,$location,$cordovaSocialSharing,$ionicLoading,$localstorage,$stateParams,CommonServiceDate,commentsService,$ionicScrollDelegate,$log)
    {      
        $log.debug("inside full size controller");
        $scope.apk = localStorage.getItem("MehndiSTARapk");
        $log.debug("apk: "+$scope.apk);
        if($scope.apk === 'true')
        {
            $log.debug("apk on FullSizeImgCtrl..");
            $scope.$on('$ionicView.beforeEnter', function() {
                $log.debug("analytics worked for mobile on FullSizeImgCtrl..");
                analytics.trackView('PostDetails');
            });
        }
        else{
            $log.debug("fullsize screen");
            ga('send', 'pageview', {
                'page': '/PostDetails',
                'title': 'PostDetails'
            });
        }
        $scope.loading = true;
        $scope.fullsizeimageId = $stateParams.imageid ;
        $rootScope.zoomImagePage = false;
        $scope.commentClick = $localstorage.get('commentClickedChk');
        $scope.loadingWheel = function() {
            $ionicLoading.show({
                template: '<ion-spinner icon="circles"/>'
            });
        };
        $scope.loadingWheel();
        function setTabClass() {
           angular.element(document.querySelector("#tabHome")).removeClass("active");
           angular.element(document.querySelector("#tabSearch")).removeClass("active");
           angular.element(document.querySelector("#tabMyprofile")).removeClass("active");
           angular.element(document.querySelector("#tabCamera")).removeClass("active");
           angular.element(document.querySelector("#tabUpload")).removeClass("active");
        };
        setTabClass();
        $scope.errorPopup = function(msg) {
            $ionicPopup.alert({
                title: 'Error',
                template: msg,
                okType: ' button-upload' 
            });
        };
        var fsc = this;
        fsc.MyId = $localstorage.get('sessionMyID');
        $log.debug("MyId in userProfile controller: "+fsc.MyId);
        $scope.showPara = true;
        $localstorage.set('CurrentPage',$state.current.name);
        $localstorage.set('FromPage','app/fullsizeimage/'+$scope.fullsizeimageId);
        $log.debug("Image ID: " +$rootScope.sessionImageID);
        fsc.like='';
        fsc.MyId;
        if ((typeof $localstorage.get('sessionMyID'))=== 'undefined') {
           fsc.MyId='';
        }
        else{
            fsc.MyId=$localstorage.get('sessionMyID');
        }
        fsc.getImage = function(){                  
            fsc.image = {
                    postID	:$scope.fullsizeimageId,
                    userID:fsc.MyId
            };
//          $log.debug("I recieve POST ID : " + fsc.image.postID);
//          $log.debug("I recieve USER ID : " + fsc.image.userID);              
            FullImgService.getImage(fsc.image).then(function (response) {
                fsc.ImgDetails = response.data;
                var dateStr = new Date(response.data.uploadDate);
                var dateToShow = CommonServiceDate.getPostDate(dateStr);
                response.data.uploadDate = dateToShow;
                
                
                $scope.likesCount = fsc.ImgDetails.cntLikes;
                $scope.commentsCount = fsc.ImgDetails.cntComments;
                $scope.shareimagePathHigh = fsc.ImgDetails.imagePathHigh;
                if(!fsc.ImgDetails.des)
                {
                    $scope.showPara = false;
                }
                $log.debug("fsc.ImgDetails", fsc.ImgDetails);
                fsc.like=fsc.ImgDetails.liked;
                $log.debug('imgDetails userID: ',fsc.ImgDetails.uid);
                fsc.likeClr();
//                $timeout(callAtTimeout, 10000);
//                function callAtTimeout() 
//                {
                    $scope.loading = false;
                    $ionicLoading.hide();
//                }
            },
            function (error) {
                $scope.msg = "Oops! Something went wrong. Our team will look into this issue.";
                $scope.errorPopup($scope.msg);
                $scope.loading = false;
                $ionicLoading.hide();
                $log.debug("Error comments", error);
            });

	};
        fsc.loginPopup = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Login',
                //template: 'Are you sure you want to delete this Post?',
                templateUrl:'PopUps/LoginPopUp.html',
                cssClass: '', // String, The custom CSS class name
                cancelText: '', // String (default: 'Cancel'). The text of the Cancel button.
                cancelType: '',//'button button-small button-default', // String (default: 'button-default'). The type of the Cancel button.
                okText: '', // String (default: 'OK'). The text of the OK button.
                okType: ' button-upload' // String (default: 'button-positive'). The type of the OK button.
            });
            confirmPopup.then(function(res) {
                if(res) {
                    $log.debug('You are sure');
                    $location.path('app/login');
                } else {
                    $log.debug('You are not sure');
                }
            });
        };                  
        //like
        fsc.likeClr=function(){
            if(fsc.like===true)
            {
               fsc.color="red";
            }
            else{
                fsc.color="#444";
            }
            return(fsc.color);
        };
        fsc.ClickedLiked=function(){         
            $scope.loadingLike = true;
            $log.debug("fsc.ImgDetails.cntLikes"+ fsc.ImgDetails.cntLikes);
            if ($localstorage.get('sessionMyID')) {
                $scope.loadingWheel();
                fsc.image = {
//			postID	:$rootScope.sessionImageID,
			postID	:$scope.fullsizeimageId,															// begining of response set used for scroll down
//			userID:$rootScope.sessionMyID//'55041c5ec20ec607edaf7729',
                        userID:$localstorage.get('sessionMyID')//'55041c5ec20ec607edaf7729'												// tagName used for filtering the response on toggle click
		};
                if (fsc.like) 
                {
                    //callunlike
                    //alert('called unlike');
                    FullImgService.unlikeClicked(fsc.image).then(function (response) {
                        fsc.like=false;
                        fsc.likeClr();
                        $scope.likesCount = $scope.likesCount - 1;
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
                    //alert('called like');
                    FullImgService.likeClicked(fsc.image).then(function (response) {
                    fsc.like=true;
                    fsc.likeClr();
                        $scope.likesCount = $scope.likesCount + 1;
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
            else{
                $log.debug('inside else of ClickedLiked())');
                fsc.loginPopup();
            }
        };       
        fsc.getCommentClickedImageId = function(imageid)
        {
            $log.debug("Comment clicked image id: " +imageid);
            $localstorage.set('sessionCommentClickedImageID',imageid);
        };
             
        //facebook
        $scope.sharePopup = function() {
            $ionicPopup.alert({
                title: 'Success',
                template: 'This post has been shared on your Facebook page',
                okType: ' button-upload'
            });
        };
        
        fsc.gotoZoom = function()
        {
            $log.debug("gotoZoom");
//          $rootScope.imageToZoom = $scope.shareimagePathHigh;
            $localstorage.set('imageToZoom',$scope.shareimagePathHigh);
            $rootScope.controlzoom = localStorage.getItem("controlZoom");
//            alert($rootScope.controlzoom);
            if($rootScope.controlzoom === 'zoomImageController')
            $location.path('app/zoomImage');
            if($rootScope.controlzoom === 'ZoomDesktopController')
            $location.path('app/ZoomDesktop');
        };        
        fsc.posts = 
        {
//            postID : $rootScope.sessionCommentClickedImageID
              postID : $scope.fullsizeimageId
        };
        $log.debug("post you commented on: " + fsc.posts.postID);
//        $scope.var={};
        fsc.PostsResult=[];
        $log.debug("called");
        commentsService.comments(fsc.posts).then(function (response) {
            fsc.PostsResult = response.data;
            $scope.msg=fsc.PostsResult.msg;
            if(!$scope.msg)
            {
                for (var i = 0; i < response.data.length; i++) {
                    var dateStr = new Date(response.data[i].commentDate);
                    var dateToShow = CommonServiceDate.getPostDate(dateStr);
                    response.data[i].uploadDate = dateToShow;
                }
            }
            if($scope.commentClick === 'true')
            {
//                $scope.commentClickChk = true;
//                $scope.$on('$ionicView.afterEnter', function(){
//                    $ionicScrollDelegate.scrollBottom(true);
//                });
//                 $timeout(function(){
                    $ionicScrollDelegate.scrollBottom(true);
//                });
            }
            $scope.loading = false;
            $ionicLoading.hide();
            $log.debug("comments", fsc.PostsResult);
            $log.debug("$scope.msg",$scope.msg);
        },
        function (error) {
            $scope.msg = "Oops! Something went wrong. Our team will look into this issue.";
            $scope.errorPopup($scope.msg);
            $scope.loading = false;
            $ionicLoading.hide();
            $log.debug("Error comments", error);
         });
        
        fsc.getComments = function(){
                $scope.loadingWheel();
                $log.debug("inside comments page : " +$scope.fullsizeimageId);
                fsc.posts = 
                        {
                            postID : $scope.fullsizeimageId
                        };
		$log.debug("I recieve POST ID : " + $scope.fullsizeimageId);

            commentsService.comments(fsc.posts).then(function (response) {
                fsc.PostsResult = response.data;
                $scope.msg=fsc.PostsResult.msg;
                if(!$scope.msg)
                {
                    for (var i = 0; i < response.data.length; i++) {
                        var dateStr = new Date(response.data[i].commentDate);
                        var dateToShow = CommonServiceDate.getPostDate(dateStr);
                        response.data[i].uploadDate = dateToShow;
                    }
                }
    //            $ionicScrollDelegate.scrollTop();
                $ionicScrollDelegate.scrollBottom();
                $scope.loading = false;
                $ionicLoading.hide();
                $log.debug("comments", fsc.PostsResult);
            },
            function (error) {
                $scope.msg = "Oops! Something went wrong. Our team will look into this issue.";
                $scope.errorPopup($scope.msg);
                $scope.loading = false;
                $ionicLoading.hide();
                $log.debug("Error comments", error);
             });
	};       
        fsc.postComment = function(){
            $log.debug("post comment");
            var MyID=$localstorage.get('sessionMyID');
            if(!MyID)
            {
                $scope.loginPopup();
            }
            else
            {
                $scope.loadingWheel();
                fsc.posts.postID = $scope.fullsizeimageId;
                fsc.posts.userID = $localstorage.get('sessionMyID');
                fsc.posts.comment = fsc.comment;

                $log.debug("POST ID : " + fsc.posts.postID);
                $log.debug("USER ID : " + fsc.posts.userID);
                $log.debug("Comments : " + fsc.posts.comment);
                if(!fsc.posts.comment)
                {
                    $scope.errorPopup("Comment required.");
                    $scope.loading = false;
                    $ionicLoading.hide();
                }
                else
                {
                    commentsService.PostcommentService(fsc.posts).then(function (response) {
                        fsc.PostsResult = response.data;
                        $scope.commentsCount = $scope.commentsCount + 1;
                        $scope.loading = false;
    //            $ionicLoading.hide();
                        $log.debug("comments", fsc.PostsResult);
                        fsc.getComments();
                        fsc.comment = "";
                    },
                    function (error) {
                        $scope.msg = "Oops! Something went wrong. Our team will look into this issue.";
                        $scope.errorPopup($scope.msg);
                        $scope.loading = false;
                        $ionicLoading.hide();
                        $log.debug("Error comments", error);
                    });
                }
            }
	};
    }]);
