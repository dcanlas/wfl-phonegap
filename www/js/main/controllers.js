// Ionic Starter App
//Todo: rename this to main.js or app.js later

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('WflApp', ['ionic', 'firebase', 'ngSanitize', 'ngCordova','ngIOS9UIWebViewPatch']);
// not necessary for a web based app // needed for cordova/ phonegap application
app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            // Set the statusbar to use the default style, tweak this to
            // remove the status bar on iOS or change it to use white instead of dark colors.
            StatusBar.styleDefault();
        }
    });
});
//app run getting device id
app.run(function ($rootScope, $state, $cordovaToast, myPushNotification, authService) {
    // app device ready
    document.addEventListener("deviceready", function(){
        if(!localStorage.device_token_syt || localStorage.device_token_syt == '-1'){
            myPushNotification.registerPush();
        }
    });
    $rootScope.get_device_token = function () {
        if(localStorage.device_token_syt) {
            return localStorage.device_token_syt;
        } else {
            return '-1';
        }
    };
    $rootScope.set_device_token = function (token) {
        localStorage.device_token_syt = token;
        return localStorage.device_token_syt;
    }

    //check if we are logged in
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
        if (!authService.authenticated && toState.name === 'app.login') {
            authService.getAuthentication();
            authService.authPromise.then(function suc(authData) {
                $state.go('app.features');
                event.preventDefault();
            }, function err(error) {
                //user needs to login first
                $state.go('app.login');
            });
        }
    });
});
//myservice device registration id to localstorage
app.service('myService', ['$http', function($http) {
    this.registerID = function(regID, platform) {
        //alert(regID);
        localStorage.device_token_syt = regID;
    }
}]);

// config to disable default ionic navbar back button text and setting a new icon
// logo in back button can be replaced from /templates/sidebar-menu.html file
app.config(function($ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('').icon('ion-ios-arrow-back').previousTitleText(false);
});


/* Features Controller */
app.controller('FeaturesCtrl', ['$scope', 'Features', function($scope, Features) {
    $scope.items = Features.items;
}])
/* About us Controller */
app.controller('AboutCtrl', ['$scope', function($scope) {
}])




