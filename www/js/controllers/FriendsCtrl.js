/* Friends controller */
app.controller('FriendsCtrl', ['$scope', 'Friends', function($scope, Friends) {
    $scope.items = [];
    $scope.times = 0 ;
    $scope.postsCompleted = false;
    // load more content function
    $scope.getPosts = function(){
        Friends.getFriends()
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

    $scope.addFriend = function addFriend() {
        return false;
    };
}]);