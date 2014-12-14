var app = angular.module('browser', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {

		$locationProvider.html5Mode(false);

		$routeProvider
			.when('/data', {
				templateUrl:'app/browser/data.html',
				controller:'data'
			})
			.when('/data/:database', {
				templateUrl:'app/browser/data.html',
				controller:'data'
			})
			.when('/data/:database/:collection', {
				templateUrl:'app/browser/data.html',
				controller:'data'
			})
			.otherwise({redirectTo:'/data'});

	}
]);
