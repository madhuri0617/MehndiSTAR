angular.module('Services')
.service('EditDpService', function ($http,$log) {
    this.uploadDp = function (PostData) {
        $log.debug(" uploadImage PostData", PostData);               
        return $http.post( baseURL + '/profilePic/update', PostData, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(function (response) {
            return response;
        });
    };
    this.uploadDpCamera = function (PostData) {
            $log.debug(" uploadDpCamera PostData"+ PostData);               
            return $http.post(baseURL + '/profilePicCamera/updateCamera', PostData).then(function (response) {
                return response;
            });
    };
});





