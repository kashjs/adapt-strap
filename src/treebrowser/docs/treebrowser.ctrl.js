angular.module('adaptv.adaptStrapDocs')
  .controller('treebrowserCtrl', ['$scope', function ($scope) {
    $scope.root = {
      children: [
        {
          name: 'Bmw',
          priceRange: '30k to 200k',
          children: [
            {
              name: '328i',
              priceRange: '30k to 40k'
            },
            {
              name: '335i',
              priceRange: '35k to 47k'
            },
            {
              name: '535i',
              priceRange: '40k to 50k'
            }
          ]
        },
        {
          name: 'Audi',
          priceRange: '30k to 200k',
          children: [
            {
              name: 'A4',
              priceRange: '30k to 55k',
              children: [
                {
                  name: 'Quattro premium plus',
                  priceRange: '35k to 49k'
                },
                {
                  name: 'Quattro Prestige',
                  priceRange: '45k to 55k'
                },
                {
                  name: 'FWD',
                  priceRange: '35k to 40k'
                }
              ]
            },
            {
              name: 'A6',
              priceRange: '45k to 60k'
            },
            {
              name: 'A8',
              priceRange: '60k to 80k'
            }
          ]
        },
        {
          name: 'Honda',
          priceRange: '15k to 50k',
          children: [
            {
              name: 'Civic',
              priceRange: '15k to 20k'
            },
            {
              name: 'Accord',
              priceRange: '25k to 35k'
            },
            {
              name: 'CRV',
              priceRange: '25k to 35k'
            }
          ]
        }
      ]
    };

    // ========== ui handlers ========== //
    $scope.carSelected = function (car) {
      alert(car.name);
    };
  }]);
