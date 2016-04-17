/*  Profile page template */
app.controller('ProfileCtrl', ['_', 'moment', '$cordovaToast', '$ionicActionSheet', '$scope', '$stateParams', 'camera', 'foodIcons', 'foodManager', 'userService',
    function profileCtrl(_, moment, $cordovaToast, $ionicActionSheet, $scope, $stateParams, camera, foodIcons, foodManager, userService) {

        $scope.currentUser = userService.getCurrentUser();
        var userFriends = userService.getCurrentUserFriends(),
            foodLog = foodManager.getUserFoodLog($stateParams.userId);

        //foodIcons stuff
        $scope.foodSize = foodIcons.foodSize

        //setting the user
        userService.getUser($stateParams.userId)
            .then(function gotUser(user) {
                $scope.user = user;
                $scope.alreadyFriend = _.find(userFriends, function(friend) {
                    return friend.$id === user.id;
                });
            });

        //processing food log
        foodLog.$loaded(function() {
            $scope.foodLog = _.chain(foodLog.reverse())
                .each(function (item) {
                    var mom = moment(item.date);
                    item.day = mom.format('MM/DD');
                    item.time = mom.format('h A');
                })
                .groupBy('day').value();
            console.log("foods ", $scope.foodLog);
        });

        //This can be done if you are looking at others profile
        $scope.addFriend = function addFriend(friend) {
            return userService.addFriendToUser(friend)
                .then(function success() {
                    $scope.alreadyFriend = true;
                    $scope.$apply();
                    $cordovaToast.showLongBottom("Friend added.");
                }, function err(error) {
                    console.log("add failed ", error);
                });
        };

        $scope.removeFriend = function removeFriend(friend) {
            return userService.removeFriendFromUser(friend)
                .then(function success() {
                    $scope.alreadyFriend = false;
                    $scope.$apply();
                    $cordovaToast.showLongBottom("Friend removed.");
                }, function err(error) {
                    console.log("remove failed", error);
                });
        }

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
