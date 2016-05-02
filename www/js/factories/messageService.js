app.factory('messageService', ['moment', '$q', '$firebaseArray', '$firebaseObject', '$cordovaFacebook', 'firebaseMain', 'friendsService', 'userService', 'userAlertService',
    function messageService(moment, $q, $firebaseArray, $firebaseObject, $cordovaFacebook, firebaseMain, friendsService, userService, userAlertService) {

        var ref = firebaseMain.messagesRef,
            currentUser = userService.getCurrentUser();

        function getMessagesWithFriend(friendId) {
            var deferred = $q.defer();
            var friendRef = $firebaseObject(firebaseMain.userRef.child(friendId));
            //case where messages between user and friend already exist
            if (currentUser.messages && currentUser.messages[friendId]) {
                var query = ref.child(currentUser.messages[friendId]).limitToLast(50);
                var resQuery = $firebaseArray(query);
                resQuery.$loaded(function () {
                    deferred.resolve({ messages : resQuery });
                }, function err(error) {
                    console.log("cannot load messages ", error);
                    deferred.reject(error)
                });
            }
            //case where messages between user and friend does not exist yet
            else {
                //create a message id for these users
                var newMsgRef = ref.push({'tempMessage' : true});
                var msgRefId = newMsgRef.key();
                //update both user and friend with new key
                var updateObj = {},
                    userPath = currentUser.id + "/messages/" + friendId,
                    friendPath = friendId + "/messages/" + currentUser.id;
                updateObj[userPath] = msgRefId;
                updateObj[friendPath] = msgRefId;
                firebaseMain.userRef.update(updateObj)
                    .then(function success() {
                        var messages = $firebaseArray(ref.child(msgRefId));
                        messages.$loaded(function () {
                            deferred.resolve({ messages : messages});
                        }, function err(error) {
                            console.log("cannot start messages ", error);
                            deferred.reject(error)
                        })
                    });
            }
            return deferred.promise;
        }

        function sendWfl(friendId) {
            var mRef = ref.child(currentUser.messages[friendId]);
            var msg = {
                from: currentUser.id,
                date: moment().valueOf(),
                wfl: true
            }
            return mRef.push(msg).then(function() {
                return userAlertService.sendAlert(friendId)
                    .then(function() {
                        return userService.setFriendUpdateTime(friendId)
                            .then(function() {
                                friendsService.triggerUserInteract(friendId);
                            });
                    });
            });
        }

        return {
            getMessagesWithFriend: getMessagesWithFriend,
            sendWfl: sendWfl
        };

    }]
);
