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
        }
      ]
    };

    $scope.carsTableColumnDefinition = [
      {
        columnHeaderDisplayName: 'Model',
        displayProperty: 'name'
      },
      {
        columnHeaderDisplayName: 'Model Year',
        displayProperty: 'modelYear'
      },
      {
        columnHeaderDisplayName: 'Price',
        displayProperty: 'price',
        cellFilter: 'currency'
      }
    ];
  }]);
