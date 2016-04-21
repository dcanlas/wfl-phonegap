// single message
app.controller('MessageCtrl', ['_', 'moment', '$ionicScrollDelegate', '$firebaseObject', '$scope', '$stateParams', 'firebaseMain', 'foodIcons', 'messageService', 'userService', 'userAlertService',
    function messageCtrlFunction(_, moment, $ionicScrollDelegate, $firebaseObject, $scope, $stateParams, firebaseMain, foodIcons, messageService, userService, userAlertService){

        $scope.messages = [];
        $scope.postsCompleted = false; //this is for infinite scrolling later
        $scope.currentUser = userService.getCurrentUser();

        //get our friend object
        var friendRef = firebaseMain.userRef.child($stateParams.friendId);
        $scope.friendObj = $firebaseObject(friendRef);

        //Food grid related stuff
        $scope.foodIcons = foodIcons.getFoods();
        $scope.foodSize = foodIcons.foodSize;
        $scope.foodSelected = false;

        $scope.selectFood = function selectFood(item) {
            $scope.foodSelected = item;
        };

        // load more content function
        $scope.getMessages = function getMessages() {
            messageService.getMessagesWithFriend($stateParams.friendId)
                .then(function (data) {
                    $scope.messages = data.messages;
                    console.log('messages ', $scope.messages);
                    scrollHack();
                    //todo: paginate stuff later, we just pull all messages for now.
                    $scope.postsCompleted = true;
                })
                .then(function removeAlert() {
                    return userAlertService.removeAlert($scope.friendObj.id);
                });
        };

        $scope.addMessage = function addMessage(){
            if ($scope.foodSelected) {
                var newMessage = {
                    food: $scope.foodSelected,
                    from: $scope.currentUser.id,
                    date: moment().valueOf()
                };
                console.log("new message, ", newMessage);
                $scope.messages.$add(newMessage)
                    .then(function addAlert() {
                        return userAlertService.sendAlert($scope.friendObj.id);
                    });
                $scope.foodSelected = false;
                scrollHack();
            }
        };

        function scrollHack() {
            $ionicScrollDelegate.$getByHandle('message-list').scrollBottom();
        }

        /*
        //this allows the scroll to be smooth
        window.addEventListener('native.keyboardhide', scrollHack);
        window.addEventListener('native.keyboardshow', scrollHack);

        $scope.$on('$destroy', function() {
            window.removeEventListener('native.keyboardhide', scrollHack);
            window.removeEventListener('native.keyboardshow', scrollHack);
        });
        */


        /*
        Possibly remove stuff below this line!------------------
        ------------------
         */

        // pull to refresh buttons
        $scope.doRefresh = function(){
            $scope.messages = [];
            $scope.postsCompleted = false;
            $scope.getMessages();
            $scope.$broadcast('scroll.refreshComplete');
        };

        //TODO: For some reason something broke and I have to call this now.
        $scope.doRefresh();

    }
]);
