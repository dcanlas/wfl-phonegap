// login page of app //
app.controller('LoginCtrl', ['$state', '$scope', '$cordovaToast', 'authService', 'firebaseMain', 'userService',
    function($state, $scope, $cordovaToast, authService, firebaseMain, userService) {

        $scope.credentials = {
            email: "",
            password: ""
        };

        // add your login logic here
        $scope.doLogin = function doLogin() {
            authService.authenticate($scope.credentials.email, $scope.credentials.password)
                .then(function success(authData) {
                    console.log("login success: ", authData.uid);
                    $state.go('dashboard.messages');
                }, function err(error) {
                    console.log("can't login ", error);
                    $cordovaToast.showLongBottom(error.message);
                });

        };

        $scope.doFbLogin = function doFbLogin() {
            authService.authenticateFb().then(function success(authData) {
                if (authData && authData.uid) {
                    $state.go('dashboard.messages');
                }
            }, function err(error) {
               $cordovaToast.showLongBottom("Error in fb login", error);
            });
        };

        //Todo: we probably don't need this later but it is nice for testing
        $scope.doLogout = function doLogout() {
            authService.logout();
        }
    }
]);