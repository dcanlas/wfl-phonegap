app.factory('userService', ['$q', '$firebaseArray', '$firebaseObject', '$cordovaFacebook', 'firebaseMain',
    function userService($q, $firebaseArray, $firebaseObject, $cordovaFacebook, firebaseMain) {

        var ref = firebaseMain.userRef,
            userSetDeferred = $q.defer(),
            currentUser = null,
            currentUserFriends = null,
            currentUserRef = null; //a firebase ref to the user object


        function createUser(id, name, email, displayName, friends) {
            return {
                id: id,
                name: name,
                email: email,
                displayName: displayName || name.toLowerCase(),
                friends: friends || {}
            };
        }

        function saveUser(user) {
            return ref.child(user.id).set(user);
        }

        function getUser(id) {
            var deferred = $q.defer();
            ref.child(id).once('value', function(snap) {
                var user = snap.val();
                if (user) {
                    deferred.resolve(user);
                }
                else {
                    deferred.reject("NO_USER");
                }
            }, function err(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function setCurrentUser(user) {
            if (!currentUser) {
                currentUser = $firebaseObject(ref.child(user.id));
                var friendsRef = firebaseMain.friendsRef.child(user.id);
                currentUserFriends = $firebaseArray(friendsRef);
                currentUserRef = ref.child(user.id);
                userSetDeferred.resolve(currentUser);
                console.log("user has been set");
            } else {
                console.log("this should happen only once!");
            }
        }

        function createFbUser(authData) {
            return $cordovaFacebook.api('me?fields=name,email', ['public_profile', 'email'])
                .then(function success(data) {
                    var user = createUser(authData.uid, data.name, data.email, data.name.toLowerCase());
                    user.fbId = data.id;
                    user.picUrl = authData.facebook.profileImageURL;
                    return saveUser(user);
                }, function err(error) {
                    console.log("cannot retrieve fb user: ", error);
                })
        }

        function getCurrentUser() {
            return currentUser;
        }

        function getCurrentUserFriends() {
            return currentUserFriends;
        }

        function removeCurrentUser() {
            currentUser = null;
        }

        function getCurrentUserRef() {
            return currentUserRef;
        }

        function addFriendToUser(friend) {
            var updateObj = {},
                userPath = currentUser.id + "/" + friend.id,
                friendPath = friend.id + "/" + currentUser.id,
                userObj = { name: currentUser.name },
                friendObj = { name: friend.name };
            updateObj[userPath] = friendObj;
            updateObj[friendPath] = userObj;
            return firebaseMain.friendsRef.update(updateObj);
        }

        function removeFriendFromUser(friend) {
            var updateObj = {},
                userPath = currentUser.id + "/" + friend.id,
                friendPath = friend.id + "/" + currentUser.id;
            updateObj[userPath] = null;
            updateObj[friendPath] = null;
            return firebaseMain.friendsRef.update(updateObj);
        }

        return {
            createUser: createUser,
            saveUser: saveUser,
            getUser: getUser,
            setCurrentUser: setCurrentUser,
            getCurrentUser: getCurrentUser,
            getCurrentUserFriends: getCurrentUserFriends,
            removeCurrentUser: removeCurrentUser,
            createFbUser: createFbUser,
            addFriendToUser: addFriendToUser,
            removeFriendFromUser: removeFriendFromUser,
            getCurrentUserRef: getCurrentUserRef,
            waitForUserSet: userSetDeferred.promise
        };
    }]
);
