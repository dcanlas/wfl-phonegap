// Sign up page of app //
app.controller('SignUpCtrl', ['$state', '$scope', '$cordovaToast', 'firebaseMain', 'userService',
    function ($state, $scope, $cordovaToast, firebaseMain, userService) {
        // sign up logic here
        $scope.credentials = {
            name: "",
            email: "",
            password: ""
        };

        $scope.doRegister = function () {
            //comment this because we don't want this anymore
            //$state.go('app.features');
            firebaseMain.ref.createUser({
                email: $scope.credentials.email,
                password: $scope.credentials.password
            }).then(function success(userData) {
                console.log("Successfully created user account with uid: ", userData.uid);
                var myUser = userService.createUser(userData.uid, $scope.credentials.name, $scope.credentials.email);
                userService.saveUser(myUser)
                    .then(function(user) {
                        console.log('save user success');
                        $state.go('login');
                        $cordovaToast.showLongBottom("Registration successful!");
                    }, function err(error) {
                        console.log(error);
                        $cordovaToast.showLongBottom("Error saving user data");
                    });
            }, function err(error) {
                console.log("Error creating user: ", error);
                $cordovaToast.showLongBottom("Error signing up");
            });
        };
    }
]);