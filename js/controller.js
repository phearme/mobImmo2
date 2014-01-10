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
		console.log("openDepartement", depCode);
		$scope.selectedDepCode = depCode;
		if ($scope.selectedDepCode) {
			$location.path("/Departement/" + depCode);
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

	$scope.priceData = JSON.parse(localStorage.getItem("priceData")) || {};
	immoClient.loadData(function (priceData) {
		if (priceData) {
			$scope.priceData = priceData;
			localStorage.setItem("priceData", JSON.stringify($scope.priceData));
		}
		$scope.loading = false;
		$scope.safeApply();
	});

}]);
/*
document.addEventListener("deviceready", function () {
	"use strict";
*/
	angular.bootstrap(document, ["mainapp"]);
/*
}, false);
*/