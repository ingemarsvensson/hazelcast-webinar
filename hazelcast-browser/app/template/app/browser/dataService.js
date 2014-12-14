app.service('data', ['$http','$q','$rootScope',

	// Do some Asset gets

	function($http,$q,$rootScope) {

		var dataService = {
			query:'',
			getDatabases: function() {
				return $http.get('/template/data/Enterprise.json');
			},
			getCollections: function(database) {
				var d = $q.defer();
				$http.get('/template/data/Enterprise.json').success(function(data) {
					console.log('SUCCESS',data);
					d.resolve(data[database]);
				});
				return d.promise;
			},
			loadCollection: function(collection) {
				return $http.get('/template/data/'+collection+'.json');
			},
			runQuery: function() {
				return $http.get('/api/?query='+dataService.query);
			}
		};

		return dataService;
		

	}
]);
