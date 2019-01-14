sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	var selTask = {
		id: "",
		aufgabe: "",
		beschreibung: "",
		method: "create"
	};
	var fragTask;
	return Controller.extend("TiCS.controller.Task", {

		onInit: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(selTask);
			this.getView().setModel(oModel, "SelectedTask");

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

		isUserValid: function(oUser) {
			return oUser.authentificated;
		},

		onAddClick: function() {
			var oModel = this.getView().getModel("SelectedTask");
			this.clearSelected();
			selTask.method = "create";
			oModel.setData(selTask);
			this.getView().setModel(oModel, "SelectedTask");
			this.openFragUser();
		},

		onDeleteClick: function() {
			var resourceModel = this.getView().getModel("i18n");
			var modelTics = this.oView.getModel("tics");
			//			var oTable = this.getView().byId("__tableProjects");
			var deleteSelectText = resourceModel.getProperty("DeleteSelectFail");
			var deleteOKText = resourceModel.getProperty("DeleteOK");
			var deleteFailText = resourceModel.getProperty("DeleteFail");

			if (selTask.id !== "") {
				var user = this.getView().getModel("User");

				modelTics.remove("/TASK_SET(id='" + selTask.id + "')", {
					method: "DELETE",
					urlParameters: {
						"username": user.username,
						"password": user.password
					},
					success: function() {
						sap.m.MessageToast.show(deleteOKText);
					},
					error: function() {
						sap.m.MessageToast.show(deleteFailText);
					}
				});
				modelTics.refresh();
				this.clearSelected();
			} else {
				sap.m.MessageToast.show(deleteSelectText);
			}
		},

		onEditClick: function() {
			var resourceModel = this.getView().getModel("i18n");
			//			var oTable = this.getView().byId("__tableProjects");
			var editSelectText = resourceModel.getProperty("EditSelectFail");

			if (selTask.id !== "") {
				var oModel = this.getView().getModel("SelectedProject");
				selTask.method = "update";
				oModel.setData(selTask);
				this.getView().setModel(oModel, "SelectedTask");
				this.openFragUser();
			} else {
				sap.m.MessageToast.show(editSelectText);
			}
		},

		openFragUser: function() {
			if (!fragTask) {
				fragTask = new sap.ui.xmlfragment("TiCS.view.TaskDetail", this.oView.getController());
				this.oView.addDependent(fragTask);
			}
			fragTask.open();
		},

		onItemPress: function(oEvent) {
			selTask.id = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("id");
			selTask.aufgabe = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("aufgabe");
			selTask.beschreibung = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("beschreibung");
		},

		clearSelected: function() {
			selTask.aufgabe = "";
			selTask.beschreibung = "";
		},

		onCancelClick: function() {
			this.clearSelected();
			fragTask.close();
		},

		onOKClick: function() {
				var resourceModel = this.getView().getModel("i18n");
				var editOKTxt = resourceModel.getProperty("EditOK");
				var editFailTxt = resourceModel.getProperty("EditFail");
				var addOKTxt = resourceModel.getProperty("TasktAddOK");
				var oEntry = {};
				var oModel = this.getView().getModel("SelectedTask");
				var modelTics = this.oView.getModel("tics");
				if (typeof oModel !== "undefined") {
					selTask = oModel.getData("selTask");
					if (typeof selTask !== "undefined") {
						oEntry.aufgabe = selTask.aufgabe;
						oEntry.beschreibung = selTask.beschreibung;

						var oUserModel = this.getView().getModel("User");
						oEntry.username = oUserModel.username;
						oEntry.password = oUserModel.password;
						if (selTask.method !== "create") {

							modelTics.update("/TASK_SET(projektnummer='" + oEntry.aufgabe + "')", oEntry, {
								success: function() {
									sap.m.MessageToast.show(editOKTxt);
								},
								error: function() {
									sap.m.MessageToast.show(editFailTxt);
								}
							});
						} else if (selTask.method === "create") {
							modelTics.create("/TASK_SET", oEntry);
							sap.m.MessageToast.show(addOKTxt);
						}
					}
				}
				modelTics.refresh();
				this.clearSelected();
				fragTask.close();
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
		//	var oUserModel = this.getView().getModel("User");
		//	var isValid = this.isUserValid(oUserModel);
		//	if ((isValid === true)||(isValid === "true")) {
		//		var oModel = new sap.ui.model.json.JSONModel();
		//		oModel.setData(selTask);
		//		this.getView().setModel(oModel, "SelectedTask");
		//
		//		var oDataModel = this.getView().getModel("tics");
		//		oDataModel.read("/TASK_SET", {
		//			error: function(e) {
		//				sap.m.MessageToast.show(e);
		//			}
		//		});
		//		this.createUserFilter(oUserModel);
		//	}
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