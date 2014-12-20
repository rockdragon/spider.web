var app = angular.module('houseApp', []);

app.controller('houseController', ['$scope', function ($scope) {
    $scope.houseData = angular.fromJson(document.getElementById('houseData').value);

    console.log($scope.houseData.address);

    $scope.mapObj = null;
    $scope.drawMap = function (title, longitude, latitude) {
        $scope.mapObj = new AMap.Map("iMap", {
            //二维地图显示视口
            view: new AMap.View2D({
                center: new AMap.LngLat(longitude, latitude),//地图中心点
                zoom: 13 //地图显示的缩放级别
            })
        });
        var marker = new AMap.Marker({
            position: $scope.mapObj.getCenter()
        });
        marker.setMap($scope.mapObj);
        marker.setTitle(title); //设置鼠标划过点标记显示的文字提示
    };

    $scope.drawMap($scope.houseData.title, $scope.houseData.longitude, $scope.houseData.latitude);
}]);