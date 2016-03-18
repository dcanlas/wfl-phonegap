// single message
app.controller('MessageCtrl', ['$ionicScrollDelegate', '$scope', '$stateParams', 'messageService', 'userSet', 'Messages',
    function messageCtrlFunction($ionicScrollDelegate, $scope, $stateParams, messageService, userSet, Messages){

        messageService.getMessagesWithFriend($stateParams.friendId)
            .then(function(data) {
                console.log("my messages: ", data.messages);
            });


        /*
        Possibly remove stuff below this line!------------------
        ------------------
         */

        $scope.messages = [];
        $scope.postsCompleted = false;
        // load more content function
        $scope.getPosts = function(){
            Messages.getMessage()
                .success(function (posts) {
                    $scope.messages = $scope.messages.concat(posts);
                    //console.log($scope.messages);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $ionicScrollDelegate.scrollBottom();
                    $scope.postsCompleted = true;
                })
                .error(function (error) {
                    $scope.items = [];
                });
        };
        // pull to refresh buttons
        $scope.doRefresh = function(){
            $scope.messages = [];
            $scope.postsCompleted = false;
            $scope.getPosts();
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