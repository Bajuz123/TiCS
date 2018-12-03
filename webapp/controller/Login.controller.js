sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("TiCS.controller.Login", {
		onInit: function() {
			var oModel = sap.ui.getCore().getModel("User");
			this.getView().setModel(oModel, "User");
		},

		onLoginClick: function() {
			var oDataModel = this.getView().getModel("tics");

			var username = this.getView().byId("__inputUserName").getValue();
			var pwd = this.getView().byId("__inputUserPassword").getValue();

			var user = this.getView().getModel("User");
			user.username = username;
			user.password = pwd;
			sap.ui.getCore().setModel(user, "User");

			var oUrlParams = {
				username: username,
				password: pwd
			};

			oDataModel.callFunction("/AUTHENTIFICATE", {
				method: "GET",
				urlParameters: oUrlParams,
				success: jQuery.proxy(this.successApproval, this),
				error: jQuery.proxy(this.errorApproval, this)
			}); // callback function for error*/
		},

		successApproval: function(data, response) {
			var user = this.getView().getModel("User");

			if (data.MSG_ID === "1") {
				user.authentificated = true;
				sap.ui.getCore().setModel(user, "User");
				sap.m.MessageToast.show("Authentificated");
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("SplitMain");
			} else {
				sap.m.MessageToast.show("Authentification fail");
			}
		},

		errorApproval: function() {
			sap.m.MessageToast.show("Authentification fail");
		}
	});
});