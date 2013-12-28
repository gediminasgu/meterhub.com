var app = angular.module('app', ['feeds', 'dashboards', 'users']);

app.config(['$controllerProvider', '$interpolateProvider', function($controllerProvider, $interpolateProvider) {
	app.controllerProvider = $controllerProvider;
    //$interpolateProvider.startSymbol('{[{').endSymbol('}]}');
}]);

angular.module('feeds', []);
angular.module('dashboards', []);
angular.module('users', []);