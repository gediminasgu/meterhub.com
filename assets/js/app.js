var app = angular.module('app', ['dashboards', 'users', 'feeds']);

app.config(['$controllerProvider', function($controllerProvider) {
	app.controllerProvider = $controllerProvider;
}]);

angular.module("dashboards", []);
angular.module("users", []);
angular.module("feeds", []);
