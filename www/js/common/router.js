app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  	//sidebar
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/sidebar-menu.html"
    })
	 //  login page
	 .state('app.login', {
      url: "/login",
      views: {
        'menuContent' :{
          	templateUrl: "templates/login.html",
		  		controller: "LoginCtrl"
        }
      }
    })
	 // Sign up page
	 .state('app.signup', {
      url: "/signup",
      views: {
        'menuContent' :{
          	templateUrl: "templates/sign-up.html",
		  		controller: "SignUpCtrl"
        }
      }
    })
	 // Sign up page
	 .state('app.forgot', {
      url: "/forgot",
      views: {
        'menuContent' :{
          	templateUrl: "templates/forgot.html",
		  		controller: "ForgotCtrl"
        }
      }
    })
	 // Gallery page
	 .state('app.gallery', {
      url: "/gallery",
		cache : false, 
      views: {
        'menuContent' :{
          	templateUrl: "templates/gallery.html",
		  		controller: "GalleryCtrl"
        }
      }
    })
	 // Gallery list page
	 .state('app.gallerylist', {
      url: "/gallerylist",
		cache : false,
      views: {
        'menuContent' :{
          	templateUrl: "templates/gallery-list.html",
		  		controller: "GalleryCtrl"
        }
      }
    })
	 // Gallery list page
	 .state('app.videos', {
      url: "/videos",
		cache : false,
      views: {
        'menuContent' :{
          	templateUrl: "templates/videos.html",
		  		controller: "VideosCtrl"
        }
      }
    })
	 // Blog page
	 .state('app.blog', {
      url: "/blog",
		cache : false,
      views: {
        'menuContent' :{
          	templateUrl: "templates/blog.html",
		  		controller: "BlogCtrl"
        }
      }
    })
	 // profile page
	 .state('app.profile', {
      url: "/profile",
      views: {
        'menuContent' :{
          	templateUrl: "templates/profile.html",
		  		controller: "ProfileCtrl"
        }
      }
    })
	 // profile page
	 .state('app.news', {
      url: "/news",
      views: {
        'menuContent' :{
          	templateUrl: "templates/news.html",
		  		controller: "NewsCtrl"
        }
      }
    })
	 // friends page
	 .state('app.friends', {
      url: "/friends",
      views: {
        'menuContent' :{
          	templateUrl: "templates/friends.html",
		  		controller: "FriendsCtrl"
        }
      }
    })
	.state('app.post', {
      url: "/post",
      views: {
        'menuContent' :{
          	templateUrl: "templates/post.html",
		  		controller: "PostCtrl"
        }
      }
    })
	 .state('app.settings', {
      url: "/settings",
      views: {
        'menuContent' :{
          	templateUrl: "templates/settings.html",
		  		controller: "SettingsCtrl"
        }
      }
    })
	 .state('app.features', {
      url: "/features",
      views: {
        'menuContent' :{
          	templateUrl: "templates/features.html",
		  		controller: "FeaturesCtrl"
        }
      }
    })
	.state('app.contact', {
      url: "/contact",
      views: {
        'menuContent' :{
          	templateUrl: "templates/contact.html",
		  		controller: "ContactCtrl"
        }
      }
    })
	 .state('app.about', {
      url: "/about",
      views: {
        'menuContent' :{
          	templateUrl: "templates/about.html",
		  		controller: "AboutCtrl"
        }
      }
    })
	 .state('app.intro', {
      url: "/intro",
      views: {
        'menuContent' :{
          	templateUrl: "templates/intro.html",
		  		controller: "IntroCtrl"
        }
      }
    })
	 .state('app.socialprofile', {
      url: "/socialprofile",
      views: {
        'menuContent' :{
          	templateUrl: "templates/social-profile.html",
		  		controller: "SocialProfileCtrl"
        }
      }
    })
	 .state('app.push', {
      url: "/push",
      views: {
        'menuContent' :{
          	templateUrl: "templates/push.html",
		  		controller: "PushCtrl"
        }
      }
    })
	 .state('app.admob', {
      url: "/admob",
      views: {
        'menuContent' :{
          	templateUrl: "templates/admob.html",
		  		controller: "AdmobCtrl"
        }
      }
    })
	 .state('app.messages', {
      url: "/messages",
      views: {
        'menuContent' :{
          	templateUrl: "templates/messages.html",
		  		controller: "MessagesCtrl"
        }
      }
    })
	 .state('app.message', {
      url: "/message",
      views: {
        'menuContent' :{
          	templateUrl: "templates/message.html",
		  		controller: "MessageCtrl"
        }
      }
    })
	 .state('app.feedslist', {
      url: "/feedslist",
      views: {
        'menuContent' :{
          	templateUrl: "templates/feeds-list.html",
		  		controller: "FeedsListCtrl"
        }
      }
    })
	 .state('app.feed', {
      url: "/feed",
      views: {
        'menuContent' :{
          	templateUrl: "templates/feed.html",
		  		controller: "FeedCtrl"
        }
      }
    })
	 .state('app.feedsingle', {
      url: "/feedsingle",
      views: {
        'menuContent' :{
          	templateUrl: "templates/feed-single.html",
		  		controller: "FeedSingleCtrl"
        }
      }
    })
	 //sidebar
    .state('wordpress', {
      url: "/wordpress",
      abstract: true,
      templateUrl: "templates/wordpress/sidebar-menu.html"
    })
	 // Blog page
	 .state('wordpress.blog', {
      url: "/blog",
      views: {
        'menuWorPress' :{
          	templateUrl: "templates/wordpress/blog.html",
		  		controller: "WordpressBlogCtrl"
        }
      }
    })
	 .state('wordpress.tag', {
      url: "/tag/:type/:slug",
      views: {
        'menuWorPress' :{
          	templateUrl: "templates/wordpress/blog.html",
		  		controller: "WordpressTagCtrl"
        }
      }
    })
	 // articles page wordpress
	 .state('wordpress.post', {
      url: "/post",
		cache : false,
      views: {
        'menuWorPress' :{
          	templateUrl: "templates/wordpress/post.html",
		  		controller: "WordpressPostCtrl"
        }
      }
    })
	 // categories page wordpress
	 .state('wordpress.categories', {
      url: "/categories",
      views: {
        'menuWorPress' :{
          	templateUrl: "templates/wordpress/categories.html",
		  		controller: "WordpressCategoriesCtrl"
        }
      }
    })
	 // tags page wordpress
	 .state('wordpress.tags', {
      url: "/tags",
      views: {
        'menuWorPress' :{
          	templateUrl: "templates/wordpress/tags.html",
		  		controller: "WordpressTagsCtrl"
        }
      }
    })
	 //  login page
  	$urlRouterProvider.otherwise("/app/login");
})