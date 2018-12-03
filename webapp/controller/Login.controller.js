sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("TiCS.controller.Login", {
		onInit: function() {
			var oModel = sap.ui.getCore().getModel("User");
			this.getView().setModel(oModel,"User");	
		},

		onLoginClick:function(){
/*			var oDataModel = this.getView("tics");
			var oUserModel = sap.ui.getCore().getModel("User");
			var user = oUserModel.getData("user");

			var oUrlParams = {
				username: user.username,
				password: user.passwd
			};

			oDataModel.callFunction("/AUTHENTIFICATE", {
				method: "GET",
				urlParameters: oUrlParams,
				success: jQuery.proxy(this.successApproval, this),
				error: jQuery.proxy(this.errorApproval, this)
			}); // callback function for error*/
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("SplitMain");
		},

		successApproval: function() {
			var oUserModel = sap.ui.getCore().getModel("User");
			var user = oUserModel.getData("user");
			user.authentificated = true;
			sap.ui.getCore().setModel(oUserModel, "User");
			sap.m.MessageToast.show("Authentificated");
		},

		errorApproval: function() {
			sap.m.MessageToast.show("Authentification fail");
		}
	});

});