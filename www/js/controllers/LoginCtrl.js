// login page of app //
app.controller('LoginCtrl', ['$state', '$scope', '$cordovaFacebook', '$cordovaToast', 'authService', 'firebaseMain', 'userService',
    function($state, $scope, $cordovaFacebook, $cordovaToast, authService, firebaseMain, userService) {

        $scope.credentials = {
            email: "",
            password: ""
        };

        // add your login logic here
        $scope.doLogin = function doLogin() {
            authService.authenticate($scope.credentials.email, $scope.credentials.password)
                .then(function success(authData) {
                    console.log("login success: ", authData.uid);
                    $state.go('app.features');
                }, function err(error) {
                    console.log("can't login ", error);
                    $cordovaToast.showLongBottom(error.message);
                });

        };

        //Todo: we probably don't need this later but it is nice for testing
        $scope.doLogout = function doLogout() {
            authService.logout();
        }
    }
]);