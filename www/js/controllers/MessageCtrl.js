// single message
app.controller('MessageCtrl', ['_', '$ionicScrollDelegate', '$firebaseObject', '$scope', '$stateParams', 'firebaseMain', 'messageService', 'userSet',
    function messageCtrlFunction(_, $ionicScrollDelegate, $firebaseObject, $scope, $stateParams, firebaseMain, messageService, userSet){

        $scope.messages = [];
        $scope.postsCompleted = false; //this is for infinite scrolling later

        //get our friend object
        var friendRef = firebaseMain.userRef.child($stateParams.friendId);
        $scope.friendObj = $firebaseObject(friendRef);

        // load more content function
        $scope.getMessages = function getMessages() {
            messageService.getMessagesWithFriend($stateParams.friendId)
                .then(function (data) {
                    console.log("my messages: ", data.messages);
                    var messages = _.filter(data.messages, function (msg) {
                        return msg.$id !== 'tempMessage';
                    });
                    $scope.messages = $scope.messages.concat(messages);
                    console.log('messages ', $scope.messages);
                    $ionicScrollDelegate.scrollBottom();
                    //todo: paginate stuff later, we just pull all messages for now.
                    $scope.postsCompleted = true;
                });
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
        $scope.addMesage = function(){
            var newMessage = new function() {
                this.message = $scope.datamessage;
                this.from = '2';
                this._id	= '12';
                this.title	= 'sample';
                this.image	= 'http://3.bp.blogspot.com/-bTWNRjookMQ/VYGjnv5nKtI/AAAAAAAAA08/wXshQ9sNDeU/s100-c/blank-792125_1280.jpg';
            };
            $scope.messages = $scope.messages.concat(newMessage);
            $scope.datamessage = "";
            $ionicScrollDelegate.scrollBottom();
        };
    }
]);