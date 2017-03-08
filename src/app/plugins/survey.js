priscillaApp
.factory("$survey", function($q, $callApi, $appConfig) {
	var surveyDataStorage =	surveyData = {},

		_save = function() { localStorage.setItem( "surveyData", JSON.stringify( surveyDataStorage ) ) },

		_pull = function( propertyCode, bookingId, language, version ) {
			return $q(function(resolve, reject) {

				$callApi.get( $appConfig.$getApi( 'surveyData' ) +
				"\?propertyCode\=" + $scope.bookingInfo.propertyCode +
				"\&language\=" + $scope.appScope.language )
				.then(function(response){

					if ( response.data.status.toLowerCase() == "error" ) {
						reject();
					} else {
						surveyDataStorage[ propertyCode ][ bookingId ][ language ] 	= response.data.data;
						surveyDataStorage[ propertyCode ][ bookingId ].submitted 	= false;
						surveyDataStorage[ propertyCode ][ bookingId ].version 		= version;
						surveyData = {
							questions	: response.data.data,
							submitted	: false
						}
						_save();
						resolve( surveyData );
					}

				}).catch(function(response){
					reject();
				});

			}); //-- end of $q
		},

		_load = function( _propertyCode, _bookingId, _language ) {
			return $q(function(resolve, reject) {

				var version 		= ( Math.round( +new Date() / 1000 ) ).toString().substring(0,6),
					propertyCode 	= _propertyCode || 0,
					bookingId 		= _bookingId 	|| 0,
					language 		= _language 	|| "English";

				if ( localStorage.getItem("surveyData") ) surveyDataStorage = JSON.parse( localStorage.getItem("surveyData") );

				if ( propertyCode in surveyDataStorage ) {

					if ( bookingId in surveyDataStorage[ propertyCode ] ) {

						if ( language in surveyDataStorage[ propertyCode ][ bookingId ] ) {

							surveyData.questions = surveyDataStorage[ propertyCode ][ bookingId ][ language ]
							surveyData.submitted = surveyDataStorage[ propertyCode ][ bookingId ].submitted;
							resolve( surveyData );

						} else {
							_pull( propertyCode, bookingId, language, version )
							.then( function(response){ resolve(response) })
							.catch(function(){ reject() });
						}

					} else {
						_pull( propertyCode, bookingId, language, version )
						.then( function(response){ resolve(response) })
						.catch(function(){ reject() });
					}

				} else {
					_pull( propertyCode, bookingId, language, version )
					.then( function(response){ resolve(response) })
					.catch(function(){ reject() });
				} //-- end if

			}); //-- end of $q
		},

		_submit = function( propertyCode, bookingId, questions ) {
			return $q(function(resolve, reject) {

				$callApi.post( $appConfig.$getApi( 'submitSurvey' ) +
				"\?bookingId\=" 	+ _bookingId +
				"\&propertyCode\=" 	+ _propertyCode +
				"\&surveyData\=" 	+ JSON.stringify( questions ) )
				.then(function(response){

					if ( response.data.status.toLowerCase() == "error" ) {
						reject();
					} else {
						surveyDataStorage[ propertyCode ][ bookingId ].submitted = true;
						_save();
						resolve();
					}

				}).catch(function(){
					reject();
				});

			}); //-- end of $q
		};

	return {
		save	: _save,
		pull	: _pull,
		load	: _load,
		submit	: _submit
	};
});
