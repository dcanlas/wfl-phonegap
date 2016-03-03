/*  Social Profile Controller */
app.controller('SocialProfileCtrl',['$scope','SocialData', function($scope,SocialData) {
    $scope.socials = SocialData.items;
}]);