/*  Profile page template */
app.controller('ProfileCtrl', ['$ionicActionSheet', '$scope', '$stateParams', 'camera', 'userService',
    function profileCtrl($ionicActionSheet, $scope, $stateParams, camera, userService) {

        $scope.currentUser = userService.getCurrentUser();
        console.log("currentUser: ", $scope.currentUser);

        userService.getUser($stateParams.userId)
            .then(function gotUser(user) {
                $scope.user = user;
            });

        //This can only be done when you are editing your profile.
        $scope.uploadPhoto = function uploadPhoto() {
            var hideSheet = $ionicActionSheet.show({
                 buttons: [
                   { text: '<span class="icon ion-camera"></span>Take Photo from Camera' },
                   { text: '<span class="icon ion-images"></span>Upload Photo from Album' }
                 ],
                 titleText: 'Upload Profile Picture',
                 cancelText: 'Cancel',
                 buttonClicked: function(index) {
                     if (index === 0) {
                         takePhotoFromDevice('camera');
                     }
                     else if (index === 1) {
                         takePhotoFromDevice('library');
                     }
                     return true;
                 }
            });
        };

        function takePhotoFromDevice(source) {
            var options = {
                quality : 75,
                destinationType : Camera.DestinationType.DATA_URL,
                allowEdit : true,
                targetWidth: 500,
                targetHeight: 500,
                saveToPhotoAlbum: false
            };
            if (source === 'camera') {
                options.sourceType = Camera.PictureSourceType.CAMERA;
                options.encodingType = Camera.EncodingType.JPEG;
            }
            else if (source === 'library') {
                options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
            }
            else {
                //we do nothing if there is no source.
                return false;
            }
            camera.getPicture(options).then(function(imageData) {
                $scope.currentUser.picData = imageData;
                $scope.currentUser.$save().then(function(userObj) {
                    $scope.user = $scope.currentUser;
                    $scope.$apply();
                });
            }, function err(error) {
                console.log(error);
            });
        }

    }
]);
