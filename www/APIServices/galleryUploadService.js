angular.module('Services')
.service('galleryUploadService', function ($http,$log) {

    this.uploadImage = function (PostData) {
        $log.debug(" uploadImage PostData", PostData);            
        return $http.post( baseURL + '/api/photo', PostData, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(function (response) {
            return response;
        });

//            return $http.post(baseURL + '/api/photo', PostData).then(function (response) {
////            return $http.post('http://192.168.2.135:3000/apiCamera/photoCamera', PostData).then(function (response) {
//                return response;
//            });
    };
});


