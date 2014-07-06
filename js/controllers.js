'use strict';

/* Controllers */

var fruitsControllers = angular.module('fruitsControllers', []);

fruitsControllers.controller('SeriesListCtrl', ['$scope', '$rootScope', 'Serie', 'Saison',
  function($scope, $rootScope, Serie, Saison) {
    $rootScope.page = 'series';
    $rootScope.rechercher = '';
    document.getElementById('rechercher').focus();
    $scope.focus = false;
    $scope.fep = false;
    $scope.series = Serie.query();
    
    $scope.min = function(a, b) {
	    if (a < b) {
		    return a;
	    } else {
		    return b;
	    }
    };
  }]);
fruitsControllers.controller('SerieCtrl', ['$scope', '$rootScope', 'Serie', 'Saison', '$routeParams',
  function($scope, $rootScope, Serie, Saison, $routeParams) {
    $rootScope.page = 'series';
    $rootScope.rechercher = '';
    $scope.serie = Serie.get({id: $routeParams.id});
    $scope.nsaison = -1;
    
    $scope.affep = function(saison, numero) {
    	if ($scope.nsaison == numero) {
	    	$scope.fep = false;
			$scope.nsaison = -1;
    	} else {
			$scope.episodes = Saison.query({id: saison});
			$scope.fep = true;
			$scope.fepf = false;
			$scope.nsaison = numero;
			$scope.epn = -1;
		}
    };
    $scope.affepf = function(episode, ep, sub) {
    	$scope.epf = ep;
    	$scope.eps = sub;
    	if (episode == $scope.epn) {
	    	$scope.fepf = false;
	    	$scope.epn = -1;
    	} else {
			$scope.epn = episode;
			$scope.fepf = true;
		}
    };
  }]);
fruitsControllers.controller('FilmsListCtrl', ['$scope', '$rootScope', 'Film',
  function($scope, $rootScope, Film) {
    $rootScope.page = 'films';
    $rootScope.rechercher = '';
    document.getElementById('rechercher').focus();
    $scope.fep = false;
    $scope.films = Film.query();
    $scope.loadNb = 120;
    $scope.loadMore = function() {
        $scope.loadNb += 120;
    };
  }]);
fruitsControllers.controller('FilmCtrl', ['$scope', '$rootScope', 'Film', '$routeParams',
  function($scope, $rootScope, Film, $routeParams) {
    $rootScope.rechercher = '';
    $rootScope.page = 'films';
    $scope.film = Film.get({id: $routeParams.id});
  }]);
fruitsControllers.controller('ArtistsListCtrl', ['$scope', '$rootScope', 'Artist',
  function($scope, $rootScope, Artist) {
    $rootScope.page = 'music';
    $rootScope.rechercher = '';
    document.getElementById('rechercher').focus();
    $scope.fep = false;
    $scope.artists = Artist.query();
    $scope.loadNb = 120;
    $scope.loadMore = function() {
        $scope.loadNb += 120;
    };
  }]);
fruitsControllers.controller('ArtistCtrl', ['$scope', '$rootScope', '$sce', 'Artist', '$routeParams',
  function($scope, $rootScope, $sce, Artist, $routeParams) {
    $rootScope.page = 'music';
    $rootScope.rechercher = '';
    $scope.artist = Artist.get({aid: $routeParams.aid});
    $scope.palid = -1;
    $scope.pmid = -1;
    var ltracks;
    $scope.afffiles = function(falid, fmid, ffiles) {
      if (falid == $scope.palid && fmid == $scope.pmid) {
        $scope.palid = -1;
        $scope.pmid = -1;
      } else {
        $scope.palid = falid;
        $scope.pmid = fmid;
      }
      ltracks = ffiles;
      ltracks.forEach(function(t) {
          t.seuil = $rootScope.seuil(); 
        });
      $scope.ftracks = ltracks;
    };
    $scope.lplay = function(ftrack) {
      if ($rootScope.player.mid == ftrack.mid) {
        if ($rootScope.player.play) {
          $rootScope.player.lecteur.pause();
          $rootScope.player.play = false;
        } else {
          $rootScope.player.lecteur.play();
          $rootScope.player.play = true;
        }
      } else {
        var ffile = ftrack.files[0];
        $rootScope.player.lecteur.src="ftp://" + ffile.serveur + ffile.chemin_complet;
        $rootScope.player.lecteur.play();
        $rootScope.player.play = true;
      }
      $rootScope.player.mid = ftrack.mid;
    };
  }]);
  
