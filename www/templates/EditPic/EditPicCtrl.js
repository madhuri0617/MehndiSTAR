 angular.module('starter.controllers')
.controller('EditPicCtrl', ['$http','$scope','$rootScope','$location','EditUploadedPicService','$ionicLoading','$ionicScrollDelegate','$ionicPopup','$localstorage','$log', function EditPicCtrl($http,$scope,$rootScope,$location,EditUploadedPicService,$ionicLoading,$ionicScrollDelegate,$ionicPopup,$localstorage,$log) {  
    $scope.apk = localStorage.getItem("MehndiSTARapk");
    $log.debug("apk: "+$scope.apk);
    if($scope.apk === 'true')
    {
        $log.debug("apk on EditPicCtrl..");
        $scope.$on('$ionicView.beforeEnter', function() {
            $log.debug("analytics worked for mobile on EditPicCtrl..");
            analytics.trackView('Edit Pic');
        });
    }
//    else{
//            $log.debug("EditPic screen");
//            ga('send', 'screenview', {'screenName': 'EditPic'});
//        }
    $scope.loginPopup = function() {
        var alertPopup = $ionicPopup.alert({
          title: 'Login',
          //template: 'Are you sure you want to delete this Post?',
          templateUrl:'PopUps/LoginPopUp.html',
          cssClass: '', // String, The custom CSS class name
          cancelText: '', // String (default: 'Cancel'). The text of the Cancel button.
          cancelType: '',//'button button-small button-default', // String (default: 'button-default'). The type of the Cancel button.
          okText: '', // String (default: 'OK'). The text of the OK button.
          okType: ' button-upload' // String (default: 'button-positive'). The type of the OK button.
        });
        alertPopup.then(function(res) {
          if(res) {
            $log.debug('You are sure');
            angular.element(document.querySelector("#tabMyprofile")).addClass("active");
            angular.element(document.querySelector("#tabUpload")).removeClass("active");
            angular.element(document.querySelector("#tabCamera")).removeClass("active");
            angular.element(document.querySelector("#tabSearch")).removeClass("active");
            angular.element(document.querySelector("#tabHome")).removeClass("active");
            $location.path('app/login');

          } else {
            $log.debug('You are not sure');
          }
        });
    };
//    $localstorage.set('FromPage','app/EditUploadedPicDetails');
    $scope.MyID=$localstorage.get('sessionMyID');
    $scope.imageID = $localstorage.get('sessionImageID');
    if(!$scope.MyID)
    {
        $scope.loginPopup();
//        angular.element(document.querySelector("#tabHome")).removeClass("active");
    }
    else if(!$scope.imageID)
    {
        $location.path('app/MyProfile/posts');
    }
    else
    {
    $scope.loading = true;
//        $localstorage.set('zoomImagePage',false);
    $scope.loadingWheel = function() {
        $ionicLoading.show({
            template: '<ion-spinner icon="circles"/>'
        });
    };
    $scope.mobile = localStorage.getItem("mobile");
    $localstorage.set('FromPage','app/EditUploadedPicDetails');
    $scope.loadingWheel();
    $scope.uploadPopup = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Success',
            template: 'Details updated for this post.',
            okType: ' button-upload'
        });
        alertPopup.then(function(res) {
            $scope.fileUpload = "";
            $location.path('app/MyProfile/posts');
        });
    };
    $scope.errorPopup = function(msg) {
      $ionicPopup.alert({
            title: 'Error',
            template: msg,
            okType: ' button-upload' 
        });
    };
    function setTabClass() {
        angular.element(document.querySelector("#tabMyprofile")).removeClass("active");
    };
    setTabClass();
    $scope.check = function(tag)
    {
        $log.debug("inside check" , tag);
        if(tag.checked===false)
        {
            tag.checked = true;
        }
        else if(tag.checked=== true)
        {
            tag.checked = false;
        }
    };
    $scope.toggleGroup = function(group) {
        $log.debug("inside toggleGroup" );
        if ($scope.isGroupShown(group)) {
          $scope.shownGroup = null;
        } else {
          $scope.shownGroup = group;
        }
    };
    $scope.toggleGroup1 = function(group) {
        $log.debug("inside toggleGroup" );
        if ($scope.isGroupShown(group)=== true) {
          $scope.shownGroup = null;
        }
    };
    $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
    };
    var epc = this;
    $log.debug('on edit pic: imgid ',$localstorage.get('sessionImageID'));
    epc.Post=[];
    epc.tagFinal=[];
    epc.tags=[];
    epc.newDes='';
    epc.tagsDB=[{name:"Hand Design",checked:false},{name: "Feet Design",checked:false},
        {name:"Indian",checked:false},{name:"Pakistani",checked:false},{name:"Moghlai",checked:false},
        {name:"Arabic",checked:false},
        {name:"Indo-Arabic",checked:false},{name:"Bridal",checked:false},{name:"Common",checked:false}];
    // epc.tags=[];
    epc.image = {
            postID:$localstorage.get('sessionImageID')												// tagName used for filtering the response on toggle click
    };
    epc.getPostDetail = function(){
        $log.debug('img details',epc.image);
        $log.debug('inside get post details...');
        EditUploadedPicService.getPostDetail(epc.image).then(function (response) {
            epc.Post = response.data;
            $scope.loading = false;
            $ionicLoading.hide();
            $log.debug('epc.post result:',epc.Post);
            $log.debug('epc.Post.tags:',epc.Post[0].tags);
            epc.tags = epc.Post[0].tags;
            $log.debug('epc.tags: inside getpostdetails',epc.tags);
            for(var i=0;i<epc.tagsDB.length;i++)
            {
                for(var j=0;j<epc.tags.length;j++)
                {

                    if(epc.tagsDB[i].name===epc.tags[j])
                        epc.tagsDB[i].checked=true;
                }
            }
            epc.newDes=epc.Post[0].description;
            $log.debug('des:',epc.newDes);
            },
            function (error) {
                $scope.msg = "Oops! Something went wrong. Our team will look into this issue.";
                $scope.errorPopup($scope.msg);
                $scope.loading = false;
                $ionicLoading.hide();
                $log.debug("Error in getPostDetail", error);
            });
    };       
    $log.debug('epc.tags:',epc.tags);
    epc.submit=function()
    {
        $scope.loadingWheel();
        $ionicScrollDelegate.scrollTop();
        $log.debug("inside submit");
        var flag=false;
       // var tagFinal=[];
        for (var i = 0; i < epc.tagsDB.length; i++) {
            if(epc.tagsDB[i].checked)
            {
                epc.tagFinal.push(epc.tagsDB[i].name);
                if(epc.tagsDB[i].name==='Common')
                    flag=true;
            }              
        }
        if(!flag){
            epc.tagFinal.push('Common');
        }       
        epc.FinalChange=
            {tags:epc.tagFinal,
             des:epc.newDes};   
        epc.updatePostDetail = function(){
		epc.PostDetails = {
//                        postID:$rootScope.sessionImageID,
                        postID:$localstorage.get('sessionImageID'),
			description :epc.newDes ,
			tags : epc.tagFinal
		};
                $log.debug('update:',epc.PostDetails);
                EditUploadedPicService.updatePostDetail(epc.PostDetails).then(function (response) {
                    $log.debug(response.data);
                        if (response.data==="success") {
                            $scope.uploadPopup();
                            $scope.toggleGroup1(5);
                            $scope.loading = false;
                            $ionicLoading.hide();
                    }
                    
                },
                function (error) {
                    $scope.msg = "Oops! Something went wrong. Our team will look into this issue.";
                    $scope.errorPopup($scope.msg);
                    $scope.loading = false;
                    $ionicLoading.hide();
                    $log.debug("Error in updatePostDetail", error);
                 });	
	};    
        epc.updatePostDetail();
    };
    }
}]);