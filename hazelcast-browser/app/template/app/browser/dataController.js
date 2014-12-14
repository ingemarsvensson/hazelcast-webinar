app.controller('data', ['$scope','$routeParams', 'data', function($scope, $routeParams, data) {

		$('.handle').drags({direction:'horizontal'});
		$('.vhandle').drags({direction:'vertical', cursor:'ns-resize'});

		$scope.routeParams = $routeParams;
		$scope.ds = data;

		if ($routeParams.collection) {
			data.loadCollection($routeParams.collection).success(function(data) {
				$scope.data = data.data;
			});
		}
		if ($routeParams.database) {
			var p = data.getCollections($routeParams.database);
			p.then(function(data) {
				$scope.collections = data;
			});
		} else {
			data.getDatabases().success(function(data) {
				console.log(data);
				$scope.collections = data;
			});
		}

		var h = 0;
		$scope.$watch('data', function() {
			setTimeout(function() {
				var hidden = $('tr.hidden th');
				$('tr:not(.hidden) th').each(function(key,ele) {
					var e = $(ele)
					h = e.outerHeight();
					$(hidden[key]).css({
						width:e.width()
					}).parent().css({marginTop:d.scrollTop()-h});
				});
			}, 10);
		});

		$scope.append = function(field,e) {
			$scope.ds.query = $scope.ds.query.trim()+" "+field;
			e.preventDefault();
		}
		$scope.run = function(e) { 
			data.runQuery().then(function(response) {
				$scope.data = response.data.data
			});
			e.preventDefault(); 
		}
		var d = $('.data');
		d.scroll(function() {
			$('tr.hidden').css({marginTop:d.scrollTop()-h});
		}).trigger('scroll');

	}
])
