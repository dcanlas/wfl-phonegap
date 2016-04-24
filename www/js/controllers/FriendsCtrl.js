/* Friends controller */
app.controller('FriendsCtrl', ['_', 'moment', '$q', '$cordovaToast', '$firebaseArray', '$firebaseObject', '$ionicModal', '$scope', '$state', '$timeout', 'firebaseMain', 'foodIcons', 'foodManager', 'userService',
    function FriendsCtrlFunction(_, moment, $q, $cordovaToast, $firebaseArray, $firebaseObject, $ionicModal, $scope, $state, $timeout, firebaseMain, foodIcons, foodManager, userService) {

        //Controller variables
        var friendsRef,
            userAlertRef = firebaseMain.userAlertRef,
            initDone = false,
            initFriendLastKey = "";
            alertListenerSet = false;

        //Page variables
        $scope.items = [];
        $scope.times = 0 ;
        $scope.postsCompleted = false;
        $scope.noUserResult = false;

        //Food grid related stuff
        $scope.foodIcons = foodIcons.getFoods();
        $scope.foodSize = foodIcons.foodSize;
        $scope.foodSelected = false;
        $scope.foodGridShown = false;

        $scope.currentUser = userService.getCurrentUser();
        friendsRef = firebaseMain.friendsRef.child($scope.currentUser.$id);
        //Note: by using $firebaseArray, this object is sync with server so it auto-updates
        function init() {
            if (!initDone) {
                $scope.friends = $firebaseArray(friendsRef);
                $scope.friends.$loaded(function () {
                    var allRefs = [];
                    console.log("it loaded:", $scope.friends);
                    _.each($scope.friends, function(friend, idx) {
                        var friendObjRef = $firebaseObject(firebaseMain.userRef.child(friend.$id));
                        allRefs.push(friendObjRef.$loaded().then(function() {
                            friendObjRef.lastInteractionTime = friend.lastInteractionTime ? friend.lastInteractionTime : 1;
                            $scope.friends[idx] = friendObjRef;
                            $scope.friends[idx].hasAlert = 0;
                        }));
                    });
                    $q.all(allRefs).then(function() {
                        console.log("friends now: ", $scope.friends);
                        doFriendsWatch();
                        checkForAlerts();
                    });
                });
                initDone = true;
            }
        }

        function doFriendsWatch() {
            $scope.friends.$watch(function (event) {
                console.log("event: ", event);
                if (event.event === 'child_added') {
                    var idx = $scope.friends.$indexFor(event.key);
                    console.log("my idx: ", idx);
                    var newRef = $firebaseObject(firebaseMain.userRef.child(event.key));
                    newRef.$loaded().then(function() {
                        $scope.friends[idx] = newRef;
                        newRef.hasAlert = 0;
                        newRef.lastInteractionTime = 1;
                        console.log("current new friend: ", $scope.friends[idx]);
                        console.log("new friends: ", $scope.friends);
                        sortFriends();
                    });
                }
            });
        }

        function checkForAlerts() {
            if (!alertListenerSet) {
                userAlertRef.child($scope.currentUser.$id).on("value", alertAddedCb);
                alertListenerSet = true;
            }
        }

        function alertAddedCb(snapshot) {
            var alerts = snapshot.val();
            $timeout(function() {
                var promiseArray = [];
                _.each($scope.friends, function(friend) {
                    // friend.hasAlert = 0;
                    if (alerts && alerts[friend.id || friend.$id]) {
                        promiseArray.push(
                            userService.setFriendUpdateTime(friend.id || friend.$id).then(function() {
                                var idx = $scope.friends.$indexFor(friend.$id);
                                var ref = $firebaseObject(firebaseMain.userRef.child(friend.id || friend.$id));
                                return ref.$loaded().then(function() {
                                    console.log("I should run first");
                                    ref.hasAlert = 1
                                    ref.lastInteractionTime = friend.lastInteractionTime;
                                    $scope.friends[idx] = ref;
                                    console.log("my ref: ", ref, $scope.friends[idx]);
                                });
                            })
                        );
                    }
                });
                $q.all(promiseArray).then(sortFriends);
            });
        }

        function sortFriends() {
            $scope.friends.sort(function (a, b) {
                return b.lastInteractionTime - a.lastInteractionTime;
            });
            console.log("I should run last");
            console.log("friends being sorted: ", $scope.friends);
        }

        $scope.isFoodOutdated = function isFoodOutdated(date) {
            var earlier = moment().subtract(2, 'h');
            return moment(date).isBefore(earlier);
        };

        //actions on friends
        $scope.sendMessage = function sendMessage(user) {
            console.log("send to user: ", user);
            $state.go('dashboard.message', {friendId: user.$id});
        };

        //actions on foods
        $scope.showFoodGrid = function showFoodGrid() {
            $scope.foodGridShown = true;
            //this is from the directive.
            $scope.showBackdrop();
        };

        $scope.hideFoodGrid = function hideFoodGrid() {
            $scope.foodGridShown = false;
            $scope.foodSelected = false;
            $scope.hideBackdrop();
        };

        $scope.$on('backdrop-clicked', function() {
            $scope.hideFoodGrid();
            $scope.$apply();
        });

        $scope.selectFood = function selectFood(item) {
            $scope.foodSelected = item;
        };

        $scope.updateFoodSelected = function updateFoodSelected() {
            console.log("myselected: ", $scope.foodSelected);
            if ($scope.foodSelected) {
                var foodUpdate = {
                    food: $scope.foodSelected,
                    date: moment().valueOf()
                };
                foodManager.addFood(foodUpdate).then(function suc() {
                    $scope.hideFoodGrid();
                    $scope.$apply();
                });
            }
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

        //Init call
        init();

        $scope.$on('$destroy', function() {
            $scope.addModal.remove();
            userAlertRef.child($scope.currentUser.id).off("value");
        });

    }
]);
