// (function(){
  var card = angular.module('cardApp', [])
  .factory('RestoranService', function($http) {
    function RestoranService() {
      var self = this;

      self.errors = null;
      self.partySize = 2;
      self.selectedTime = null;
      self.selectedDate = new Date().getDate();
      self.timeList = [];

      self.getOpenTables = function( date = self.selectedDate, party = 2 ) {
        console.log(date, party)
        self.errors = "Loading..."
        self.timeList = []
        $http({
          method: "GET",
          url: `https://hostme-services-qa.azurewebsites.net/api/core/mb/restaurants/4531/availability?date=2018-10-${date}T12:00:00%2B03:00&partySize=${party}&rangeInMinutes=720`
        })
        .then(function successCallback(r) {
          if (r.data && r.data.length > 0) {
            self.errors = null;
            openTime = r.data.map(item => item.time.slice(0,5))
            console.log(openTime)
            self.timeList = openTime;
          }
          else {
            self.errors = 'Sorry, but no times available to this date.';
          }
        }, function errorCallback(r) {});
      }
    }
    return new RestoranService();
  })

  .controller('calendarController', function cardController($scope, RestoranService) {
    $scope.service = RestoranService;
    $scope.lineDepressed = [27, 28, 29, 30, 31]
    $scope.datelist = [
      [1, 2],
      [3,  4,  5,  6,  7,  8, 9],
      [10, 11, 12, 13, 14, 15, 16],
      [17, 18, 19, 20, 21, 22, 23],
      [24, 25, 26, 27, 28, 29, 30]
    ];
    $scope.setActive = function(date) {
      RestoranService.selectedDate = date;
      RestoranService.getOpenTables(date, RestoranService.partySize)
    }
  })
  .controller('mobileCal', function mobileCal($scope, RestoranService) {
    $scope.service = RestoranService;
    $scope.show = false;
    $scope.today = new Date().getDate();
    $scope.selected = RestoranService.selectedDate;
  })
  .controller('personsController', function personsController($scope, RestoranService) {
    $scope.service = RestoranService;
    $scope.typeOptions = [
        { name: '1 guest', value: '1' }, 
        { name: '2 guests', value: '2' }, 
        { name: '3 guests', value: '3' },
        { name: '4 guests', value: '4' },
        { name: '5 guests', value: '5' }
      ];
      $scope.form = { type: $scope.typeOptions[1].value}
      $scope.setParty = function(party) {
        RestoranService.partySize = party;
        RestoranService.getOpenTables(RestoranService.selectedDate, party)
      }
  })
  
  .controller('timeController', function timeController($scope, RestoranService) {
    $scope.service = RestoranService;
    $scope.timeList = RestoranService.timeList;
    $scope.date = new Date().getDate();
    $scope.persons = RestoranService.partySize;
    $scope.selectTime = function(time) {
      $scope.selectedTime = time;
      RestoranService.selectedTime = time;
    }
  })
  .controller('titleController', function titleController($scope, RestoranService) {
    $scope.service = RestoranService;
    $scope.persons = RestoranService.partySize;
    RestoranService.getOpenTables()
  })
// })();