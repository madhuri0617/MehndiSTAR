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
 .controller('SearchDesignsController', function(filterFilter,$state,$ionicPopup,$location,$filter,$ionicLoading,$scope, DesignRetriever,searchService,$ionicScrollDelegate,$rootScope,$localstorage,FullImgService,CommonServiceDate,$log){
//$scope.loading = true;
    $scope.empty=true;
//    $scope.result = {};
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
    else{
            $log.debug("Search screen");
            ga('send', 'pageview', {
                'page': '/Search',
                'title': 'Search'
            });
        }
    $scope.errorPopup = function(msg) {
        $ionicPopup.alert({
          title: 'Error',
          template: msg,
          okType: ' button-upload' 
        });
    };
    $scope.tag = {
			beg : 0,																// begining of response set used for scroll down
			tagName : ["Common"],
                         userID : $scope.MyId 
	};
        searchService.search($scope.tag).then(function (response) {
            $scope.searchPosts = response.data;
            for (var i = 0; i < response.data.length; i++) {
                var dateStr = new Date(response.data[i].uploadDate);
                var dateToShow = CommonServiceDate.getPostDate(dateStr);
                response.data[i].uploadDate = dateToShow;
            }      
        },
        function (error) {
            $scope.msg = "Oops! Something went wrong. Our team will look into this issue.";
            $scope.errorPopup($scope.msg);
            $scope.loading = false;
            $ionicLoading.hide();
            $log.debug("Error in search", error);
        }); 
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
    $localstorage.set('CurrentPage',$state.current.name);
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
    });

    $scope.getdesigns = function(){
      return $scope.designs;
    };
    $scope.moredata = false;
    
    $scope.moredesigns = false; 
    $scope.loadMoreData=function()
    {
        $log.debug("inside loadmore");
        $scope.moredesigns = false;
        $log.debug("loadmoredata: " + $scope.results + " $scope.counter" + $scope.counter );
        $log.debug(" $scope.results.length: ",$scope.results.length,$scope.totalPosts);
        if($scope.totalPosts %2 === 0)
        {
            if($scope.results.length < $scope.totalPosts )
            {
                $log.debug("posts less than total posts");
                $scope.results.push($scope.dumy[$scope.counter]);
                $scope.results.push($scope.dumy[++$scope.counter]);
                $scope.counter += 1;   
            }
            $log.debug("$scope.results.length: ",$scope.results.length,$scope.totalPosts);
        }
        else
        {
            if($scope.results.length < $scope.totalPosts-1 )
            {
                $log.debug("posts less than total posts");
                $scope.results.push($scope.dumy[$scope.counter]);
                $scope.results.push($scope.dumy[++$scope.counter]);
                $scope.counter += 1;   
            }
            $log.debug($scope.counter);
            if($scope.results.length === $scope.totalPosts-1)
            {
                $log.debug("posts length is 1 less than total posts");
                $scope.results.push($scope.dumy[$scope.counter]);
            }
            $log.debug("$scope.results.length: ",$scope.results.length,$scope.totalPosts);
        }
        if($scope.results.length === $scope.totalPosts)
        {
            $log.debug("posts equals total posts");
            $scope.moredata=true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };
    $scope.doSomething = function(typedthings){
        $scope.empty = false;
        $scope.loading = false;
        $scope.moredata = false;
        $scope.dumy = [];
        $scope.results = [];
        $log.debug("Do something like reload data with this: " + typedthings );
        $scope.filteredArray = filterFilter($scope.searchPosts, $scope.result);
        $log.debug("$scope.filteredItems", $scope.filteredArray);
        $scope.dumy = $scope.filteredArray;
        $scope.counter = 0;
        $scope.totalPosts = $scope.filteredArray.length;
        if($scope.totalPosts>4)
        {
//            $scope.loading = false;
//            $scope.moredata = false;
            for( ; $scope.counter<4; $scope.counter++)
            {
                $scope.results.push($scope.dumy[$scope.counter]);
            }
            $log.debug("$scope.filteredArray",$scope.filteredArray);
        }
        else
        {
            $scope.results = $scope.filteredArray;
            $scope.moredata = true;
        }
    };

  $scope.doSomethingElse = function(suggestion){
     // $scope.loadingWheel();
        $log.debug("Suggestion selected: " + suggestion );
        $scope.empty = false;
        $scope.loading = false;
        $ionicScrollDelegate.scrollTop();
           
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


