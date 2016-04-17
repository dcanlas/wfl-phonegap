app.directive('wflBackdrop', function() {
    return {
       restrict: 'AC',
       link: function(scope, elm, attr) {
           var element = jQuery(elm);
	       element.append('<div class="custom-backdrop hide"></div>');
           var backdrop = element.find('.custom-backdrop');
           backdrop.click(function() {
               if (!backdrop.hasClass('hide')) {
                   scope.$broadcast('backdrop-clicked');
               }
           });
           scope.showBackdrop = function() {
               backdrop.removeClass('hide')
           }
           scope.hideBackdrop = function() {
               backdrop.addClass('hide');
           }
       }
   };
});
