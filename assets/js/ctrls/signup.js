angular.module('app').controller('SignUpCtrl', ['$scope', '$rootScope', '$window', '$http', 'authentication', function ($scope, $rootScope, $window, $http, authentication) {

	$scope.user = {
		username: '',
		email: '',
		password: '',
		name: '',
	};
	$scope.isBusy = false;
	$scope.validate = false;	// just to do not show error fields, until submit is clicked

	$scope.isAuthenticated = function(){
		return authentication.isAuthenticated();
	};

	$scope.submit = function() {
		$scope.validate = true;
		if (!$scope.isValidForm())
			return false;

		$scope.isBusy = true;
		$scope.user.name = $scope.user.username;
		$http.post(apiUrl + '/user', $scope.user)
			.success(function(data, status, headers, config) {
				$rootScope.$emit('UserSignedUp', $scope.user);
				$window.location = '/signin?signedUp=true';
			})
			.error(function(data, status, headers, config) {
				$scope.isBusy = false;
				if (data && data.message)
					$window.alert(data.message);
				else
					$window.alert('Sign up failed with unknown error.\nPlease try again.');
			});
		return false;
	};

	$scope.isValidForm = function() {
		return $scope.isValidUserName()
			&& $scope.isValidEmail()
			&& $scope.isValidPassword();
	};

	$scope.isValidUserName = function() {
		return $scope.user.username != null && $scope.user.username.length > 0;
	};

	$scope.isValidEmail = function() {
		return $scope.user.email != null && $scope.user.email.length > 0;
	};

	$scope.isValidPassword = function() {
		return $scope.user.password != null && $scope.user.password.length >= 6;
	};

}]);