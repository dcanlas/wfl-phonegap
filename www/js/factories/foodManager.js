app.factory('foodManager', ['$q', '$firebaseArray', 'firebaseMain', 'userService',
    function foodManager($q, $firebaseArray, firebaseMain, userService) {

        var ref = firebaseMain.foodLogRef,
            currentUser = userService.getCurrentUser();

        function addFood(foodObj) {
            return ref.child(currentUser.$id).push(foodObj)
                .then(function suc() {
                    currentUser.recentFood = foodObj;
                    return currentUser.$save();
                });
        }

        function getUserFoodLog(userId) {
            //todo: we can change limit later
            return $firebaseArray(ref.child(userId).limitToLast(50));
        }


        return {
            addFood: addFood,
            getUserFoodLog: getUserFoodLog
        };
    }
]);