fruitsControllers.controller('ServeursCtrl', ['$scope', '$rootScope', 'Serveur',
  function($scope, $rootScope, Serveur) {
    $rootScope.page = 'serveurs';
    $rootScope.rechercher = '';
    
    $scope.serveurs = Serveur.query();
  }]);
fruitsControllers.controller('DossierCtrl', ['$scope', '$rootScope', '$routeParams', 'Dossier', 'browser',
  function($scope, $rootScope, $routeParams, Dossier, browser) {
    $rootScope.page = 'serveurs';
    $rootScope.rechercher = '';
    $scope.bDlFolder = browser() == 'chrome';
    
    $scope.dossier = Dossier.get({id: $routeParams.id}, function() {
      $scope.dossier.fichiers.forEach(function(t) {
          t.seuil = $rootScope.seuil(); 
        });
    });

    $scope.dlFolder = function() {
      if (window.confirm("Les " + document.getElementsByClassName("dwfile").length + " fichiers vont être téléchargés dans votre dossier de téléchargement habituel. C'est bien ce que vous voulez ?")) {
        //alert("Le téléchargement va commencer, veuillez ne pas quitter la page pendant celui-ci.");

        var fileArray = $scope.dossier.fichiers;
        // Suppression des dossiers
        for (var i = fileArray.length - 1; i >= 0; i--) {
          if (fileArray[i].is_dossier) {
            fileArray.splice(i, 1);
          }
        }
        $rootScope.dlfiles.concat(fileArray);

        var i = 0;
        var ourid = srandom();
        imgFtpState[ourid] = -1;
        $rootScope.imgFtpStates.push(ourid);
        var serveur = document.getElementsById("dlfi" + fileArray[i].id).dataset.serveur;
        document.getElementById('imgftp' + ourid).innerHTML = "<img src='ftp://anonymous:anonymous@" + serveur + checkimages[serveur] + "?k=" + srandom() + "' onload='imgFtpState." + ourid + " += 1' onerror='imgFtpState." + ourid + " -= 1' />";
        var interval = setInterval(function() {
          if (i < fileArray.length) {
            serveur = document.getElementsById("dlfi" + fileArray[i].id).dataset.serveur;
            if (imgFtpState[ourid] >= 2) {
              var clickEvent = document.createEvent("MouseEvent");
              clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null); 
              document.getElementsById("dlfi" + fileArray[i].id).dispatchEvent(clickEvent);
              i++;
              for (var j = 0; j < $rootScope.dlfiles.length; j++) {
                if ($rootScope.dlfiles[j].id == fileArray[i].id) {
                  $rootScope.dlfiles.splice(j, 1);
                  break;
                }
              }
              imgFtpState[ourid] = -1;
            } else if (imgFtpState[ourid] <= -1) {
              if (imgFtpState[ourid] <= -2) {
                imgFtpState[ourid] = -1;
              }
            }
            if (imgFtpState != 0) {
              document.getElementById('imgftp' + ourid).innerHTML = "<img src='ftp://anonymous:anonymous@" + serveur + checkimages[serveur] + "?k=" + srandom() + "' onload='imgFtpState." + ourid + " += 1' onerror='imgFtpState." + ourid + " -= 1' />";
            }
          } else {
              //alert("Vous pouvez désormais quitter cette page. Le téléchargement est presque terminé et peut se poursuivre même si vous quittez la page.");
              $rootScope.imgFtpStates.splice($rootScope.imgFtpStates.indexOf(ourid), 1);
              clearInterval(interval);
          }
        },
        1400);
      }
    };
  }]);
fruitsControllers.controller('SearchCtrl', ['$scope', '$rootScope', '$routeParams', 'Search',
  function($scope, $rootScope, $routeParams, Search) {
    $rootScope.page = 'serveurs';
	$scope.searchEnCours = true;
    $scope.search = Search.get({q: $routeParams.q}, function() {
	    $scope.searchEnCours = false;
    });
  }]);
fruitsControllers.controller('NewCtrl', ['$scope', '$rootScope', 'Dossier',
  function($scope, $rootScope, Dossier) {
    $rootScope.page = 'new';
    $rootScope.rechercher = '';
    
    $scope.dossier = Dossier.new();
  }]);
