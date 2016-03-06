app.factory('authService', ['$q', '$rootScope', '$state', '$cordovaFacebook', '$cordovaToast', 'FbConfig', '$firebaseAuth', 'firebaseMain', 'userService',
    function authService($q, $rootScope, $state, $cordovaFacebook, $cordovaToast, FbConfig, $firebaseAuth, firebaseMain, userService) {

        var ref = firebaseMain.ref,
            authDeferred = $q.defer(),
            auth = $firebaseAuth(ref),
            onAuthCallback,
            eventWatcher,
            svc = {
                getAuthentication: getAuthentication,
                logout: logout,
                authenticate: authenticate,
                authenticateFb: authenticateFb,
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

        function setFbUser(authData) {
            userService.getCurrentUser(authData.uid)
                .then(function success(user) {
                    userService.setCurrentUser(user);
                }, function error(err) {
                    console.log("error")
                    if (err === "NO_USER") {

                    }
                });
        }

        function fbAuthCb(error, authData) {
            if (error) {
                console.log('Firebase login failed! ', error);
            }
            else {
                console.log("fb auth success, ", authData);
                setFbUser(authData);
            }
        }

        function authenticateFb() {
            if (ionic.Platform.isWebView()) {
                return $cordovaFacebook.login(FbConfig.permissions).then(function (success) {
                    console.log("fb success: ", success);
                    auth.$authWithOAuthToken('facebook', success.authResponse.accessToken, fbAuthCb);
                }, function (error) {
                    console.log('cordova auth error: ', error);
                });
            }
            else {
                return auth.$authWithOAuthPopup('facebook', fbAuthCb);
            }
        }

        function userLoggedOut() {
            $state.go('app.login');
            userService.removeCurrentUser();
            if (!$rootScope.firstAuthCheck) {
                $cordovaToast.showLongBottom("Please login.");
            }
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