/* Friends controller */
app.controller('FriendsCtrl', ['_', '$cordovaToast', '$firebaseArray', '$ionicModal', '$scope', '$state', 'firebaseMain', 'userService', 'Friends',
    function(_, $cordovaToast, $firebaseArray, $ionicModal, $scope, $state, firebaseMain, userService, Friends) {

        //Controller variables
        var friendsRef;

        //Page variables
        $scope.items = [];
        $scope.times = 0 ;
        $scope.postsCompleted = false;
        $scope.noUserResult = false;

        userService.waitForUserSet.then(function() {
            $scope.currentUser = userService.getCurrentUser();
            friendsRef = userService.getCurrentUserRef().child('friends');
            //Note: by using $firebaseArray, this object is sync with server so it auto-updates
            $scope.friends = $firebaseArray(friendsRef);
            $scope.friends.$loaded(function () {
                //Add something here later?
                console.log("it loaded:", $scope.friends);
            });
        });

        //actions on friends
        $scope.sendMessage = function sendMessage(user) {
            console.log("send to user: ", user);
            $state.go('dashboard.message');
        };

        //Modal variables
        $scope.modalValues = {
            searchTerm: ""
        };

        //Modal functions
        $scope.searchUser = function searchUser() {
            var term = $scope.modalValues.searchTerm.toLowerCase();
            if (term.length < 1) {
                $cordovaToast.showShortBottom("Please enter a name to search.");
            }
            else {
                var query = firebaseMain.userRef.orderByChild("displayName").startAt(term).endAt(term + '\uf8ff');
                var initResults = $firebaseArray(query);
                initResults.$loaded(function() {
                    $scope.userResult = _.filter(initResults, function(item) {
                        return item.id !== $scope.currentUser.id;
                    });
                    $scope.noUserResult = $scope.userResult.length === 0;
                });
            }
        };

        //setup modal
        $ionicModal.fromTemplateUrl('templates/modals/addFriends.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: true
        }).then(function(modal) {
            $scope.addModal = modal;
        });

        $scope.addFriend = function addFriend(friend) {
            return userService.addFriendToUser(friend)
                .then(function success() {
                    console.log("added friend ", friend);
                }, function err(error) {
                    console.log("add failed ", error);
                });
        };

        $scope.addFriendModal = function addFriendModal() {
            $scope.addModal.show();
        };

        $scope.closeModal = function closeModal() {
            $scope.addModal.hide();
        };

        $scope.$on('$destroy', function() {
            $scope.addModal.remove();
        });

        // load more content function
        //below is for delayed infinite scrolling which is unused right now
        //uses ion-infinite-scroll
        $scope.getPosts = function(){
            Friends.getFriends()
                .success(function (posts) {
                    $scope.items = $scope.items.concat(posts);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $scope.times = $scope.times + 1;
                    if($scope.times >= 4) {
                        $scope.postsCompleted = true;
                    }
                })
                .error(function (error) {
                    $scope.items = [];
                });
        };
        // pull to refresh buttons
        $scope.doRefresh = function(){
            $scope.times = 0 ;
            $scope.items = [];
            $scope.postsCompleted = false;
            $scope.getPosts();
            $scope.$broadcast('scroll.refreshComplete');
        };
    }
]);