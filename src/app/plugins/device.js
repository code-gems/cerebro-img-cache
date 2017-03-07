cerebro
.factory('$device', function() {
	var factory = {
			platform	: 'Browser',
			deviceId	: "",
			deviceAppId : 1
		};

	factory.load = function() {
		if ( 'device' in window ) {
			angular.extend( factory, window.device );
			localStorage.setItem( "deviceInfo", JSON.stringify( $scope.deviceInfo ) );
		} else {
			console.warn('Warning: No device object initialized...');
		} //-- end if

		return factory;
	};

	return factory;
});
