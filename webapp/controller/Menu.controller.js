sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("TiCS.controller.Menu", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf TiCS.view.Menu
		 */

		onSVKLanguChange: function() {
			this.onLanguChange("SK");
		},

		onDELanguChange: function() {
			this.onLanguChange("DE");
		},

		onLanguChange: function(langu) {
			var messageLanguage = langu;
			sap.ui.getCore().getConfiguration().setLanguage(messageLanguage); //setting the selected language to the core.
			messagebundleLocal: messageLanguage; //assigning language to the message bundle.
		},

		onMenuClick: function(oControlEvent) {
			var rowItem = oControlEvent.getParameters().item;
			var id = rowItem.getId();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			if (id.includes("__item1")) {
				oRouter.navTo("Project");
			}

			if (id.includes("__item2")) {
				oRouter.navTo("TicsData");
			}

			if (id.includes("__item3")) {
				oRouter.navTo("Users");
			}

			if (id.includes("__item4")) {
				var user = sap.ui.getCore().getModel("User");
				user.username = "";
				user.password = "";
				user.authentificated = false;
				user.admin = false;
				sap.ui.getCore().setModel(user, "User");
				localStorage.setItem("User_Login", "");
				localStorage.setItem("User_Pwd", "");
				localStorage.setItem("User_Admin", "");
				localStorage.setItem("User_PersonalNr", "");
				localStorage.setItem("User_Authentificated", "");
				this.logoff();
				oRouter.navTo("Login");
			}
		},

		logoff: function() {
			$.ajax({
				type: "GET",
				url: "http://192.168.1.182/logoff" //Clear SSO cookies: SAP Provided service to do that
			}).done(function(data) { //Now clear the authentication header stored in the browser
				if (!document.execCommand("ClearAuthenticationCache")) {
					//"ClearAuthenticationCache" will work only for IE. Below code for other browsers
					$.ajax({
						type: "GET",
						url: "http://192.168.1.182/tics_srv", //any URL to a Gateway service
						username: 'dummy', //dummy credentials: when request fails, will clear the authentication header
						password: 'dummy',
						statusCode: {
							401: function() {
//  								alert('successfull unauthorised');
								//This empty handler function will prevent authentication pop-up in chrome/firefox
							}
						},
						error: function() {
//							alert('reached error of wrong username password');
						}
					});
					sap.ui.getCore().byId("Shell").destroyApp();
					alert('Logout successfull');
				}
			});
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf TiCS.view.Menu
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf TiCS.view.Menu
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf TiCS.view.Menu
		 */
		//	onExit: function() {
		//
		//	}

	});

});