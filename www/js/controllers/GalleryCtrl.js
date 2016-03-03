app.controller('GalleryCtrl', ['$scope', 'Photos', '$ionicModal', function($scope, Photos, $ionicModal) {

    $scope.items = [];
    $scope.times = 0 ;
    $scope.postsCompleted = false;
    // load more content function
    $scope.getPosts = function(){
        Photos.getPosts()
            .success(function (posts) {
                $scope.items = $scope.items.concat(posts);
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.times = $scope.times + 1;
                if($scope.times >= 4) {
                    $scope.postsCompleted = true;
                }
            })
            .error(function (error) {
                $scope.items = [];
            });
    };
    // pull to refresh buttons
    $scope.doRefresh = function(){
        $scope.times = 0 ;
        $scope.items = [];
        $scope.postsCompleted = false;
        $scope.getPosts();
        $scope.$broadcast('scroll.refreshComplete');
    };
    // modal to show image full screen
    $ionicModal.fromTemplateUrl('templates/image-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function () {
        $scope.showNav = true;
        $scope.modal.show();
    };

    $scope.closeModal = function () {
        $scope.modal.hide();
    };
    // show image in popup
    $scope.showImage = function (index) {
        $scope.imageIndex = index;
        $scope.imageSrc = $scope.items[index].image_full;
        $scope.openModal();
    };
    // image navigation // swiping and buttons will also work here
    $scope.imageNavigate = function(dir){
        if(dir == 'right'){
            $scope.imageIndex = $scope.imageIndex + 1;
        } else {
            $scope.imageIndex = $scope.imageIndex - 1;
        }
        //alert(dir);
        if($scope.items[$scope.imageIndex] === undefined){
            $scope.closeModal();
        } else {
            $scope.imageSrc = $scope.items[$scope.imageIndex].image_full;
        }
    };
    // cleaning modal
    $scope.$on('$stateChangeStart', function(){
        $scope.modal.remove();
    });
}]);