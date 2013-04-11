angular.module('feedServices', ['ngResource']).
    factory('Feed', function ($resource) {
        return $resource('http://www.meterhub.com/managementapi/feed/:feedId', {}, {
            query: { method: 'JSONP', params: { feedId: 'search', q: ' ', callback: 'JSON_CALLBACK' }, isArray: true },
            get: { method: 'JSONP', params: { feedId: '', callback: 'JSON_CALLBACK' } }
        });
    });

angular.module('feeds', ['feedServices']).
  config(['$routeProvider', function ($routeProvider) {
      $routeProvider.
          when('/feeds', { templateUrl: 'feed-list.html', controller: FeedListCtrl }).
          when('/feeds/:feedId', { templateUrl: 'feed-detail.html', controller: FeedDetailCtrl }).
          otherwise({ redirectTo: '/feeds' });
  }]);

function FeedListCtrl($scope, Feed) {
    $scope.feeds = Feed.query();
}

function FeedDetailCtrl($scope, $routeParams, Feed) {
    $scope.feed = Feed.get({ feedId: $routeParams.feedId });

    //$scope.setImage = function (imageUrl) {
    //    $scope.mainImageUrl = imageUrl;
    //}

    $scope.isDescSet = function () {
        return $scope.feed.desc != undefined && $scope.feed.desc != null && $scope.feed.desc.length > 0;
    }
}
