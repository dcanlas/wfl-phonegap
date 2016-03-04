// Sign up page of app //
app.controller('SignUpCtrl', ['$state', '$scope', 'firebaseMain', function($state, $scope, firebaseMain) {
    // sign up logic here
    $scope.credentials = {
        name: "",
        email: "",
        password: ""
    };

    $scope.doRegister = function() {
        //comment this because we don't want this anymore
        //$state.go('app.features');
        firebaseMain.ref.createUser({
            email: $scope.credentials.email,
            password: $scope.credentials.password
        }, function (error, userData) {
            if (error) {
                console.log("Error creating user: ", error);
            }
            else {
                console.log("Successfully created user account with uid: ", userData.uid);
            }
        })
    };
}]);