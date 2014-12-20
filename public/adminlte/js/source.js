var app = angular.module('sourceAPP', ['ngGrid']);

app.factory('dataService', ['$http', function($http){
    return {
        data: function(self) {
            $http.post('/admin/stat').then(function (response) {
                var json = response.data;
                self.data.count_soufun = json[0].ct;
                self.data.count_58 = json[1].ct;
                self.data.count_anjuke = json[2].ct;
            }, function (errResponse) {
                console.error('some error occurs: ', errResponse);
            });
        }
    };
}]);

app.controller('sourceController', ['$http', '$timeout', 'dataService',
        function ($http, $timeout, dataService) {
    var self = this;
    self.data = {};
    self.data.count_soufun = 'loading...';
    self.data.count_58 = 'loading...';
    self.data.count_anjuke = 'loading...';
    var retrieve = function(){
        dataService.data(self);
        $timeout(retrieve, 5000);
    };
    $timeout(retrieve, 1000);
}]);