app.directive('menuCloseKeepHistory', ['$ionicHistory', function($ionicHistory) {
    return {
        restrict: 'AC',
        link: function($scope, $element) {
            $element.bind('click', function() {
                var sideMenuCtrl = $element.inheritedData('$ionSideMenusController');
                if (sideMenuCtrl) {
                    $ionicHistory.nextViewOptions({
                        historyRoot: false,
                        disableAnimate: true,
                        expire: 300
                    });
                    sideMenuCtrl.close();
                }
            });
        }
    };
}]);
app.directive('dir', function($compile, $parse) {
 return {
	restrict: 'E',
	link: function(scope, element, attr) {
	  scope.$watch(attr.content, function() {
		 element.html($parse(attr.content)(scope));
		 $compile(element.contents())(scope);
	  }, true);
	}
 }
})