app.factory('friendsService', ['_', 'moment', '$q', '$rootScope', '$firebaseObject', 'firebaseMain', 'userService',
    function friendsService(_, moment, $q, $rootScope, $firebaseObject, firebaseMain, userService) {

        var currentUser = userService.getCurrentUser(),
            friendsRef = firebaseMain.friendsRef.child(currentUser.$id),
            userAlertRef = firebaseMain.userAlertRef,
            initDone = false,
            initDeferred = $q.defer(),
            friendCount = 0,
            friendsHash = {},
            friendsArr = [];

        //this is for sorting friendsArr based on some attribute.
        function doSort() {
            friendsArr.sort(function(a, b) {
                return b.lastInteractionTime - a.lastInteractionTime;
            });
        }

        function broadcastChange() {
            $rootScope.$broadcast('friendListChange', friendsArr);
        }

        function startFriendAddWatch() {
            var initChildCount = 0;
            //for when we add friends
            friendsRef.on('child_added', function(snapshot) {
                var key = snapshot.key(),
                    data = snapshot.val(),
                    obj = {};

                obj.user = $firebaseObject(firebaseMain.userRef.child(key));
                obj.lastInteractionTime = data.lastInteractionTime ? data.lastInteractionTime : 0;
                friendsHash[key] = obj;
                friendsArr.push(obj);
                initChildCount++;
                if (initChildCount >= friendCount) {
                    console.log("friend added");
                    doSort();
                    initDeferred.resolve(friendsArr);
                    broadcastChange();
                }
            });
        }

        function startFriendRemoveWatch() {
            //for when we remove friends
            friendsRef.on('child_removed', function(snapshot) {
                var key = snapshot.key();
                console.log("friend removed", key);
                friendsArr = _.reject(friendsArr, function(item) {
                    return item.user.id === key;
                });
                delete friendsHash[key];
                broadcastChange();
            });
        }

        function alertAddWatch() {
            userAlertRef.child(currentUser.id).on('child_added', function(snapshot) {
                var key = snapshot.key();
                var val = snapshot.val();
                friendsHash[key].hasAlert = true;
                friendsHash[key].lastInteractionTime = moment().valueOf();
                userService.setFriendUpdateTime(key);
                doSort();
                broadcastChange();
            });
        }

        function alertRemoveWatch() {
            userAlertRef.child(currentUser.id).on('child_removed', function(snapshot) {
                var key = snapshot.key();
                var val = snapshot.val();
                friendsHash[key].hasAlert = false;
                //move this item down
                var tempArr = _.reject(friendsArr, function (friend) {
                    return friend.user.id === key;
                });
                var idx = 0;
                for(var i = 0; i < tempArr.length; i++) {
                    if (tempArr[i].hasAlert) {
                        idx++;
                    } else {
                        break;
                    }
                }
                tempArr.splice(idx, 0, friendsHash[key]);
                friendsArr = tempArr;
                broadcastChange();
            });
        }

        function init() {
            //first get the number of friends we have so we know when to sort
            if (!initDone) {
                var countDeferred = $q.defer();
                friendsRef.once('value', function(snapshot) {
                    var count = snapshot.numChildren();
                    friendCount = count;
                    countDeferred.resolve(count);
                });
                countDeferred.promise.then(function (count) {
                    startFriendAddWatch();
                    startFriendRemoveWatch();
                });
                //when the initial array has loaded, watch for alerts
                initDeferred.promise.then(function() {
                    alertAddWatch();
                    alertRemoveWatch();
                });
                initDone = true;
            }
            return initDeferred.promise;
        }

        function getFriendsArr() {
            return friendsArr;
        }

        //This function will update the userinteraction time in the friend hash and will always
        //move the friend to the beginning of array.
        function triggerUserInteract(friendId) {
            friendsHash[friendId].lastInteractionTime = moment().valueOf();
            var idx = 0;
            for(var i = 0; i < friendsArr.length; i++) {
                if (friendsArr[i].user.id === friendId) {
                    idx = i;
                    break;
                }
            }
            if (idx > 0) {
                friendsArr.splice(idx, 1);
                friendsArr.splice(0, 0, friendsHash[friendId]);
                broadcastChange();
            }
        }

        return {
            init: init,
            getFriendsArr: getFriendsArr,
            friendsHash: friendsHash,
            triggerUserInteract: triggerUserInteract
        };

    }
]);
