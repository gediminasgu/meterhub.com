var app = angular.module('app', ['menu', 'feeds', 'dashboards', 'users']);

app.config(['$controllerProvider', '$interpolateProvider', function($controllerProvider, $interpolateProvider) {
	app.controllerProvider = $controllerProvider;
    //$interpolateProvider.startSymbol('{[{').endSymbol('}]}');
}]);


angular.module('menu', []);
angular.module('feeds', []);
angular.module('dashboards', []);
angular.module('users', []);