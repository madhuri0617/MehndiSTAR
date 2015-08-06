angular.module('Services')
.service('cameraUploadService', function ($http,$log) {
    this.uploadCameraImage = function (PostData) {
        $log.debug(" uploadCameraImage PostData", PostData);            
        return $http.post(baseURL +'/apiCamera/photoCamera', PostData).then(function (response) {
            return response;
        });       
    };
});