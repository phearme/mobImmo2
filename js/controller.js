/*jslint browser:true*/
/*global immoClient*/
var mainapp = angular.module("mainapp", ["ngSanitize"]);
mainapp.controller("mainCtrl", function mainCtrl($scope) {
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

	$scope.priceData = JSON.parse(localStorage.getItem("priceData")) || {};
	immoClient.loadData(function (priceData) {
		$scope.safeApply(function () {
			if (priceData) {
				$scope.priceData = priceData;
			}
			$scope.loading = false;
		});
	});
});
/*
document.addEventListener("deviceready", function () {
	"use strict";
*/
	angular.bootstrap(document, ["mainapp"]);
/*
}, false);
*/