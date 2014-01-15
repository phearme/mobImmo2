/*jslint browser:true*/
var immoClient = {
	departements: {
		"IdF": {nom: "Ile-de-France"},
		"75": {nom: "Paris"},
		"77": {nom: "Seine-et-Marne"},
		"78": {nom: "Yvelines"},
		"91": {nom: "Essonne"},
		"92": {nom: "Hauts-de-Seine"},
		"93": {nom: "Seine-Saint-Denis"},
		"94": {nom: "Val-de-Marne"},
		"95": {nom: "Val-d'Oise"}
	},
	priceUrl: "http://www.paris.notaires.fr/outil/immobilier/datas.txt",
	decodeCityName: function (city) {
		"use strict";
		var returnVal = city,
			srch,
			transCode = {
				"Place Vend": "Place Vend&#244;me, 1er",
				"Arts-et-M": "Arts-et-M&#233;tiers, 3&#232;me",
				"Val-de-Gr": "Val-de-Gr&#226;ce, 5&#232;me",
				"on, 6": "Od&#233;on, 6&#232;me",
				"St-Germain-des-Pr": "St-Germain-des-Pr&#233;s, 6&#232;me",
				"Champs-Elys": "Champs-Elys&#233;es, 8&#232;me",
				"e-d'Antin, 9": "Chauss&#233;e-d'Antin, 9&#232;me",
				"pital St-Louis, 10": "H&#244;pital St-Louis, 10&#232;me",
				"ricourt, 11": "Folie-M&#233;ricourt, 11&#232;me",
				"re, 13": "Salp&#233;tri&#232;re, 13&#232;me",
				"are, 13": "Gare 13&#232;me",
				"res, 18": "Grandes-Carri&#232;res, 18&#232;me",
				"rique, 19": "Am&#233;rique, 19&#232;me",
				"re-Lachaise, 20": "P&#232;re-Lachaise, 20&#232;me"
			};
		for (srch in transCode) {
			if (transCode.hasOwnProperty(srch) && city.indexOf(srch) > -1) {
				returnVal = transCode[srch];
			}
		}
		return returnVal;
	},
	loadData: function (callback) {
		"use strict";
		$.ajax({
			url: this.priceUrl,
			cache: false
		}).success(function (data) {
			var rawArray = data.split("&"),
				i,
				dataItem,
				priceData;
			for (i = 0; i < rawArray.length; i += 1) {
				if (rawArray[i].indexOf("=") > -1) {
					dataItem = rawArray[i].split("=");
					if (dataItem[0].indexOf("data_") === 0) {
						if (!priceData) {
							priceData = {};
						}
						priceData[dataItem[0].substring(5)] = dataItem[1];
					}
				}
			}
			if (typeof callback === "function") {
				callback(priceData);
			}
		});
	},
	getAddressInfo: function (lat, lng, callback) {
		"use strict";
		$.ajax({
			url: "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&sensor=true"
		}).success(function (data) {
			if (typeof callback === "function") {
				callback(data);
			}
		});
	}
};