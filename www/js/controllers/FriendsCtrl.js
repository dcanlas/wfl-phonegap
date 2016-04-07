/* Friends controller */
app.controller('FriendsCtrl', ['_', '$cordovaToast', '$firebaseArray', '$firebaseObject', '$ionicModal', '$scope', '$state', 'firebaseMain', 'userService', 'Friends',
    function FriendsCtrlFunction(_, $cordovaToast, $firebaseArray, $firebaseObject, $ionicModal, $scope, $state, firebaseMain, userService, Friends) {

        //Controller variables
        var friendsRef;

        //Page variables
        $scope.items = [];
        $scope.times = 0 ;
        $scope.postsCompleted = false;
        $scope.noUserResult = false;

        $scope.currentUser = userService.getCurrentUser();
        friendsRef = firebaseMain.friendsRef.child($scope.currentUser.$id);
        //Note: by using $firebaseArray, this object is sync with server so it auto-updates
        $scope.friends = $firebaseArray(friendsRef);
        $scope.friends.$loaded(function () {
            //Add something here later?
            console.log("it loaded:", $scope.friends);
            _.each($scope.friends, function(friend, idx) {
                $scope.friends[idx] = $firebaseObject(firebaseMain.userRef.child(friend.$id));
            });
            console.log("all refrerences:", $scope.friends);
        });

        //actions on friends
        $scope.sendMessage = function sendMessage(user) {
            console.log("send to user: ", user);
            $state.go('dashboard.message', {friendId: user.$id});
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
                    var myFriends = [],
                        notFriends = [],
                        friendIdMap = {};
                    var newResults = _.filter(initResults, function(item) {
                        return item.id !== $scope.currentUser.id;
                    });
                    //create a hash of friends we already have for easy lookup.
                    _.each($scope.friends, function(item) {
                        friendIdMap[item.$id] = true;
                    });
                    _.each(newResults, function(item) {
                        friendIdMap[item.id] ? myFriends.push(item) : notFriends.push(item);
                    });
                    $scope.userResult = notFriends;
                    $scope.currentFriends = myFriends;
                    $scope.noUserResult = newResults.length === 0;
                });
            }
        };

        $scope.goToProfile = function(user) {
            $scope.closeModal();
            $state.go('dashboard.profile', {userId: user.id});
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
                    $scope.userResult = _.filter($scope.userResult, function(item) {
                        return item.id !== friend.id;
                    });
                    $scope.currentFriends.push(friend);
                    $scope.$apply();
                }, function err(error) {
                    console.log("add failed ", error);
                });
        };

        $scope.addFriendModal = function addFriendModal() {
            $scope.addModal.show();
        };

        $scope.closeModal = function closeModal() {
            $scope.userResult = [];
            $scope.currentFriends = [];
            $scope.modalValues.searchTerm = "";
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
