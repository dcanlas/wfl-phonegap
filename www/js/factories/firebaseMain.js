app.factory('firebaseMain', ['FirebaseConfig', function firebaseMain(FirebaseConfig) {

    var firebaseRef = new Firebase(FirebaseConfig.url);

    return {
        'ref': firebaseRef,
        'userRef': firebaseRef.child('users'),
        'messagesRef': firebaseRef.child('messages')
    };
}]);