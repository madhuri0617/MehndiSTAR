angular.module('starter.controllers')
/*========================================autocomplete==========================================*/
.factory('DesignRetriever', function($http, $q, $timeout){
    var DesignRetriever = new Object();
    DesignRetriever.getdesigns = function(i) {
        var designdata = $q.defer();
        var designs;
        var moreDesigns = ["Hand Design", "Feet Design","Indian","Pakistani","Moghlai","Arabic","Indo-Arabic","Bridal","Common"];
        if(i && i.indexOf('T')!==-1)
          designs=moreDesigns;
        else
          designs=moreDesigns;
        $timeout(function(){
          designdata.resolve(designs);
        },1000);
        return designdata.promise;
    };
    return DesignRetriever;
})
 .controller('SearchDesignsController', function($ionicPopup,$location,$filter,$ionicLoading,$scope, DesignRetriever,searchService,$ionicScrollDelegate,$rootScope,$localstorage,FullImgService,CommonServiceDate,$log){
//$scope.loading = true;
    $scope.empty=false;
    $scope.MyId = $localstorage.get('sessionMyID');
    $scope.apk = localStorage.getItem("MehndiSTARapk");
    $log.debug("apk: "+$scope.apk);
    if($scope.apk === 'true')
    {
        $log.debug("apk on SearchCtrl..");
        $scope.$on('$ionicView.beforeEnter', function() {
            $log.debug("analytics worked for mobile on SearchCtrl..");
            analytics.trackView('Search');
        });
    }
//    else{
//            $log.debug("Search screen");
//            ga('send', 'screenview', {'screenName': 'Search'});
//        }
    $scope.errorPopup = function(msg) {
        $ionicPopup.alert({
          title: 'Error',
          template: msg,
          okType: ' button-upload' 
        });
    };
    $log.debug("MyId in search controller: "+$scope.MyId);
    var tagsAvailable = [{name:"Hand Design"}, {name:"Feet Design"},
            {name:"Indian"},{name:"Pakistani"},{name:"Moghlai"},{name:"Arabic"},
            {name:"Indo-Arabic"},{name:"Bridal"},{name:"Common"}];
    $rootScope.zoomImagePage = false;
//        $localstorage.set('zoomImagePage',false);
    $scope.loadingWheel = function() {
        $ionicLoading.show({
            template: '<ion-spinner icon="circles"/>'
        });
    };
    $localstorage.set('FromPage','app/search');
    function setTabClass() {
       angular.element(document.querySelector("#tabSearch")).addClass("active");
       angular.element(document.querySelector("#tabHome")).removeClass("active");
       angular.element(document.querySelector("#tabMyprofile")).removeClass("active");
       angular.element(document.querySelector("#tabUpload")).removeClass("active");
       angular.element(document.querySelector("#tabCamera")).removeClass("active");
    };
    setTabClass();
    $scope.filterEvenStartFrom = function (index) {
        return function (item) {
            return index++ % 2 === 1;
        };
    };
        //$scope.loadingWheel();
    $scope.designs = DesignRetriever.getdesigns("...");
    $scope.designs.then(function(data){
        $scope.designs = data;
        $scope.searchPosts = {};
    });

    $scope.getdesigns = function(){
      return $scope.designs;
    };

    $scope.doSomething = function(typedthings){
        $log.debug("Do something like reload data with this: " + typedthings );
        $scope.newdesigns = DesignRetriever.getdesigns(typedthings);
        $scope.newdesigns.then(function(data){
            $scope.designs = data;
        });

        var myGreenObject = $filter('filter')(tagsAvailable, { name: typedthings });
            $log.debug(typedthings +": ",myGreenObject);

        if (myGreenObject.length!== 0){
            $scope.doSomethingElse(typedthings);
            $scope.empty = false;
            $scope.class="ng-hide";
        }
        if (myGreenObject.length === 0){
              $log.debug("empty result");
              $scope.empty = true;
              $scope.class="ng-show";
              $log.debug("empty", $scope.empty);
        }
    };

  $scope.doSomethingElse = function(suggestion){
     // $scope.loadingWheel();
        $log.debug("Suggestion selected: " + suggestion );
        $scope.tag = {
			beg : 0,																// begining of response set used for scroll down
			tagName : [suggestion],
                         userID : $scope.MyId 
	};
        searchService.search($scope.tag).then(function (response) {
            $scope.searchPosts = response.data;
            for (var i = 0; i < response.data.length; i++) {
                    var dateStr = new Date(response.data[i].uploadDate);
                    var dateToShow = CommonServiceDate.getPostDate(dateStr);
                    response.data[i].uploadDate = dateToShow;
            }
            $ionicScrollDelegate.scrollTop();
           // $scope.loading = false;
           // $ionicLoading.hide();
            if ($scope.searchPosts === 'SUCCESS') {
                    $scope.success = true;
                    $log.debug("Success" + $scope.success);
            }

            $log.debug("searched : ", $scope.searchPosts);
        },
        function (error) {
            $scope.msg = "Oops! Something went wrong. Our team will look into this issue.";
            $scope.errorPopup($scope.msg);
            $scope.loading = false;
            $ionicLoading.hide();
            $log.debug("Error in search", error);
        });     
    };
    $scope.getuserid = function(uid) {
            $localstorage.set('sessionUserID',uid);
            $location.path("app/userProfile/"+uid);
            $log.debug('userid:',uid);
    };
    $scope.ClickedLikedSearch = function (post){
        $log.debug("image like clicked ", post);
        var MyID=$localstorage.get('sessionMyID');

        $log.debug('inide checkLogin() myid:',MyID);
        $log.debug('inide checkLogin() $rootScope.sessionMyID:)',$rootScope.sessionMyID);

       if(!MyID)
       {
           $log.debug(" inside login");
           $scope.loginPopup();
       }
       else
       {
            var imgDetails = {
                     postID  : post._id,                        
                     userID:$localstorage.get('sessionMyID')//'55041c5ec20ec607edaf7729' 
            };
            if (post.liked) 
            {
                 //callunlike
                 //alert('called unlike');
                 $scope.loadingWheel();
                 FullImgService.unlikeClicked(imgDetails).then(function (response) {
                    post.liked=false;
                    post.cntLikes = post.cntLikes - 1;
                    $scope.loadingLike = false;
                    $ionicLoading.hide();
                 },
                 function (error) {
                    $scope.msg = "Oops! Something went wrong. Our team will look into this issue.";
                    $scope.errorPopup($scope.msg);
                    $scope.loading = false;
                    $ionicLoading.hide();
                     $log.debug("error in unlike", error);
                  });
            }
            else
            {
                $scope.loadingWheel();
                FullImgService.likeClicked(imgDetails).then(function (response) {
                    post.liked=true;
                    post.cntLikes = post.cntLikes + 1;
                    $scope.loadingLike = false;
                    $ionicLoading.hide();
                },
                function (error) {
                    $scope.msg = "Oops! Something went wrong. Our team will look into this issue.";
                    $scope.errorPopup($scope.msg);
                    $scope.loading = false;
                    $ionicLoading.hide();
                    $log.debug("error in like", error);
                 });
            }  
        }
    };
});


