cerebro
.controller('storeCtrl', function($scope, $rootScope, $state, $filter, $timeout, $q, $notifyMe, $device) {
	// ======================================================================================================= VERSION

	console.log("CEREBRO - Main Store [build v.1.0.1]");

	// ======================================================================================================= SCOPE VARIABLES

	$scope.appScope 						= {}; 															// main controller scope holder
	$scope.appScope.reloading 				= true;															// app scope - used to initialize DOM scope translations

	$scope.device							= $device;														// device scope holder
	$scope.notifyMe 						= $notifyMe;													// notifyme plugin scope holder

	$scope.modalScope 						= {};															// system modal scope holder
	$scope.modalScope.isVisible				= true;															// system modal - is visible

	// ======================================================================================================= LOCAL VARIABLES

	// ...

	// ======================================================================================================= LOCAL FUNCTIONS

	// ...

	// ======================================================================================================= SCOPE METHODS

	$scope.safeApply = function(fn) {
		var phase = this.$root.$$phase;
		if(phase == '$apply' || phase == '$digest') {
			if(fn && (typeof(fn) === 'function')) fn();
		} else {
			this.$apply(fn);
		}
	};

	$scope.appScope.onAppPause = function() { $rootScope.$broadcast("app-pause") };

	$scope.appScope.onAppResume = function() { $rootScope.$broadcast("app-resume") };

	$scope.initApp = function() {
		console.log("initApp")
		$scope.bindDeviceEvents();

		$scope.appScope.reloading 	= false;
		$scope.modalScope.isVisible	= false;
		$scope.safeApply();

	};

	// ======================================================================================================= EVENT LISTENERS

	$scope.bindDeviceEvents = function() {
		document.addEventListener("pause", $scope.appScope.onAppPause, false);

		document.addEventListener("resume", $scope.appScope.onAppResume, false);
	};

	document.addEventListener("deviceready", $scope.initApp, false);

	// ======================================================================================================= INITIALIZATION

	$scope.initApp();

});
