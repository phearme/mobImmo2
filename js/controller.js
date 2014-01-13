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
	}).otherwise({
		templateUrl: "main.html"
	});
}]);

mainapp.controller("mainCtrl", ["$scope", "$location", function ($scope, $location) {
	"use strict";

	$scope.loading = true;
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
		}
		return label;
	};

	$scope.goBack = function () {
		var loc = $scope.getLocation();
		if (loc.indexOf("/Departement/") >= 0) {
			$scope.setLocation("/Departements/");
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
		console.log("getSelectedDepData");
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
					$scope.resultSimpleArray.push(code);
					$scope.resultObjectArray.push({code: code, ville: $scope.priceData[code]});
				}
			}
		}
	};

}]);
/*
document.addEventListener("deviceready", function () {
	"use strict";
*/
	angular.bootstrap(document, ["mainapp"]);
/*
}, false);
*/