angular.module('Services')
.service('feedBackService',function($http,$log){
    this.submitFeedback = function (PostData) {
        $log.debug(" deatils PostData", PostData);
        return $http({
            method: 'POST',
            data: PostData,
//            url:'http://192.168.2.135:8181/send'
            url: baseURL + '/send'
        });
    };           
});

