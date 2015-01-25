angular.module('adaptv.adaptStrapDocs')
  .controller('tableliteCtrl', ['$scope', function ($scope) {
    $scope.models = {
      changeInfo: [],
      searchText: '',
      selectedCars: [
        {
          id: 1,
          name: 'Audi A4',
          modelYear: 2009,
          price: 34000
        }
      ],
      carsForSale: [
        {
          id: 1,
          name: 'Audi A4',
          modelYear: 2009,
          price: 34000
        },
        {
          id: 2,
          name: 'BMW 328i',
          modelYear: 2012,
          price: 39000
        },
        {
          id: 3,
          name: 'Audi A6',
          modelYear: 2012,
          price: 44000
        },
        {
          id: 4,
          name: 'Audi S8',
          modelYear: 2014,
          price: 100000
        },
        {
          id: 5,
          name: 'Audi A4',
          modelYear: 2009,
          price: 34000
        },
        {
          id: 6,
          name: 'BMW 328i',
          modelYear: 2012,
          price: 39000
        },
        {
          id: 7,
          name: 'Audi A6',
          modelYear: 2012,
          price: 44000
        },
        {
          id: 8,
          name: 'Audi S8',
          modelYear: 2014,
          price: 100000
        },
        {
          id: 9,
          name: 'Audi A6',
          modelYear: 2012,
          price: 44000
        },
        {
          id: 10,
          name: 'Audi S8',
          modelYear: 2014,
          price: 100000
        },
        {
          id: 11,
          name: 'Audi A6',
          modelYear: 2012,
          price: 44000
        },
        {
          id: 12,
          name: 'Audi S8',
          modelYear: 2014,
          price: 100000
        }
      ]
    };

    $scope.carsTableColumnDefinition = [
      {
        columnHeaderDisplayName: 'Model',
        displayProperty: 'name',
        sortKey: 'name'
      },
      {
        columnHeaderTemplate: '<span><i class="glyphicon glyphicon-calendar"></i> Model Year</span>',
        template: '<strong>{{ item.modelYear }}</strong>',
        sortKey: 'modelYear',
        width: '12em'
      },
      {
        columnHeaderTemplate: '<span><i class="glyphicon glyphicon-usd"></i> Price</span>',
        displayProperty: 'price',
        cellFilter: 'currency',
        sortKey: 'price',
        width: '9em'
      },
      {
        columnHeaderDisplayName: 'Buy',
        templateUrl: 'src/tablelite/docs/buyCell.html',
        width: '4em'
      }
    ];

    $scope.onChange = function(o, n, data) {
      $scope.models.changeInfo.push({
        startPosition: o,
        endPosition: n,
        data: data
      });
    };

    // ========== ui handlers ========== //
    $scope.buyCar = function (car) {
      alert(car.name);
    };

    $scope.checkRowSelected = function (item, index) {
      var found = false;
      $scope.models.selectedCars.forEach(function (selectedItem) {
        if (item.id === selectedItem.id) {
          found = true;
        }
      });
      return found ? 'info row-' + index : 'row-' + index;
    };

  }]);
