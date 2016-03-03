/* main controller function */
app.controller('MainCtrl', ['$scope', '$ionicSideMenuDelegate', '$ionicHistory', function($scope, $ionicSideMenuDelegate, $ionicHistory) {
    // Toggle left function for app sidebar
    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
    // go back to previous page
    $scope.goBackOne = function(){
        $ionicHistory.goBack();
    };
    // sharing plugin
    $scope.shareMain = function(){
        var title = "Download Smove For Android";
        var url = "https://play.google.com/store/apps/details?id=com.myspecialgames.swipe";
        window.plugins.socialsharing.share(title, null, null, url)
    };
    $scope.shareArticle = function(title,url){
        window.plugins.socialsharing.share(title, null, null, url)
    };
    $scope.openLinkArticle = function(url){
        window.open(url, '_system');
    };
}]);