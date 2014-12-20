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
        }, 1000);
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
        filterOptions: $scope.filterOptions
    };
}]);