var app = angular.module('sourceApp', ['ngGrid']);

app.controller('sourceController', ['$scope', '$http', function ($scope, $http) {
    $scope.source = document.getElementById('source').value;
    $scope.total = document.getElementById('total').value;
    console.log('source:', $scope.source, 'total:', $scope.total);

    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };
    $scope.totalServerItems = $scope.total;
    $scope.pagingOptions = {
        pageSizes: [10, 15, 20],
        pageSize: 15,
        currentPage: 1
    };
    $scope.setPagingData = function (data) {
        $scope.myData = data;
        //$scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get('jsonFiles/largeLoad.json').success(function (largeLoad) {
                    data = largeLoad.filter(function (item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                    $scope.setPagingData(data, page, pageSize);
                });
            } else {
                var url = ['/admin/source/', $scope.source, '/', pageSize, '/', page].join('');
                $http.post(url).success(function (largeLoad) {
                    $scope.setPagingData(largeLoad);
                });
            }
        }, 2000);
    };
    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, '');
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, '');
        }
    }, true);
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, '');


    $scope.gridOptions = {
        data: 'myData',
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        columnDefs: [
            {
                field: 'title', displayName: '标题', width: '42%',
                cellTemplate: '<a href="/admin/house/{{row.getProperty(\'id\')}}" target="_blank">{{row.getProperty(\'title\')}}</a>'
            },
            {field: 'city', displayName: '城市', width: '6%'},
            {field: 'overview', displayName: '概况', width: '26%'},
            {field: 'zone', displayName: '区域', width: '20%'},
            {field: 'price', displayName: '价格'}
        ]
    };
}]);