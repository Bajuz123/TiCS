sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"TiCS/model/models"
], function(Controller, models) {
	"use strict";

	return Controller.extend("TiCS.controller.Login", {
		onInit: function() {
			var oModel = sap.ui.getCore().getModel("User");
			this.getView().setModel(oModel, "User");
		},

		onLoginClick: function() {
			var oDataModel = this.getView().getModel("tics");
			var user = this.getView().getModel("User");
			user.username = this.getView().byId("__inputUserName").getValue();
			user.password = this.getView().byId("__inputUserPassword").getValue();
			localStorage.setItem("User_Login", user.username);
			localStorage.setItem("User_Pwd", user.password);
			localStorage.setItem("User_Authentificated", user.authentificated);
			localStorage.getItem("User_Admin", user.admin);
			sap.ui.getCore().setModel(user, "User");

			var oUrlParams = {
				username: user.username,
				password: user.password
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
				sap.ui.getCore().setModel(models.createDeviceModel(), "device");

				user.authentificated = true;
				sap.ui.getCore().setModel(user, "User");
				sap.m.MessageToast.show("Authentificated");
				var oDataModel = this.getView().getModel("tics");
				oDataModel.refresh();
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