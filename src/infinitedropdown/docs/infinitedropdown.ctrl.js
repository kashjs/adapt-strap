angular.module('adaptv.adaptStrapDocs')
  .controller('infiniteDropdownCtrl', ['$scope',
    function ($scope) {

      // ========== Simple Table Implementation ========== //
      $scope.artistsAjaxConfig = {
        url: 'http://ws.audioscrobbler.com/2.0/',
        method: 'JSONP',
        params: {
          api_key: '9b0cdcf446cc96dea3e747787ad23575',
          artist: '50 cent',
          method: 'artist.search',
          format: 'json'
        },
        paginationConfig: {
          response: {
            totalItems: 'results.opensearch:totalResults',
            itemsLocation: 'results.artistmatches.artist'
          }
        }
      };

      $scope.artistListTemplate = '<img ng-src="{{item.image[0][\'#text\']}}">' +
        '&nbsp;<em>{{ item.name }}</em>';
      $scope.selectedArtists = [];
      $scope.selectedArtist = [];
    }]);
