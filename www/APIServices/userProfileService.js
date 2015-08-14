angular.module('Services')
.service('userProfileService',function($http,$log){
    this.getUserInfo = function (PostData) {
        $log.debug("getOwnInfo sendData", PostData);
        return $http({
            method: 'POST',
            data: PostData,
            url: baseURL + '/userProfile'
        });
    };
    this.getUserPost = function (PostData) {
        $log.debug("postdata of getUserPosts: ", PostData);
        return $http({
            method: 'POST',
            data: PostData,
            url: baseURL + '/userProfile/post'
        });
    };
    this.getUserLike = function (PostData) {
        $log.debug(" PostData", PostData);
        return $http({
            method: 'POST',
            data: PostData,
            url: baseURL + '/userProfile/like'
        });
    };         
});


