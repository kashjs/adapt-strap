angular.module('adaptv.adaptStrapDocs')
  .controller('tableajaxCtrl', ['$scope', function ($scope) {
    $scope.artistsColumnDef = [
      {
        columnHeaderDisplayName: 'Name',
        displayProperty: 'name'
      }
    ];

    $scope.artistsAjaxConfig =  {
      url: 'http://ws.audioscrobbler.com/2.0/',
      method: 'JSONP',
      params: {
        api_key: '9b0cdcf446cc96dea3e747787ad23575',
        artist: 'cher',
        method: 'artist.search',
        format: 'json'
      }
    };

  }]);
