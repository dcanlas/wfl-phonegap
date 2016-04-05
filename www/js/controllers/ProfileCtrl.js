/*  Profile page template */
app.controller('ProfileCtrl', ['$scope', '$stateParams', 'camera', 'userService',
    function profileCtrl($scope, $stateParams, camera, userService) {

        $scope.currentUser = userService.getCurrentUser();
        console.log("currentUser: ", $scope.currentUser);

        userService.getUser($stateParams.userId)
            .then(function gotUser(user) {
                console.log("the user: ", user);
                $scope.user = user;
            });

        //This can only be done when you are editing your profile.
        $scope.takePhoto = function takePhoto() {
            var options = {
                quality : 75,
                destinationType : Camera.DestinationType.DATA_URL,
                sourceType : Camera.PictureSourceType.CAMERA,
                allowEdit : true,
                encodingType: Camera.EncodingType.JPEG,
                popoverOptions: CameraPopoverOptions,
                targetWidth: 500,
                targetHeight: 500,
                saveToPhotoAlbum: false
            };
            camera.getPicture(options).then(function(imageData) {
                $scope.currentUser.picData = imageData;
                $scope.currentUser.$save().then(function() {
                    $scope.$apply();
                });
            }, function err(error) {
                console.log(error);
            });
        }

    }
]);
