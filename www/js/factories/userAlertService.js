app.factory('userAlertService', ['$q', 'firebaseMain', 'userService',
    function userAlertService($q, firebaseMain, userService) {

        var ref = firebaseMain.userAlertRef,
            currentUser = userService.getCurrentUser();

        function sendAlert(toUserId) {
            return ref.child(toUserId).child(currentUser.id).set(true);
        }

        function removeAlert(fromUserId) {
            return ref.child(currentUser.id).child(fromUserId).remove();
        }

        return {
            sendAlert: sendAlert,
            removeAlert: removeAlert
        };
    }
]);
