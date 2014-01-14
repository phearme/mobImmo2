/*jslint browser:true*/
/*global immoClient*/
var mainapp = angular.module("mainapp", ["ngSanitize", "ngTouch", "ngRoute"]);

mainapp.config(["$routeProvider", function ($routeProvider) {
	"use strict";
	$routeProvider.when("/Departement/:depcode", {
		templateUrl: "departement.html"
	}).when("/Departements/", {
		templateUrl: "departements.html"
	}).when("/Search/", {
		templateUrl: "search.html"
	}).when("/Geoloc/", {
		templateUrl: "geoloc.html"
	}).when("/About/", {
		templateUrl: "about.html"
	}).otherwise({
		templateUrl: "main.html"
	});
}]);

mainapp.controller("mainCtrl", ["$scope", "$location", function ($scope, $location) {
	"use strict";

	$scope.loading = true;
	$scope.search = {text: ""};
	$scope.immoClient = immoClient;
	$scope.departements = immoClient.departements;
	$scope.safeApply = function (fn) {
		var phase = this.$root.$$phase;
		if (phase && (phase.toString() === "$apply" || phase.toString() === "$digest")) {
			if (typeof fn === "function") { fn(); }
		} else {
			this.$apply(fn);
		}
	};

	$scope.openDepartement = function (depCode) {
		$scope.selectedDepCode = depCode;
		if ($scope.selectedDepCode) {
			$location.path("/Departement/" + depCode);
			$scope.getSelectedDepData();
		} else {
			$location.path("/");
		}
	};

	$scope.openVille = function (code) {
		$scope.selectedVille = code;
		$scope.selectedDepCode = code.substring(0, 2);
		$location.path("/Departement/" + $scope.selectedDepCode);
		$scope.getSelectedDepData();
	};

	$scope.setLocation = function (path) {
		$location.path(path);
	};

	$scope.getLocation = function () {
		return $location.path();
	};

	$scope.getHeaderLabel = function () {
		var loc = $scope.getLocation(), label = "";
		if (loc.indexOf("/Departements/") >= 0) {
			label = "Départements";
		} else if (loc.indexOf("/Departement/") >= 0 && $scope.selectedDepCode) {
			label = $scope.departements[$scope.selectedDepCode].nom;
		} else if (loc.indexOf("/Search/") >= 0) {
			label = "Recherche";
		} else if (loc.indexOf("/Geoloc/") >= 0) {
			label = "Ma Position";
		} else if (loc.indexOf("/About/") >= 0) {
			label = "A propos...";
		}
		return label;
	};

	$scope.goBack = function () {
		var loc = $scope.getLocation();
		if (loc.indexOf("/Departement/") >= 0) {
			if ($scope.selectedVille) {
				$scope.selectedVille = undefined;
				$scope.setLocation("/Search/");
			} else {
				$scope.setLocation("/Departements/");
			}
		} else {
			$scope.setLocation("/");
		}
	};

	$scope.priceData = JSON.parse(localStorage.getItem("priceData")) || {};
	immoClient.loadData(function (priceData) {
		if (priceData) {
			$scope.priceData = priceData;
			localStorage.setItem("priceData", JSON.stringify($scope.priceData));
		}
		$scope.loading = false;
		$scope.safeApply();
	});

	$scope.getSelectedDepData = function () {
		var code;
		$scope.resultSimpleArray = [];
		$scope.resultObjectArray = [];
		if ($scope.selectedDepCode === "75") {
			for (code in $scope.priceData) {
				if ($scope.priceData.hasOwnProperty(code) && code.length > 5 && code.substring(0, 2) === $scope.selectedDepCode) {
					if ($scope.priceData[code + "_app_prix"]) {
						$scope.resultSimpleArray.push(code);
						$scope.resultObjectArray.push({code: code, ville: $scope.priceData[code]});
					}
				}
			}
		} else if ($scope.selectedDepCode === "IdF") {
			$scope.resultSimpleArray.push("gc");
			$scope.resultObjectArray.push({code: "gc", ville: $scope.priceData["gc"]});
			$scope.resultSimpleArray.push("pc");
			$scope.resultObjectArray.push({code: "pc", ville: $scope.priceData["pc"]});
		} else if ($scope.selectedDepCode) {
			for (code in $scope.priceData) {
				if ($scope.priceData.hasOwnProperty(code) && code.length > 2 && code.substring(0, 2) === $scope.selectedDepCode && code.indexOf("_") === -1) {
					if ($scope.priceData[code + "_app_prix"] || $scope.priceData[code + "_maison_prix"]) {
						$scope.resultSimpleArray.push(code);
						$scope.resultObjectArray.push({code: code, ville: $scope.priceData[code]});
					}
				}
			}
		}
	};

	$scope.searchChange = function () {
		var code;
		$scope.searchResults = [];
		if ($scope.search && $scope.search.text !== "" && $scope.search.text.length > 1) {
			for (code in $scope.priceData) {
				if ($scope.priceData.hasOwnProperty(code) && $scope.priceData[code] && $scope.priceData[code].toLowerCase().indexOf($scope.search.text.toLowerCase()) >= 0) {
					if (code.length > 5 && $scope.priceData[code + "_app_prix"]) {
						$scope.searchResults.push({code: code, ville: $scope.priceData[code]});
					} else if (code.length > 2 && code.indexOf("_") === -1 && ($scope.priceData[code + "_app_prix"] || $scope.priceData[code + "_maison_prix"])) {
						$scope.searchResults.push({code: code, ville: $scope.priceData[code]});
					}
				}
			}
		}
	};

	$scope.linkto = function (link) {
		window.open(link, "_system");
	};

	$scope.shareApp = function () {
		if (window.plugins && window.plugins.socialsharing) {
			window.plugins.socialsharing.share(null, null, null, "https://play.google.com/store/apps/details?id=com.phonegap.mobimmoidf");
		}
	};
}]);

mainapp.directive("gotoSelectVille", function () {
	"use strict";
	return function (scope, element, attrs) {
		var select = element[0];
		select.onchange = function () {
			console.log("onchange");
			var yCoord = $("#liVille" + select.value).position().top;
			$("body").scrollTop(yCoord - 52);
		};
		if (scope.selectedVille) {
			window.setTimeout(function () {
				console.log("scope.selectedVille:", scope.selectedVille);
				select.value = scope.selectedVille;
				var y = $("#liVille" + scope.selectedVille).position().top;
				$("body").scrollTop(y - 52);
				scope.$apply(function () {
					scope.selectedVille = undefined;
				});
			}, 0);
		}
	};
});

mainapp.directive("scrollUp", function () {
	"use strict";
	return function (scope, element, attrs) {
		$("body").scrollTop(0);
	};
});

document.addEventListener("deviceready", function () {
	"use strict";

	angular.bootstrap(document, ["mainapp"]);

}, false);
