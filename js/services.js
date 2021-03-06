'use strict';

/* Services */

var fruitsServices = angular.module('fruitsServices', ['ngResource']);

fruitsServices.factory('Serie', ['$resource',
  function($resource){
    return $resource('api/series/:id');
  }]);
fruitsServices.factory('Film', ['$resource',
  function($resource){
    return $resource('api/films/:id');
  }]);
fruitsServices.factory('Saison', ['$resource',
  function($resource){
    return $resource('api/series/saison/:id');
  }]);
fruitsServices.factory('Serveur', ['$resource',
  function($resource){
    return $resource('api/serveurs/:id');
  }]);
fruitsServices.factory('Dossier', ['$resource',
  function($resource){
    return $resource('api/files/:id', {},
    {click: {url:'api/files/:id/click'},
     error: {url:'api/files/:id/error'},
     new: {url:'api/new'}});
  }]);
fruitsServices.factory('Search', ['$resource',
  function($resource){
    return $resource('api/search/:q');
  }]);
fruitsServices.factory('Artist', ['$resource',
  function($resource){
    return $resource('api/music/artists/:aid');
  }]);
fruitsServices.factory('Suggest', ['$resource',
  function($resource){
    return $resource('api/suggest/search/:q', {},
      {ask: {url:'api/suggest/:type/:tmdbid'}});
  }]);

fruitsApp.service('browser', ['$window', function($window) {
     return function() {
        var userAgent = $window.navigator.userAgent;
        var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};
        for(var key in browsers) {
            if (browsers[key].test(userAgent)) {
                return key;
            }
       };
       return 'unknown';
    }
}]);
