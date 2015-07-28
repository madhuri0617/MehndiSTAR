

angular.module('Services')
.service('commentsService', function ($http,$log) {
    this.comments = function (PostData) {
        $log.debug(" comments PostData", PostData);
        return $http({
            method: 'POST',
            data: PostData,
            url: baseURL + '/comments'			
        });
    };
    this.PostcommentService = function (PostData) {
        $log.debug(" Postcomment PostData", PostData);
        return $http({
            method: 'POST',
            data: PostData,
            url: baseURL + '/comments/post'			
        });
    };
});
