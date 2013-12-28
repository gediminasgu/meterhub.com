angular.module('dashboardServices', ['ngResource']).
    factory('Dashboard', function ($resource) {
        return $resource( apiUrl + '/feed/user/:userId', {}, {
            query: { method: 'JSONP', params: { userId: '', callback: 'JSON_CALLBACK' }, isArray: true },
            get: { method: 'JSONP', params: { userId: '', callback: 'JSON_CALLBACK' } }
        });
    });

angular.module('dashboards', ['dashboardServices', 'ngRoute']).
  config(['$routeProvider', function ($routeProvider) {
      $routeProvider.
          when('/', { templateUrl: 'dashboard-list.html', controller: DashboardListCtrl }).
          when('/:userId', { templateUrl: 'dashboard-detail.html', controller: DashboardDetailCtrl }).
          otherwise({ redirectTo: '/' });
  }]);

function DashboardListCtrl($scope, $routeParams, $http) {
    $scope.userId = $routeParams.userId;
    $scope.charts = [];

    $scope.loadCharts = function () {
        $http.jsonp(apiUrl + '/chart/' + $routeParams.userId + '?callback=JSON_CALLBACK')
            .success(function (data) { $scope.charts = data; });
    };

    $scope.loadCharts();
}

function DashboardDetailCtrl($scope, $routeParams, $http) {
    $scope.userId = $routeParams.userId;
    $scope.charts = [];

    $scope.initChart = function (chartId) {
        var c = charts[chartId];
        if (c != undefined && c != null && c.chart == undefined) {
            c.chart = new mh.chart();
            c.chart.init(c);
        }
    }

    $scope.loadFeeds = function () {
        /*$http.jsonp(apiUrl + '/chart/' + $routeParams.userId + '?callback=JSON_CALLBACK')
            .success(function (data) { $scope.feeds = data; });*/
        $scope.charts = [
    {
        "fid": 1,
        "cid": 16,
        "title": "Gas vs. Outside temperature (daily)",
        "height": 400,
        "dimension": "day"
    },
    {
        "fid": 1,
        "cid": 15,
        "title": "Gas vs. Outside temperature (hourly)",
        "height": 400,
        "dimension": "hour"
    },
    {
        "fid": 1,
        "cid": 17,
        "title": "Heating vs. Gas and room temperatures (hourly)",
        "height": 400,
        "dimension": "hour"
    },
    {
        "fid": 1,
        "cid": 18,
        "title": "Temperatures",
        "height": 400,
        "dimension": "hour"
    }
        ];
    };

    $scope.loadFeeds();
}
