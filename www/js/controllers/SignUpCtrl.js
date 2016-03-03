// Sign up page of app //
app.controller('SignUpCtrl', ['$state','$scope', function($state, $scope) {
    // sign up logic here
    $scope.doRegister = function(){
        $state.go('app.features');
    };
}]);