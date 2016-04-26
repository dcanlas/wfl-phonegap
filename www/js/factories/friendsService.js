app.factory('friendsService', ['_', '$q', '$rootScope', '$firebaseObject', 'firebaseMain', 'userService',
    function friendsService(_, $q, $rootScope, $firebaseObject, firebaseMain, userService) {

        var currentUser = userService.getCurrentUser(),
            friendsRef = firebaseMain.friendsRef.child(currentUser.$id),
            userAlertRef = firebaseMain.userAlertRef,
            initDone = false,
            initDeferred = $q.defer(),
            friendCount = 0;
            friendsHash = {};
            friendsArr = [];

        //this is for sorting friendsArr based on some attribute.
        function doSort() {
            console.log("sorting started");
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
                console.log('friendsArr ', friendsArr.length, friendsArr);
                friendsArr = _.reject(friendsArr, function(item) {
                    return item.user.id === key;
                });
                console.log('friendsArr after ', friendsArr.length, friendsArr);
                delete friendsHash[key];
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
                initDone = true;
            }
            return initDeferred.promise;
        }

        function getFriendsArr() {
            return friendsArr;
        }

        return {
            init: init,
            getFriendsArr: getFriendsArr,
            friendsHash: friendsHash
        };

    }
]);
