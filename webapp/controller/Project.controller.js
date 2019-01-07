sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	var selProject = {
		projektnummer: "",
		beschreibung: "",
		method: "create"
	};
	var fragProject;

	return Controller.extend("TiCS.controller.Project", {
		onInit: function() {
			var oUserModel = sap.ui.getCore().getModel("User");
			oUserModel.username = localStorage.getItem("User_Login");
			oUserModel.password = localStorage.getItem("User_Pwd");
			oUserModel.authentificated = localStorage.getItem("User_Authentificated");
			oUserModel.admin = localStorage.getItem("User_Admin");
			oUserModel.personalNr = localStorage.getItem("User_PersonalNr");
			this.getView().setModel(oUserModel, "User");
	
			var btnAdd = this.getView().byId("__buttonAdd");
			btnAdd.setEnabled( oUserModel.admin === "true" );
			var btnEdit = this.getView().byId("__buttonEdit");
			btnEdit.setEnabled( oUserModel.admin === "true" );
			var btnDelete = this.getView().byId("__buttonDelete");
			btnDelete.setEnabled( oUserModel.admin === "true" );
			
			if (oUserModel.authentificated !== "true" && oUserModel.authentificated !== true) {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("Login");
			}
		},

		createUserFilter: function(oUser) {
			var filterPwd = new sap.ui.model.Filter({
				path: "password",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: oUser.password
			});

			var filterUname = new sap.ui.model.Filter({
				path: "username",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: oUser.username
			});

			var filtersAuth = new sap.ui.model.Filter({
				filters: [filterPwd, filterUname],
				and: true
			});
			var oTable = this.getView().byId("__tableProjects");
			var oBinding = oTable.getBinding("items");
			oBinding.filter(filtersAuth);
		},

		isUserValid: function(oUser) {
			return oUser.authentificated;
		},

		onItemPress: function(oEvent) {
			selProject.projektnummer = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("projektnummer");
			selProject.beschreibung = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("beschreibung");
		},

		onEditClick: function() {
			var resourceModel = this.getView().getModel("i18n");
//			var oTable = this.getView().byId("__tableProjects");
			var editSelectText = resourceModel.getProperty("EditSelectFail");

			if (selProject.projektnummer !== "") {
				var oModel = this.getView().getModel("SelectedProject");
				selProject.method = "update";
				oModel.setData(selProject);
				this.getView().setModel(oModel, "SelectedProject");
				this.openFragUser();
			} else {
				sap.m.MessageToast.show(editSelectText);
			}
		},

		onAddClick: function() {
			var oModel = this.getView().getModel("SelectedProject");
			this.clearSelected();
			selProject.method = "create";
			oModel.setData(selProject);
			this.getView().setModel(oModel, "SelectedProject");
			this.openFragUser();
		},
		onOKClick: function() {
			var resourceModel = this.getView().getModel("i18n");
			var editOKTxt = resourceModel.getProperty("EditOK");
			var editFailTxt = resourceModel.getProperty("EditFail");
			var addOKTxt = resourceModel.getProperty("ProjectAddOK");
			var oEntry = {};
			var oModel = this.getView().getModel("SelectedProject");
			var modelTics = this.oView.getModel("tics");
			if (typeof oModel !== "undefined") {
				selProject = oModel.getData("selProject");
				if (typeof selProject !== "undefined") {
					oEntry.projektnummer = selProject.projektnummer;
					oEntry.beschreibung = selProject.beschreibung;

					var oUserModel = this.getView().getModel("User");
					oEntry.username = oUserModel.username;
					oEntry.password = oUserModel.password;
					if (selProject.method !== "create") {

						modelTics.update("/PROJECT_SET(projektnummer='" + oEntry.projektnummer + "')", oEntry, {
							success: function() {
								sap.m.MessageToast.show(editOKTxt);
							},
							error: function() {
								sap.m.MessageToast.show(editFailTxt);
							}
						});
					} else if (selProject.method === "create") {
						modelTics.create("/PROJECT_SET", oEntry);
						sap.m.MessageToast.show(addOKTxt);
					}
				}
			}
			modelTics.refresh();
			this.clearSelected();
			fragProject.close();
		},

		onCancelClick: function() {
			this.clearSelected();
			fragProject.close();
		},

		onDeleteClick: function() {
			var resourceModel = this.getView().getModel("i18n");
			var modelTics = this.oView.getModel("tics");
//			var oTable = this.getView().byId("__tableProjects");
			var deleteSelectText = resourceModel.getProperty("DeleteSelectFail");
			var deleteOKText = resourceModel.getProperty("DeleteOK");
			var deleteFailText = resourceModel.getProperty("DeleteFail");

			if (selProject.projektnummer !== "") {
				var user = this.getView().getModel("User");

				modelTics.remove("/PROJECT_SET(projektnummer='" + selProject.projektnummer + "')", {
					method: "DELETE",
					urlParameters: { "username": user.username, "password": user.password },
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
		openFragUser: function() {
			if (!fragProject) {
				fragProject = new sap.ui.xmlfragment("TiCS.view.ProjectDetail", this.oView.getController());
				this.oView.addDependent(fragProject);
			}
			fragProject.open();
		},
		clearSelected: function() {
			selProject.projektnummer = "";
			selProject.beschreibung = "";
		},
		onBeforeRendering: function() {
			var oUserModel = this.getView().getModel("User");
			var isValid = this.isUserValid(oUserModel);
			if ((isValid === true)||(isValid === "true")) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(selProject);
				this.getView().setModel(oModel, "SelectedProject");

				var oDataModel = this.getView().getModel("tics");
				oDataModel.read("/PROJECT_SET", {
					error: function(e) {
						sap.m.MessageToast.show(e);
					}
				});
				this.createUserFilter(oUserModel);
			}
		}
	});
});