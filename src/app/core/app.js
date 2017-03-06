var cerebro = angular.module('cerebro', ['ionic']);
cerebro
.run(function( $ionicPlatform ) {

	$ionicPlatform.ready(function() {
		if ( window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard ) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}

		if ( window.StatusBar ) StatusBar.styleDefault();
	});

})

.config(function( $stateProvider, $urlRouterProvider, $ionicConfigProvider) {

	$ionicConfigProvider.tabs.position('bottom');
	$ionicConfigProvider.views.swipeBackEnabled(false);

	// ======================================================================================================= ROOT

	$stateProvider
	.state('root', {
		url 		: '/root',
		abstract 	: true,
		templateUrl : 'templates/root.htm',
		controller 	: 'rootCtrl'
	})

	// ======================================================================================================= BLUETOOTH

	.state('root.bluetooth-control', {
		url		: '/bluetooth-control',
		views	: {
			"tab-bluetooth" : {
				templateUrl : 'templates/bluetooth-control.htm',
				controller 	: 'bluetoothControlCtrl'
			}
		}
	})

	// ======================================================================================================= DOOR KEY

	.state('root.door-lock-control', {
		url		: '/door-lock-control',
		views	: {
			"tab-door-lock" : {
				templateUrl : 'templates/door-lock-control.htm',
				controller 	: 'doorLockControlCtrl'
			}
		}
	});

	$urlRouterProvider.otherwise('/root/bluetooth-control');

});
