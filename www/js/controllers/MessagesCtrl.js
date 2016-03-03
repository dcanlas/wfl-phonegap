// messages list
app.controller('MessagesCtrl', ['$scope', 'Messages', function($scope, Messages){
    $scope.items = [];
    $scope.postsCompleted = false;
    // load more content function
    $scope.getPosts = function(){
        Messages.getMesages()
            .success(function (posts) {
                $scope.items = $scope.items.concat(posts);
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.postsCompleted = true;
            })
            .error(function (error) {
                $scope.items = [];
            });
    };
    // pull to refresh buttons
    $scope.doRefresh = function(){
        $scope.items = [];
        $scope.postsCompleted = false;
        $scope.getPosts();
        $scope.$broadcast('scroll.refreshComplete');
    }
}]);