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
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(selProject);
			this.getView().setModel(oModel, "SelectedProject");
		},

		onItemPress: function(oEvent) {
			selProject.projektnummer = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("projektnummer");
			selProject.beschreibung = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("beschreibung");
		},

		onEditClick: function() {
			var resourceModel = this.getView().getModel("i18n");
			var oTable = this.getView().byId("__tableProjects");
			var editSelectText = resourceModel.getProperty("EditSelectFail");

			if (selProject.projektnummer != "") {
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
			if (typeof oModel !== 'undefined') {
				var selProject = oModel.getData("selProject");
				if (typeof selProject !== 'undefined') {
					oEntry.projektnummer = selProject.projektnummer;
					oEntry.beschreibung = selProject.beschreibung;
					if (selProject.method !== "create") {

						modelTics.update("/PROJECT_SET(projektnummer='" + oEntry.projektnummer + "')", oEntry, {
							success: function(data) {
								sap.m.MessageToast.show(editOKTxt);
							},
							error: function(e) {
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
			var oTable = this.getView().byId("__tableProjects");
			var deleteSelectText = resourceModel.getProperty("DeleteSelectFail");
			var deleteOKText = resourceModel.getProperty("DeleteOK");
			var deleteFailText = resourceModel.getProperty("DeleteFail");

			if (selProject.projektnummer != "") {
				modelTics.remove("/PROJECT_SET(projektnummer='" + selProject.projektnummer + "')", {
					method: "DELETE",
					success: function(data) {
						sap.m.MessageToast.show(deleteOKText);
					},
					error: function(e) {
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
		}
	});
});