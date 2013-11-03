angular.module('app').controller('MenuCtrl', ['$scope', '$location', 'authentication', function ($scope, $location, authentication) {
	$scope.user = null;

	$scope.init = function() {
		$scope.user = authentication.getUser();
	};

	$scope.isAuthenticated = function() {
		return $scope.user;
	};

	$scope.logout = function() {
		authentication.logout();
	}
}]);