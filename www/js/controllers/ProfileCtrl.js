/*  Profile page template */
app.controller('ProfileCtrl', ['$scope', 'userService',
    function profileCtrl($scope, userService) {

        $scope.user = userService.getCurrentUser();

    }
]);