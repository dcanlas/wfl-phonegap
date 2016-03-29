// login page of app //
app.controller('SplashCtrl', ['$state', 'authService',
    function($state, authService) {

        if(!authService.authenticated) {
            authService.getAuthentication();
            return authService.authPromise.then(function suc(authData) {
                $state.go('dashboard.friends');
                return authData;
            }, function err(error) {
                console.log("user not authenticated");
                $state.go('login');
            });
        }
    }
]);