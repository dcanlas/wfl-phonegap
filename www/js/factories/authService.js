app.factory('authService', ['$q', '$rootScope', '$state', '$cordovaToast', '$firebaseAuth', 'firebaseMain', 'userService',
    function authService($q, $rootScope, $state, $cordovaToast, $firebaseAuth, firebaseMain, userService) {

        var ref = firebaseMain.ref,
            authDeferred = $q.defer(),
            auth = $firebaseAuth(ref),
            onAuthCallback,
            eventWatcher,
            svc = {
                getAuthentication: getAuthentication,
                logout: logout,
                authenticate: authenticate,
                authPromise: authDeferred.promise,
                authenticated: false
            };

        function authenticate(email, password) {
            return auth.$authWithPassword({
                email: email,
                password: password
            }).then(function suc(authData) {
                //set to see if user logs out somehow
                if (!svc.authenticated) {
                    getAuthentication();
                }
                return authData;
            });
        }

        function userLoggedOut() {
            $state.go('app.login');
            userService.removeCurrentUser();
            $cordovaToast.showLongBottom("Please login.");
            //stop watching for auth changes.
            eventWatcher();
        }

        onAuthCallback = function(authData) {
            if (authData) {
                authDeferred.resolve(authData);
                svc.authenticated = true;
                userService.getUser(authData.uid)
                    .then(function(user) {
                        userService.setCurrentUser(user);
                    });
            }
            else {
                authDeferred.reject("User is logged out");
                userLoggedOut();
                svc.authenticated = false;
            }
        };

        /* Instances when this is called
        1. Called when app starts to detect auth. In this case, if user is not logged in then
            it will simply not watch for the auth anymore because userLoggedOut should be called.
        2. Called after loggin in, so that we can watch what is happening with the authentication.
         */
        function getAuthentication() {
            if (!svc.authenticated) {
                eventWatcher = auth.$onAuth(onAuthCallback);
            }
        }

        function logout() {
            auth.$unauth();
        }

        return svc;
    }]
);