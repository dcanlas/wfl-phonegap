app.factory('userService', ['$q', '$cordovaFacebook', 'firebaseMain',
    function userService($q, $cordovaFacebook, firebaseMain) {

        var ref = firebaseMain.userRef,
            currentUser = null;


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
                currentUser = user;
                console.log("user has been set");
            } else {
                console.log("this should happen only once!");
            }
        }

        function createFbUser() {
            return $cordovaFacebook.api('me', ['public_profile', 'email'])
                .then(function success(data) {
                    console.log('fbdata: ', data);
                }, function err(error) {
                    console.log("cannot retrieve fb user: ", error);
                })
        }

        function getCurrentUser() {
            return currentUser;
        }

        function removeCurrentUser() {
            currentUser = null;
        }


        return {
            createUser: createUser,
            saveUser: saveUser,
            getUser: getUser,
            setCurrentUser: setCurrentUser,
            getCurrentUser: getCurrentUser,
            removeCurrentUser: removeCurrentUser,
            createFbUser: createFbUser
        };
    }]
);