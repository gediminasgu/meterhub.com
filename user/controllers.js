angular.module('userServices', ['ngResource']).
    factory('User', function ($resource) {
        return $resource(apiUrl + '/feed/user/:userId', {}, {
            query: { method: 'JSONP', params: { userId: '', callback: 'JSON_CALLBACK' }, isArray: true },
            get: { method: 'JSONP', params: { userId: '', callback: 'JSON_CALLBACK' } }
        });
    });

var usersApp = angular.module('users', ['ngRoute', 'userServices']);

usersApp.config(['$routeProvider', function ($routeProvider) {
      $routeProvider.
          when('/', { templateUrl: 'user-list.html', controller: 'UserListCtrl' }).
          when('/:userId', { templateUrl: 'user-detail.html', controller: 'UserDetailCtrl' }).
          otherwise({ redirectTo: '/' });
  }]);

function UserListCtrl($scope, Feed) {
    //$scope.feeds = Feed.query();
    $scope.feeds = function () { document.location.href = '/feed'; };
}

angular.module('users').controller('UserDetailCtrl', ['$scope', '$routeParams', '$http', '$window', function($scope, $routeParams, $http, $window) {
    $scope.userId = $routeParams.userId;
    $scope.feeds = [];
    $scope.isBusy = false;

    $scope.init = function () {
      $scope.isBusy = true;
      $http.get(apiUrl + '/feed?user=' + $routeParams.userId)
        .success(function(data, status, headers, config) {
          $scope.feeds = data.feeds;
        })
        .error(function(data, status, headers, config) {
          $scope.isBusy = false;
          if (data && data.message)
            $window.alert(data.message);
          else
            $window.alert('Feeds loading failed');
        });
    };
}]);