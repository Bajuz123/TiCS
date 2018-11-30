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
			var oDataModel = this.getView("tics");
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
			}); // callback function for error
		},

		successApproval: function() {
			sap.m.MessageToast.show("ok");
		},

		errorApproval: function() {
			sap.m.MessageToast.show("fail");
		}

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf TiCS.view.Login
		 */
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf TiCS.view.Login
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf TiCS.view.Login
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf TiCS.view.Login
		 */
		//	onExit: function() {
		//
		//	}

	});

});