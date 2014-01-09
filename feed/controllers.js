angular.module('feedServices', ['ngResource']).
    factory('Feed', function ($resource) {
        var url = apiUrl;
        url = url.split(':').join('\\:');
        return $resource(url + '/feed/:feedId', {}, {
            query: { method: 'JSONP', params: { feedId: 'search', q: ' ', callback: 'JSON_CALLBACK' }, isArray: true },
            get: { method: 'JSONP', params: { feedId: '', callback: 'JSON_CALLBACK' } }
        });
    });

var feedsApp = angular.module('feeds', ['ngRoute', 'feedServices']);

feedsApp.config(['$routeProvider', function ($routeProvider) {
      $routeProvider.
          when('/', { templateUrl: 'feed-list.html', controller: 'FeedListCtrl' }).
          when('/:feedId', { templateUrl: 'feed-detail.html', controller: 'FeedDetailCtrl' }).
          otherwise({ redirectTo: '/' });
  }]);

angular.module('feeds').controller('FeedListCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.feeds = null;

    $scope.init = function() {
        $http.get(apiUrl + '/feed?q=%20')
            .success(function(data, status, headers, config) {
                $scope.feeds = data.feeds;
            })
            .error(function(data, status, headers, config) {
                alert("Exception occured");
            });
    }
}]);

angular.module('feeds').controller('FeedDetailCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
    $scope.feed = null;
    $scope.values = {};

    $scope.init = function() {
        $http.get(apiUrl + '/feed/' + $routeParams.feedId)
            .success(function(data, status, headers, config) {
                $scope.feed = data;
                $scope.loadLastValues();
            })
            .error(function(data, status, headers, config) {
                alert("Exception occured");
            });
    };

    $scope.loadLastValues = function () {
        var self = $scope;
        $http.jsonp(dwUrl + '/feed/' + $routeParams.feedId + '?limit=1&callback=JSON_CALLBACK')
            .success(function (data, status, headers, config) {
                self.values = data;
                self.updateFeedValues(data);
            })
            .error(function (data, status, headers, config) {
                self.setValuesToError('error');
            });
    }

    $scope.updateFeedValues = function (data) {
        if (data.status != 'ok') {
            $scope.setValuesToError('failed to load');
            return;
        }

        if (data.table.rows.length == 0) {
            $scope.setValuesToError('no data');
            return;
        }

        for (var a = 0; a < $scope.feed.streams.length; a++) {
            var stream = $scope.feed.streams[a];
            for (var b = 0; b < data.table.cols.length; b++) {
                if (stream.code == data.table.cols[b].id) {
                    stream.value = data.table.rows[0].c[b].v;
                }
            }
        }
    }

    $scope.setValuesToError = function (status) {
        for (var a = 0; a < $scope.feed.streams.length; a++) {
            $scope.feed.streams[a].value = status;
        }
    }

    $scope.isDescSet = function () {
        return $scope.feed && $scope.feed.description && $scope.feed.description.length > 0;
    }
}]);
