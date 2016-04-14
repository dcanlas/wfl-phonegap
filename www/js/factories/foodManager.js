app.factory('foodManager', ['$q', 'firebaseMain', 'userService',
    function foodManager($q, firebaseMain, userService) {

        var ref = firebaseMain.foodLogRef,
            currentUser = userService.getCurrentUser();

        function addFood(foodObj) {
            console.log('user here ', currentUser, foodObj);
            return ref.child("" + currentUser.$id).push(foodObj)
                .then(function suc() {
                    currentUser.recentFood = foodObj;
                    return currentUser.$save();
                });
        }


        return {
            addFood: addFood
        };
    }
]);
