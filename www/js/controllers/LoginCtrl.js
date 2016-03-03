// login page of app //
app.controller('LoginCtrl', ['$state','$scope', function($state, $scope) {
    // add your login logic here
    $scope.doLogin = function(){
        $state.go('app.features');
    };
}]);