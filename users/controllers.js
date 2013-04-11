angular.module('userServices', ['ngResource']).
    factory('User', function ($resource) {
        return $resource('http://www.meterhub.com/managementapi/feed/user/:userId', {}, {
            query: { method: 'JSONP', params: { userId: '', callback: 'JSON_CALLBACK' }, isArray: true },
            get: { method: 'JSONP', params: { userId: '', callback: 'JSON_CALLBACK' } }
        });
    });

angular.module('users', ['userServices']).
  config(['$routeProvider', function ($routeProvider) {
      $routeProvider.
          when('/', { templateUrl: 'user-list.html', controller: UserListCtrl }).
          when('/:userId', { templateUrl: 'user-detail.html', controller: UserDetailCtrl }).
          otherwise({ redirectTo: '/' });
  }]);

function UserListCtrl($scope, Feed) {
    //$scope.feeds = Feed.query();
    $scope.feeds = function () { document.location.href = '/feeds'; };
}

function UserDetailCtrl($scope, $routeParams, $http) {
    $scope.userId = $routeParams.userId;
    $scope.feeds = [];

    $scope.loadFeeds = function () {
        $http.jsonp('http://www.meterhub.com/managementapi/feed/user/' + $routeParams.userId + '?callback=JSON_CALLBACK')
            .success(function (data) { $scope.feeds = data; });
    };

    $scope.loadFeeds();
}
