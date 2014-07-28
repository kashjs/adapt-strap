angular.module('adaptv.adaptStrapDocs')
  .controller('tableliteCtrl', ['$scope', function ($scope) {
    $scope.models = {
      carsForSale: [
        {
          name: 'Audi A4',
          modelYear: 2009,
          price: 34000
        },
        {
          name: 'BMW 328i',
          modelYear: 2012,
          price: 39000
        },
        {
          name: 'Audi A6',
          modelYear: 2012,
          price: 44000
        },
        {
          name: 'Audi S8',
          modelYear: 2014,
          price: 100000
        },
        {
          name: 'Audi A4',
          modelYear: 2009,
          price: 34000
        },
        {
          name: 'BMW 328i',
          modelYear: 2012,
          price: 39000
        },
        {
          name: 'Audi A6',
          modelYear: 2012,
          price: 44000
        },
        {
          name: 'Audi S8',
          modelYear: 2014,
          price: 100000
        },
        {
          name: 'Audi A6',
          modelYear: 2012,
          price: 44000
        },
        {
          name: 'Audi S8',
          modelYear: 2014,
          price: 100000
        },
        {
          name: 'Audi A6',
          modelYear: 2012,
          price: 44000
        },
        {
          name: 'Audi S8',
          modelYear: 2014,
          price: 100000
        }
      ]
    };

    $scope.carsTableColumnDefinition = [
      {
        columnHeaderDisplayName: 'Model',
        displayProperty: 'name'
      },
      {
        columnHeaderTemplate: '<span><i class="glyphicon glyphicon-calendar"></i> Model Year</span>',
        displayProperty: 'modelYear'
      },
      {
        columnHeaderTemplate: '<span><i class="glyphicon glyphicon-usd"></i> Price</span>',
        displayProperty: 'price',
        cellFilter: 'currency'
      }
    ];
  }]);
