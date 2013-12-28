angular.module('feedServices', ['ngResource']).
    factory('Feed', function ($resource) {
        return $resource(apiUrl + '/feed/:feedId', {}, {
            query: { method: 'JSONP', params: { feedId: 'search', q: ' ', callback: 'JSON_CALLBACK' }, isArray: true },
            get: { method: 'JSONP', params: { feedId: '', callback: 'JSON_CALLBACK' } }
        });
    });

angular.module('feeds', ['feedServices', 'ngRoute']).
  config(['$routeProvider', function ($routeProvider) {
      $routeProvider.
          when('/', { templateUrl: 'feed-list.html', controller: FeedListCtrl }).
          when('/:feedId', { templateUrl: 'feed-detail.html', controller: FeedDetailCtrl }).
          otherwise({ redirectTo: '/' });
  }]);

function FeedListCtrl($scope, Feed) {
    $scope.feeds = Feed.query();
}

function FeedDetailCtrl($scope, $routeParams, $http, Feed) {
    $scope.feed = Feed.get({ feedId: $routeParams.feedId });
    $scope.valuesLoading = false;
    $scope.values = {};

    //$scope.setImage = function (imageUrl) {
    //    $scope.mainImageUrl = imageUrl;
    //}

    $scope.loadLastValues = function () {

        console.log('called');
        if ($scope.valuesLoading)
            return;

        if ($scope.feed == null || $scope.feed.streams == undefined)
            return;

        $scope.valuesLoading = true;
        console.log('rendering');

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
        return $scope.feed.desc != undefined && $scope.feed.desc != null && $scope.feed.desc.length > 0;
    }
}
