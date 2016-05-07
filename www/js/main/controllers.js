// Ionic Starter App
//Todo: rename this to main.js or app.js later

// angular.module is a global place for creating, registering and retrieving Angular modules
var app = angular.module('WflApp', ['ionic', 'firebase', 'ngSanitize', 'ngCordova','ngIOS9UIWebViewPatch', 'underscore', 'angularMoment']);
// not necessary for a web based app // needed for cordova/ phonegap application
app.run(function($ionicPlatform, $cordovaStatusbar) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        /*
        if(window.StatusBar) {
            // Set the statusbar to use the default style, tweak this to
            // remove the status bar on iOS or change it to use white instead of dark colors.
            StatusBar.styleDefault();
        }
        */
        //set status bar to red.
        if (window.StatusBar) {
            $cordovaStatusbar.styleHex('#de2826');
        }

        //for local notification with ios.
        if(ionic.Platform.isIOS() === "iOS") {
            window.plugin.notification.local.promptForPermission();
        }

        $ionicPlatform.on('pause', function() {
            console.log("entering background");
        });

        /*
        This is for later when we do push notification

        var push = PushNotification.init({
            "android": {"senderID": "346504465337", "sound": true},
            "ios": {"alert": "true", "badge": "true", "sound": "true"}
        });

        push.on('registration', function(data) {
            // data.registrationId
            console.log('my reg id: ', data.registrationId);
        });

        push.on('notification', function(data) {
            console.log('message ', data.message);
            alert(data.title+" Message: " +data.message);
            // data.message,
            // data.title,
            // data.count,
            // data.sound,
            // data.image,
            // data.additionalData
        });

        push.on('error', function(e) {
            // e.message
            console.log('error', e.message);
        });
         */
    });
});
//app run getting device id
app.run(function ($rootScope, $state, $cordovaToast, myPushNotification, authService, localNotificationService) {
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
    };

    //Todo: uncomment this later.
    //localNotificationService.init();
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
    $ionicConfigProvider.tabs.position('bottom');
});

//Setting moment's relative date formatting.
app.config(function(moment) {
    moment.locale('en', {
        calendar: {
            sameDay: 'LT',
            nextDay: '[Tomorrow]',
            nextWeek: 'dddd',
            lastDay: '[Yesterday]',
            lastWeek: 'MM/DD/YY',
            sameElse: 'MM/DD/YY'
        }
    });
});


/* Features Controller */
app.controller('FeaturesCtrl', ['$scope', 'Features', function($scope, Features) {
    $scope.items = Features.items;
}]);
/* About us Controller */
app.controller('AboutCtrl', ['$scope', function($scope) {
}]);
