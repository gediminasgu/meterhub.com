angular.module('userServices', ['ngResource']).
    factory('User', function ($resource) {
        return $resource(apiUrl + '/feed/user/:userId', {}, {
            query: { method: 'JSONP', params: { userId: '', callback: 'JSON_CALLBACK' }, isArray: true },
            get: { method: 'JSONP', params: { userId: '', callback: 'JSON_CALLBACK' } }
        });
    });

angular.module('users', ['userServices', 'ngRoute']).
  config(['$routeProvider', function ($routeProvider) {
      $routeProvider.
          when('/', { templateUrl: 'user-list.html', controller: UserListCtrl }).
          when('/:userId', { templateUrl: 'user-detail.html', controller: UserDetailCtrl }).
          otherwise({ redirectTo: '/' });
  }]);

function UserListCtrl($scope, Feed) {
    //$scope.feeds = Feed.query();
    $scope.feeds = function () { document.location.href = '/feed'; };
}

function UserDetailCtrl($scope, $routeParams, $http) {
    $scope.userId = $routeParams.userId;
    $scope.feeds = [];

    $scope.loadFeeds = function () {
        $http.jsonp(apiUrl + '/feed/user/' + $routeParams.userId + '?callback=JSON_CALLBACK')
            .success(function (data) { $scope.feeds = data; });
    };

    $scope.loadFeeds();
}
