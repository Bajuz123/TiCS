sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	var selTask= {
		id: "",
		aufgabe: "",
		beschreibung: "",
		method: "create"
	};
	return Controller.extend("TiCS.controller.Task", {

		onInit: function() {
			var oUserModel = sap.ui.getCore().getModel("User");
			oUserModel.username = localStorage.getItem("User_Login");
			oUserModel.password = localStorage.getItem("User_Pwd");
			oUserModel.authentificated = localStorage.getItem("User_Authentificated");
			oUserModel.admin = localStorage.getItem("User_Admin");
			oUserModel.personalNr = localStorage.getItem("User_PersonalNr");
			this.getView().setModel(oUserModel, "User");

			var btnAdd = this.getView().byId("__buttonAdd");
			btnAdd.setEnabled(oUserModel.admin === "true");
			var btnEdit = this.getView().byId("__buttonEdit");
			btnEdit.setEnabled(oUserModel.admin === "true");
			var btnDelete = this.getView().byId("__buttonDelete");
			btnDelete.setEnabled(oUserModel.admin === "true");

			if (oUserModel.authentificated !== "true" && oUserModel.authentificated !== true) {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("Login");
			}
		},

		onAddClick: function() {

		},

		onDeleteClick: function() {

		},

		onEditClick: function() {

		},

		onItemPress: function(oEvent) {
			selTask.id = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("id");
			selTask.aufgabe = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("aufgabe");
			selTask.beschreibung = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("beschreibung");
			}
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf TiCS.view.view.Task
			 */

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf TiCS.view.view.Task
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf TiCS.view.view.Task
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf TiCS.view.view.Task
		 */
		//	onExit: function() {
		//
		//	}

	});

});