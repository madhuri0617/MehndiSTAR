angular.module('Services')
.service('MyProfileService',function($http,$log){
    this.getOwnInfo = function (PostData) {
        $log.debug("getOwnInfo sendData", PostData);
        return $http({
            method: 'POST',
            data: PostData,
            url: baseURL + '/userHome'
        });
    };
    this.getOwnPost = function (PostData) {
        $log.debug("", PostData);
        return $http({
            method: 'POST',
            data: PostData,
            url: baseURL + '/userHome/post'
        });
    };
    this.getOwnLike = function (PostData) {
        $log.debug(" PostData", PostData);
        return $http({
            method: 'POST',
            data: PostData,
            url: baseURL + '/userHome/like'
        });
    };          
});


