// single message
app.controller('MessageCtrl', ['_', 'moment', '$ionicScrollDelegate', '$firebaseObject', '$scope', '$stateParams', 'firebaseMain', 'messageService', 'userService', 'userSet',
    function messageCtrlFunction(_, moment, $ionicScrollDelegate, $firebaseObject, $scope, $stateParams, firebaseMain, messageService, userService, userSet){

        $scope.messages = [];
        $scope.postsCompleted = false; //this is for infinite scrolling later
        $scope.currentUser = userService.getCurrentUser();

        //get our friend object
        var friendRef = firebaseMain.userRef.child($stateParams.friendId);
        $scope.friendObj = $firebaseObject(friendRef);

        // load more content function
        $scope.getMessages = function getMessages() {
            messageService.getMessagesWithFriend($stateParams.friendId)
                .then(function (data) {
                    $scope.messages = data.messages;
                    console.log('messages ', $scope.messages);
                    $ionicScrollDelegate.scrollBottom();
                    //todo: paginate stuff later, we just pull all messages for now.
                    $scope.postsCompleted = true;
                });
        };

        $scope.addMesage = function addMessage(){
            var newMessage = {
                message: $scope.dataMessage,
                from: $scope.currentUser.id,
                date: moment().valueOf()
            };
            console.log("new message, ", newMessage);
            $scope.messages.$add(newMessage);
            $scope.dataMessage = "";
            $ionicScrollDelegate.scrollBottom();
        };


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

    }
]);