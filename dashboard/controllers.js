angular.module('dashboards', ['ngRoute']).
  config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
          when('/', { templateUrl: 'dashboard-list.html', controller: DashboardListCtrl }).
          when('/:userId', { templateUrl: 'dashboard-detail.html', controller: DashboardDetailCtrl }).
          otherwise({ redirectTo: '/' });
  }]);

function DashboardListCtrl($scope, $routeParams, $http, $location) {
    $scope.userId = $routeParams.userId;
    $scope.charts = [];

    $scope.loadCharts = function () {
        $http.jsonp(apiUrl + '/chart/' + $routeParams.userId + '?callback=JSON_CALLBACK')
            .success(function (data) { $scope.charts = data; });
    };

    $scope.loadCharts();
}

function DashboardDetailCtrl($scope, $routeParams, $http, $window) {
    $scope.userId = $routeParams.userId;
    $scope.charts = [];

    $scope.init = function() {

        if ($window.location.protocol == 'https:')
            $window.location.href = $window.location.href.replace('https:', 'http:');

        $scope.loadFeeds();
    };

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
    },
    {
        "fid": 1,
        "cid": 19,
        "title": "Temperatures",
        "height": 400,
        "dimension": "day"
    }
        ];
    };
}
