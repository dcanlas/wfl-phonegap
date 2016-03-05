app.factory('userService',
    ['$q', 'firebaseMain', function userService($q, firebaseMain) {

        var ref = firebaseMain.userRef;

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
                    deferred.reject("no user found");
                }
            }, function err(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }


        return {
            createUser: createUser,
            saveUser: saveUser,
            getUser: getUser
        };
    }]
);