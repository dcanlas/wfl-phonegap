// push controller
app.controller('PushCtrl', ['$scope', 'SendPush', function($scope, SendPush){
    $scope.device_token = $scope.get_device_token();
    $scope.sendNotification = function(){
        SendPush.android($scope.device_token)
            .success(function () {
            })
            .error(function (error) {
            });
    }
}]);