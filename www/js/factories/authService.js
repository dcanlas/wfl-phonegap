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
                getAuthentication();
                return authData;
            });
        }

        function authenticateFb() {
            if (ionic.Platform.isWebView()) {
                return $cordovaFacebook.login(FbConfig.permissions).then(function (success) {
                    return auth.$authWithOAuthToken('facebook', success.authResponse.accessToken)
                        .then(function (authData) {
                            getAuthentication();
                            return authData;
                        })
                        .catch(function err(error) {
                            console.log("fblogin went wrong, ", error);
                        });
                }, function (error) {
                    console.log('cordova auth error: ', error);
                });
            }
            else {
                return auth.$authWithOAuthPopup('facebook')
                    .then(function (authData) {
                        getAuthentication();
                        return authData;
                    })
                    .catch(function err(error) {
                        console.log("fblogin went wrong, ", error);
                    });
            }
        }

        function setFbUser(authData) {
            userService.getUser(authData.uid)
                .then(function success(user) {
                    userService.setCurrentUser(user);
                }, function error(err) {
                    console.log("error", err);
                    if (err === "NO_USER") {
                        //we don't have this user in our db yet, create user.
                        userService.createFbUser(authData);
                    }
                });
        }

        function userLoggedOut() {
            $state.go('login');
            userService.removeCurrentUser();
            //we need this so that the toast doesn't show on app load.
            if (!$rootScope.firstAuthCheck) {
                $cordovaToast.showLongBottom("Please login.");
            }
            //stop watching for auth changes.
            eventWatcher();
            logout();
        }

        onAuthCallback = function(authData) {
            if (authData) {
                authDeferred.resolve(authData);
                console.log("authData: ", authData);
                svc.authenticated = true;
                if (authData.provider === 'facebook') {
                    setFbUser(authData);
                }
                else {
                    userService.getUser(authData.uid)
                        .then(function(user) {
                            userService.setCurrentUser(user);
                        });
                }
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