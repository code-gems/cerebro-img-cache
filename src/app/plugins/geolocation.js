cerebro
.factory('$geolocation', function($q) {
	var factory = {};

	factory.getPosition = function() {
		return $q(function(resolve, reject) {

			if ("geolocation" in navigator) {

				navigator.geolocation.getCurrentPosition(
					function(position) {
						factory.latitude 	= position.coords.latitude;
						factory.longitude 	= position.coords.longitude;
						resolve( position.coords );
					},
					function(error){
						reject("Location: " + error.message);
					},
					{
						enableHighAccuracy: true,
						timeout : 10000
					}
				);

			} else {
				reject("Location not available.");
			}

		});
	};

	return factory;
});
