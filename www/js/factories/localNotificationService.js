app.factory('localNotificationService', ['_', 'moment', '$rootScope', '$ionicPlatform', '$cordovaLocalNotification',
    function localNotificationService(_, moment, $rootScope, $ionicPlatform, $cordovaLocalNotification) {
        var deviceMode = false;
        var isInit = false;

        function init() {
            if (!isInit) {
                isInit = true;
                $ionicPlatform.ready(function() {
                    if(window.cordova) {
                        deviceMode = true;
                        setLunchNotification();

                        $cordovaLocalNotification.isScheduled("1234").then(function(isScheduled) {
                            alert("Notification 1234 Scheduled: " + isScheduled);
                        });
                    }
                });
                //note: below is not working, change it later
                $rootScope.$on('$cordovaLocalNotification:click', function(event, notification, state) {
                    alert(notification.id + " was clicked " + state);
                    console.log('click event triggered on');
                });
            }
        }

        function setLunchNotification() {
            console.log('local', $cordovaLocalNotification);
            $cordovaLocalNotification.add({
                id: "1234",
                date: moment().add(30, 's').toDate(),
                text: "Update what you're eating for lunch!",
                title: "Lunch Time!",
                sound: null,
                icon: 'file://img/anon36.png'
            }).then(function () {
                console.log("The notification has been set");
            });
        }


        return {
            init: init
        };
    }
]);