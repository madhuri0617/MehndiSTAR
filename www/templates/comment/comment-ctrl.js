    angular.module('starter.controllers')
    .controller('CommentCtrl', ['$http','$scope','$rootScope','commentsService','$localStorage','$ionicLoading','$ionicScrollDelegate','$localstorage','$ionicPopup','$log', function CommentCtrl($http,$scope,$rootScope,commentsService,$localStorage,$ionicLoading,$ionicScrollDelegate,$localstorage,$ionicPopup,$log) {
        $scope.loading = true;
//        $localstorage.set('zoomImagePage',false);
        $scope.loadingWheel = function() {
            $ionicLoading.show({
                template: '<ion-spinner icon="circles"/>'
            });
        };
         $localstorage.set('FromPage','app/comment');
            $scope.errorPopup = function() {
                $ionicPopup.alert({
                    title: 'Error',
                    template: 'Write Comment..',
                    okType: ' button-upload'
                });
            };
//        if($rootScope.commentCount>0)
        if ($localstorage.get('commentCount') > 0)
        {
            $scope.loadingWheel();
        }
        var cmt = this;
        
        cmt.posts = 
        {
//            postID : $rootScope.sessionCommentClickedImageID
              postID : $localstorage.get('sessionCommentClickedImageID')
        };
        $log.debug("post you commented on: " + cmt.posts.postID)
//        $scope.var={};
        cmt.PostsResult=[];
        $log.debug("called");
        commentsService.comments(cmt.posts).then(function (response) {
            cmt.PostsResult = response.data;
            $scope.loading = false;
            $ionicLoading.hide();
            $log.debug("comments", cmt.PostsResult);
        },
        function (error) {
            $log.debug("Error comments", error);
         });
        
        	cmt.getComments = function(){
                    $scope.loadingWheel();
                    $log.debug("inside comments page : " +$localstorage.get('sessionCommentClickedImageID'))
                    cmt.posts = 
                            {
                                postID : $localstorage.get('sessionCommentClickedImageID')
                            };
		$log.debug("I recieve POST ID : " + $localstorage.get('sessionCommentClickedImageID'));

        commentsService.comments(cmt.posts).then(function (response) {
            cmt.PostsResult = response.data;
            $ionicScrollDelegate.scrollTop();
            $scope.loading = false;
            $ionicLoading.hide();
            $log.debug("comments", cmt.PostsResult);
        },
        function (error) {
            $log.debug("Error comments", error);
         });

	};       
        cmt.postComment = function(){
                    $scope.loadingWheel();
                    cmt.posts.postID = $localstorage.get('sessionCommentClickedImageID');
                    cmt.posts.userID = $localstorage.get('sessionMyID');
                    cmt.posts.comment = cmt.comment;
                    
		$log.debug("POST ID : " + cmt.posts.postID);
		$log.debug("USER ID : " + cmt.posts.userID);
		$log.debug("Comments : " + cmt.posts.comment);
        if(!cmt.posts.comment)
        {
            $scope.errorPopup();
            $scope.loading = false;
            $ionicLoading.hide();
        }
        else
        {
            commentsService.PostcommentService(cmt.posts).then(function (response) {
                    cmt.PostsResult = response.data;
                    $scope.loading = false;
//            $ionicLoading.hide();
                    $log.debug("comments", cmt.PostsResult);
                    cmt.getComments();
                    cmt.comment = "";
                },
                function (error) {
                    $log.debug("Error comments", error);
                });
        }
	};

}]);