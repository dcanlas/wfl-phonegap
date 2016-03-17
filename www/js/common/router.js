app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    //sidebar
        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/sidebar-menu.html"
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
            templateUrl: "templates/dashboard.html"
        })
        // friends page
        .state('dashboard.friends', {
            url: "/friends",
            views: {
                'friends-list' :{
                    templateUrl: "templates/friends.html",
                    controller: "FriendsCtrl"
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
        })

        .state('app.message', {
            url: "/message",
            views: {
                'menuContent' :{
                    templateUrl: "templates/message.html",
                    controller: "MessageCtrl"
                }
            }
        });
    //  login page
    $urlRouterProvider.otherwise("/login");
});