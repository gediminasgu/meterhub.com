angular.module('menu').controller('MenuCtrl', ['$scope', '$rootScope', '$window', 'authentication', function($scope, $rootScope, $window, authentication) {
	$scope.user = null;

	$scope.init = function() {
		$scope.user = authentication.getUser();
	};

	$scope.isAuthenticated = function() {
		return $scope.user;
	};

	$scope.logout = function() {
		authentication.logout();
		$window.location.href = '/';
	}
}]);