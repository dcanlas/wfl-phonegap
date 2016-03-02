// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('YourApp', ['ionic','ngSanitize', 'ngCordova','ngIOS9UIWebViewPatch','mobsocial.products']);
// not necessary for a web based app // needed for cordova/ phonegap application
app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
  });
});
//app run getting device id
app.run(function ($rootScope, myPushNotification) {
	// app device ready
	document.addEventListener("deviceready", function(){
		if(!localStorage.device_token_syt || localStorage.device_token_syt == '-1'){ 
			myPushNotification.registerPush();
		}
	});
   $rootScope.get_device_token = function () {
      if(localStorage.device_token_syt) {
         return localStorage.device_token_syt;
      } else {
         return '-1';
      }
   }
   $rootScope.set_device_token = function (token) {
      localStorage.device_token_syt = token;
      return localStorage.device_token_syt;
   }
});
//myservice device registration id to localstorage
app.service('myService', ['$http', function($http) {
   this.registerID = function(regID, platform) {
   		//alert(regID);
		localStorage.device_token_syt = regID;
   }
}]);

// config to disable default ionic navbar back button text and setting a new icon
// logo in back button can be replaced from /templates/sidebar-menu.html file
app.config(function($ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('').icon('ion-ios-arrow-back').previousTitleText(false);
})
// intro controller // 
app.controller('IntroCtrl', ['$scope', '$state', '$ionicSlideBoxDelegate', function($scope, $state, $ionicSlideBoxDelegate) {
  // Called to navigate to the main app
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
  // discard and move to homepage
  $scope.discardIntroPage = function(){
		$state.go('app.login');
  }
}])
/* main controller function */
app.controller('MainCtrl', ['$scope', '$ionicSideMenuDelegate', '$ionicHistory', function($scope, $ionicSideMenuDelegate, $ionicHistory) {
  	// Toggle left function for app sidebar
  	$scope.toggleLeft = function() {
    	$ionicSideMenuDelegate.toggleLeft();
  	};
  	// go back to previous page
  	$scope.goBackOne = function(){
		$ionicHistory.goBack();
	}
	// sharing plugin
	$scope.shareMain = function(){
		var title = "Download Smove For Android";
		var url = "https://play.google.com/store/apps/details?id=com.myspecialgames.swipe";
		window.plugins.socialsharing.share(title, null, null, url)
	}
	$scope.shareArticle = function(title,url){
		window.plugins.socialsharing.share(title, null, null, url)
	}
	$scope.openLinkArticle = function(url){
		window.open(url, '_system');
	}
}])
// login page of app //
app.controller('LoginCtrl', ['$state','$scope', function($state, $scope) {	
	// add your login logic here
	$scope.doLogin = function(){
		$state.go('app.features');
	}
}])
// Sign up page of app //
app.controller('SignUpCtrl', ['$state','$scope', function($state, $scope) {	
	// sign up logic here
	$scope.doRegister = function(){
		$state.go('app.features');
	}
}])
// Forgot password page of app //
app.controller('ForgotCtrl', ['$scope', function($scope) {	
	// forgot password
}])
// Forgot password page of app //
app.controller('GalleryCtrl', ['$scope', 'Photos', '$ionicModal', function($scope, Photos, $ionicModal) {
	
	$scope.items = [];
	$scope.times = 0 ;
	$scope.postsCompleted = false;
	// load more content function
	$scope.getPosts = function(){
		Photos.getPosts()
		.success(function (posts) {
			$scope.items = $scope.items.concat(posts);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.times = $scope.times + 1;
			if($scope.times >= 4) {
				$scope.postsCompleted = true;
			}
		})
		.error(function (error) {
			$scope.items = [];
		});
	}
	// pull to refresh buttons
	$scope.doRefresh = function(){
		$scope.times = 0 ;
		$scope.items = [];
		$scope.postsCompleted = false;
		$scope.getPosts();
		$scope.$broadcast('scroll.refreshComplete');
	}
	// modal to show image full screen
   $ionicModal.fromTemplateUrl('templates/image-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
   }).then(function (modal) {
      $scope.modal = modal;
   });
   $scope.openModal = function () {
		$scope.showNav = true;
      $scope.modal.show();
   };

   $scope.closeModal = function () {
      $scope.modal.hide();
   };
	// show image in popup
   $scope.showImage = function (index) {
		$scope.imageIndex = index;
      $scope.imageSrc = $scope.items[index].image_full;
      $scope.openModal();
   }
	// image navigation // swiping and buttons will also work here
	$scope.imageNavigate = function(dir){
		if(dir == 'right'){
			$scope.imageIndex = $scope.imageIndex + 1;
		} else {
			$scope.imageIndex = $scope.imageIndex - 1;
		}
		//alert(dir);
		if($scope.items[$scope.imageIndex] === undefined){
			$scope.closeModal();
		} else {
			$scope.imageSrc = $scope.items[$scope.imageIndex].image_full;
		}
	}
	// cleaning modal
	$scope.$on('$stateChangeStart', function(){
	  $scope.modal.remove();
	});
}])
/*  Videos controller  */
app.controller('VideosCtrl', ['$scope', 'VideoData', '$sce', function($scope, VideoData, $sce) {	
	$scope.items = VideoData.items;
	// to work embed in angularjs pages
	$scope.videoEmbed = function(video){
		return $sce.trustAsResourceUrl(video);
	}
}])
/* Blog controller */
app.controller('BlogCtrl', ['$scope', 'Blog', function($scope, Blog) {	

	$scope.items = [];
	$scope.times = 0 ;
	$scope.postsCompleted = false;
	// load more content function
	$scope.getPosts = function(){
		Blog.getPosts()
		.success(function (posts) {
			$scope.items = $scope.items.concat(posts);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.times = $scope.times + 1;
			if($scope.times >= 4) {
				$scope.postsCompleted = true;
			}
		})
		.error(function (error) {
			$scope.items = [];
		});
	}
	// pull to refresh buttons
	$scope.doRefresh = function(){
		$scope.times = 0 ;
		$scope.items = [];
		$scope.postsCompleted = false;
		$scope.getPosts();
		$scope.$broadcast('scroll.refreshComplete');
	}
}])
/*  Profile page template */
app.controller('ProfileCtrl', ['$scope', function($scope) {
	// just demo profile page
}])
/* Blog controller */
app.controller('NewsCtrl', ['$scope', 'Blog', function($scope, Blog) {	
	$scope.items = [];
	$scope.times = 0 ;
	$scope.postsCompleted = false;
	// load more content function
	$scope.getPosts = function(){
		Blog.getPosts()
		.success(function (posts) {
			$scope.items = $scope.items.concat(posts);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.times = $scope.times + 1;
			if($scope.times >= 4) {
				$scope.postsCompleted = true;
			}
		})
		.error(function (error) {
			$scope.items = [];
		});
	}
	// pull to refresh buttons
	$scope.doRefresh = function(){
		$scope.times = 0 ;
		$scope.items = [];
		$scope.postsCompleted = false;
		$scope.getPosts();
		$scope.$broadcast('scroll.refreshComplete');
	}
}])
/* Friends controller */
app.controller('FriendsCtrl', ['$scope', 'Friends', function($scope, Friends) {	
	$scope.items = [];
	$scope.times = 0 ;
	$scope.postsCompleted = false;
	// load more content function
	$scope.getPosts = function(){
		Friends.getFriends()
		.success(function (posts) {
			$scope.items = $scope.items.concat(posts);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.times = $scope.times + 1;
			if($scope.times >= 4) {
				$scope.postsCompleted = true;
			}
		})
		.error(function (error) {
			$scope.items = [];
		});
	}
	// pull to refresh buttons
	$scope.doRefresh = function(){
		$scope.times = 0 ;
		$scope.items = [];
		$scope.postsCompleted = false;
		$scope.getPosts();
		$scope.$broadcast('scroll.refreshComplete');
	}
}])
/*   Articles controller  */
app.controller('PostCtrl', ['$scope', 'Comments', '$ionicModal', 'PostData', function($scope, Comments, $ionicModal, PostData) {	
	$scope.items = [];
	$scope.postDataMain = PostData;
	// load more content function
	$scope.getPosts = function(){
		Comments.getComments()
		.success(function (posts) {
			$scope.items = $scope.items.concat(posts);
		})
		.error(function (error) {
			$scope.items = [];
		});
	}
	$scope.getPosts();
	// comment modal
	$ionicModal.fromTemplateUrl('comment-modal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});
	$scope.openModal = function() {
		$scope.modal.show();
	};
	$scope.closeModal = function() {
	 	$scope.modal.hide();
	};
	//Cleanup the modal when we're done with it!
	$scope.$on('$destroy', function() {
	 	$scope.modal.remove();
	});
}])
/*  Settings Controller */
app.controller('SettingsCtrl',['$scope', function($scope) {
}])
/*  Settings Controller */
app.controller('SocialProfileCtrl',['$scope','SocialData', function($scope,SocialData) {
	$scope.socials = SocialData.items;
}])
/* Features Controller */
app.controller('FeaturesCtrl', ['$scope', 'Features', function($scope, Features) {
	$scope.items = Features.items;
}])
/* About us Controller */
app.controller('AboutCtrl', ['$scope', function($scope) {
}])
/* Contact us form page */
app.controller('ContactCtrl', ['$scope', 'ConfigContact', function($scope, ConfigContact) {
	//setting heading here
	$scope.user = [];
	// contact form submit event
	$scope.submitForm = function(isValid) {
		if (isValid) {
			cordova.plugins.email.isAvailable(
				function (isAvailable) {
					window.plugin.email.open({
						to:      [ConfigContact.EmailId],
						subject: ConfigContact.ContactSubject,
						body:    '<h1>'+$scope.user.email+'</h1><br><h2>'+$scope.user.name+'</h2><br><p>'+$scope.user.details+'</p>',
						isHtml:  true
					});
				}
			);
		}
	}
}])
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
// show ad mob here in this page
app.controller('AdmobCtrl', ['$scope', 'ConfigAdmob', function($scope, ConfigAdmob){
	$scope.showInterstitial = function(){
		if(AdMob) AdMob.showInterstitial();
	}
	document.addEventListener("deviceready", function(){
		if(AdMob) {
			// show admob banner
			if(ConfigAdmob.banner) {
				AdMob.createBanner( {
					adId: ConfigAdmob.banner, 
					position: AdMob.AD_POSITION.BOTTOM_CENTER, 
					autoShow: true 
				} );
			}
			// preparing admob interstitial ad
			if(ConfigAdmob.interstitial) {
				AdMob.prepareInterstitial( {
					adId:ConfigAdmob.interstitial, 
					autoShow:false
				} );
			}
		}
		if(ConfigAdmob.interstitial) {
			$scope.showInterstitial();
		}
	});
}]);
// new items v2.0
// messages list
app.controller('MessagesCtrl', ['$scope', 'Messages', function($scope, Messages){
	$scope.items = [];
	$scope.postsCompleted = false;
	// load more content function
	$scope.getPosts = function(){
		Messages.getMesages()
		.success(function (posts) {
			$scope.items = $scope.items.concat(posts);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.postsCompleted = true;
		})
		.error(function (error) {
			$scope.items = [];
		});
	}
	// pull to refresh buttons
	$scope.doRefresh = function(){
		$scope.items = [];
		$scope.postsCompleted = false;
		$scope.getPosts();
		$scope.$broadcast('scroll.refreshComplete');
	}
}]);
// single message
app.controller('MessageCtrl', ['$scope', 'Messages', '$ionicScrollDelegate', function($scope, Messages, $ionicScrollDelegate ){
	$scope.messages = [];
	$scope.postsCompleted = false;
	// load more content function
	$scope.getPosts = function(){
		Messages.getMessage()
		.success(function (posts) {
			$scope.messages = $scope.messages.concat(posts);
			//console.log($scope.messages);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$ionicScrollDelegate.scrollBottom();
			$scope.postsCompleted = true;
		})
		.error(function (error) {
			$scope.items = [];
		});
	}
	// pull to refresh buttons
	$scope.doRefresh = function(){
		$scope.messages = [];
		$scope.postsCompleted = false;
		$scope.getPosts();
		$scope.$broadcast('scroll.refreshComplete');
	}
	$scope.addMesage = function(){
		var newMessage = new function() {
			this.message = $scope.datamessage;
			this.from = '2';
			this._id	= '12';
			this.title	= 'sample';
			this.image	= 'http://3.bp.blogspot.com/-bTWNRjookMQ/VYGjnv5nKtI/AAAAAAAAA08/wXshQ9sNDeU/s100-c/blank-792125_1280.jpg';
		}
		$scope.messages = $scope.messages.concat(newMessage);
		$scope.datamessage = "";
		$ionicScrollDelegate.scrollBottom();
    }
}]);
// feed list data sample
app.controller('FeedsListCtrl', ['$scope', '$state', 'Feeds', function($scope, $state, Feeds ){
	$scope.feeds = Feeds.items;
	$scope.showNews = function(index){
		Feeds.selectedFeed = $scope.feeds[index];
		$state.go('app.feed');
	}
}]);
// single feed posts
app.controller('FeedCtrl', ['$scope', '$state', 'Feeds', function($scope, $state, Feeds ){
	
	$scope.numPosts = 20;
	$scope.stories = [];
	$scope.feed = Feeds.selectedFeed;
	$scope.showNews = function(index){
		Feeds.selectedFeed = $scope.feeds[index];
	}
	$scope.loadFeed = function() {
      var feed = new google.feeds.Feed(Feeds.selectedFeed.feed);
      feed.setNumEntries($scope.numPosts);
      var count = 1;
      feed.load(function(result) {
        if (!result.error) {
          $scope.feed = result.feed;
			 $scope.$apply();
        }
      });
    }
    $scope.loadFeed();
	 $scope.getImage = function(index) {
		var selectedItem = $scope.feed.entries[index];
		var content = selectedItem.content;
		var imgthumb = "";
		a = content.indexOf("<img"); 
		b = content.indexOf("src=\"",a); 
		c = content.indexOf("\"",b+5); 
		d = content.substr(b+5,c-b-5);
		if((a!=-1)&&(b!=-1)&&(c!=-1)&&(d!="")) {
			imgthumb = d;
		}
		if(imgthumb) {
			return imgthumb;
		} else {
			return 'img/photo.png';
		}
    }
	 $scope.showFullFeed = function(indexFeed){
	 	Feeds.selectedNews = $scope.feed.entries[indexFeed];
		$state.go('app.feedsingle');
	 }
}]);
app.controller('FeedSingleCtrl', ['$scope', '$state', 'Feeds', '$sce', function($scope, $state, Feeds, $sce ){
	$scope.feedContent = Feeds.selectedNews;
	$scope.content = $sce.trustAsHtml($scope.feedContent.content);
	
}]);