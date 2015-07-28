
angular.module('Services')
.service('FullImgService',function($http,$log){
    this.getImage = function (PostData) {
        $log.debug(" deatils PostData", PostData);
        return $http({
            method: 'POST',
            data: PostData,
            url: baseURL + '/clickImage'
        });
    };
    this.likeClicked = function (PostData) {
        $log.debug("", PostData);
        return $http({
            method: 'POST',
            data: PostData,
            url: baseURL + '/clickImage/likeClicked'
        });
    };
    this.unlikeClicked = function (PostData) {
        $log.debug(" deatils PostData", PostData);
        return $http({
            method: 'POST',
            data: PostData,
            url: baseURL + '/clickImage/unlikeClicked'
        });
    };           
});