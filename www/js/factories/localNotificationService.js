app.factory('localNotificationService', ['_', 'moment', '$ionicPlatform', '$cordovaLocalNotification',
    function localNotificationService(_, moment, $ionicPlatform, $cordovaLocalNotification) {
        var deviceMode = false;
        var isInit = false;

        function init() {
            console.log("getting here");
            if (!isInit) {
                isInit = true;
                $ionicPlatform.ready(function() {
                    console.log("it's ready");
                    deviceMode = true;
                    //sample code below
                    var alarmTime = new Date();
                    alarmTime.setMinutes(alarmTime.getMinutes() + 1);
                    setLunchNotification();

                    $cordovaLocalNotification.isScheduled("1234").then(function(isScheduled) {
                        alert("Notification 1234 Scheduled: " + isScheduled);
                    });

                });
            }
        }

        function setLunchNotification() {
            $cordovaLocalNotification.schedule({
                id: "1234",
                date: moment().add(1, 'm').toDate(),
                message: "Update what you're eating for lunch!",
                title: "Lunch Time!",
                autoCancel: true,
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