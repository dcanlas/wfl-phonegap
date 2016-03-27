app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    //sidebar
        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/sidebar-menu.html"
        })
        .state('splash', {
            url: "/splash",
            templateUrl: "templates/splash.html",
            controller: "SplashCtrl"
        })
        //  login page
        .state('login', {
            url: "/login",
            templateUrl: "templates/login.html",
            controller: "LoginCtrl"
        })
        // Sign up page
        .state('signup', {
            url: "/signup",
            templateUrl: "templates/sign-up.html",
            controller: "SignUpCtrl"
        })
        //dashboard page
        .state('dashboard', {
            url: "/dashboard",
            abstract: true,
            templateUrl: "templates/dashboard.html",
            resolve: {
                //we need to inject userSet into child controllers so we can wait for it
                userSet: ['userService', function(userService) {
                    //this basically waits for user to be set before even showing dashboard
                    return userService.waitForUserSet;
                }]
            }
        })
        // friends page
        .state('dashboard.friends', {
            url: "/friends",
            views: {
                'pageContent' :{
                    templateUrl: "templates/friends.html",
                    controller: "FriendsCtrl"
                }
            }
        })
        .state('dashboard.message', {
            url: "/message/{friendId}",
            views: {
                'pageContent' :{
                    templateUrl: "templates/message.html",
                    controller: "MessageCtrl"
                }
            }
        })
        .state('dashboard.messages', {
            url: "/messages",
            views: {
                'messages-tab' :{
                    templateUrl: "templates/messages.html",
                    controller: "MessagesCtrl"
                }
            }
        })
        // profile page
        .state('dashboard.profile', {
            url: "/profile",
            views: {
                'profile-tab' :{
                    templateUrl: "templates/profile.html",
                    controller: "ProfileCtrl"
                }
            }
        })
        .state('app.settings', {
            url: "/settings",
            views: {
                'menuContent' :{
                    templateUrl: "templates/settings.html",
                    controller: "SettingsCtrl"
                }
            }
        })
        .state('app.contact', {
            url: "/contact",
            views: {
                'menuContent' :{
                    templateUrl: "templates/contact.html",
                    controller: "ContactCtrl"
                }
            }
        });

    //  login page
    $urlRouterProvider.otherwise("/splash");
});