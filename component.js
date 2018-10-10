// (function(){
  var card = angular.module('cardApp', [])
  .controller('calendarController', function cardController($scope, $http, $rootScope) {
    $scope.lineDepressed = [27, 28, 29, 30, 31]
    $scope.datelist = [
      [1, 2],
      [3,  4,  5,  6,  7,  8, 9],
      [10, 11, 12, 13, 14, 15, 16],
      [17, 18, 19, 20, 21, 22, 23],
      [24, 25, 26, 27, 28, 29, 30]
    ];
    $scope.setActive = function(date) {
      $scope.selected = date;
      $rootScope.selected = date;
      $http({
        method: "GET",
        url: `https://hostme-services-qa.azurewebsites.net/api/core/mb/restaurants/4531/availability?date=2018-10-${date}T12:00:00%2B03:00&partySize=${$rootScope.form.type}&rangeInMinutes=720`
      })
      .then(function successCallback(r) {
        if (r.data && r.data.length > 0) {
          $rootScope.timelist = r.data.map(item => item.time.slice(0,5))
          $rootScope.error = null
        }
        else $rootScope.error = 'no times available to this date'
      }, function errorCallback(r) {});
    }
    $scope.selected = $rootScope.today = $rootScope.selected = new Date().getDate();
  })
  .controller('mobileCal', function mobileCal($scope, $rootScope) {
    $scope.show = false;
    $scope.today = $rootScope.today;
    $scope.selected = $rootScope.selected;
  })
  .controller('personsController', function personsController($scope, $rootScope, $http) {
    $rootScope.typeOptions = [
        { name: '1 guest', value: '1' }, 
        { name: '2 guests', value: '2' }, 
        { name: '3 guests', value: '3' },
        { name: '4 guests', value: '4' },
        { name: '5 guests', value: '5' }
      ];
      $rootScope.form = {type : $scope.typeOptions[0].value};
      $scope.date = $rootScope.selected || new Date().getDate();
      $scope.requestTable = function () {
        $http({
          method: "GET",
          url: `https://hostme-services-qa.azurewebsites.net/api/core/mb/restaurants/4531/availability?date=2018-10-${$scope.date}T12:00:00%2B03:00&partySize=${$rootScope.form.type}&rangeInMinutes=660`
        })
        .then(function successCallback(r) {
          if (r.data && r.data.length > 0) {
            $rootScope.timelist = r.data.map(item => item.time.slice(0,5))
            $rootScope.error = null
          }
          else $rootScope.error = 'no times available to this persons amount'
        }, function errorCallback(r) { console.log(r)})
      }
  })
  
  .controller('timeController', function timeController($scope, $http, $rootScope) {
    $scope.timelist = []
    $scope.date = new Date().getDate();
    $scope.persons = $rootScope.form;
    $http({
      method: "GET",
      url: `https://hostme-services-qa.azurewebsites.net/api/core/mb/restaurants/4531/availability?date=2018-10-${$scope.date}T12:00:00%2B03:00&partySize=${$rootScope.form.type}&rangeInMinutes=660`
    })
    .then(function successCallback(r) {
      if (r.data && r.data.length > 0) {
        $rootScope.timelist = r.data.map(item => item.time.slice(0,5))
        $rootScope.error = null
      }
      else $rootScope.error = 'no times available to this date'
    }, function errorCallback(r) { console.log(r)})
    $scope.selectTime = function(time) {
      $scope.selectedTime = time;
      $rootScope.selectedTime = time;
    }
  })
  .controller('titleController', function titleController($scope, $rootScope) {
    
  })
// })();