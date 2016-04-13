app.directive('wflBackdrop', function() {
    return {
       restrict: 'AC',
       link: function(scope, elm, attr) {
           var element = jQuery(elm);
	       element.append('<div class="custom-backdrop hide"></div>');
           scope.showBackdrop = function() {
               element.find('.custom-backdrop').removeClass('hide')
           }
           scope.hideBackdrop = function() {
               element.find('.custom-backdrop').addClass('hide');
           }
       }
   };
});
