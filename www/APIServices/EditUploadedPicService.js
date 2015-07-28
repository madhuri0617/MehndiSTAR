angular.module('Services')
.service('EditUploadedPicService',function($http,$log){
    this.getPostDetail = function (PostData) {
        $log.debug(" deatils PostData", PostData);
        return $http({
            method: 'POST',
            data: PostData,
            url: baseURL + '/editPic'
        });
    };
    this.updatePostDetail = function (PostData) {
        $log.debug("", PostData);
        return $http({
            method: 'POST',
            data: PostData,
            url: baseURL + '/editPic/update'
        });
    };      
});


