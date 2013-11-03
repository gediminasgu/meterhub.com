angular.module('app').controller('SignInCtrl', ['$scope', '$window', 'authentication', function ($scope, $window, authentication) {
	$scope.username = null;
	$scope.password = null;
	$scope.remember = false;

	$scope.submit = function() {
		authentication.signin($scope.username, $scope.password, $scope.remember, function() {
			$window.location.href = '/';
		}, function(data, status, headers) {
			if (data && data.message)
				$window.alert('Authentication failed: ' + data.message);
			else
				$window.alert('Authentication failed with unknown error.\nPlease try again.');
		});
		return false;
	};
}]);