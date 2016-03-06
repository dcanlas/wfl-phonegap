// login page of app //
app.controller('LoginCtrl', ['$state', '$scope', '$cordovaFacebook', '$cordovaToast', 'firebaseMain', 'userService',
    function($state, $scope, $cordovaFacebook, $cordovaToast, firebaseMain, userService) {

        $scope.credentials = {
            email: "",
            password: ""
        };

        // add your login logic here
        $scope.doLogin = function() {
            firebaseMain.ref.authWithPassword({
                email: $scope.credentials.email,
                password: $scope.credentials.password
            }).then(function success(authData) {
                console.log("login success: ", authData.uid);
                userService.getUser(authData.uid)
                    .then(function (user) {
                        userService.currentUser = user;
                        $state.go('app.features');
                    }, function err(error) {
                        console.log("can't get user data: ", error);
                    });
            }, function err(error) {
                console.log("can't login ", error);
                $cordovaToast.showLongBottom(error.message);
            });

        };
    }
]);