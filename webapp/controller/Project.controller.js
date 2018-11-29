sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	var selProject = {
		projektnummer: "",
		beschreibung: ""
	};
	var fragProject;
	return Controller.extend("TiCS.controller.Project", {
		onItemPress: function(oEvent) {
			selProject.projektnummer = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("projektnummer");
			selProject.beschreibung = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("beschreibung");
		},

		onEditClick: function() {
			var oTable = this.getView().byId("__tableProjects");
			var resourceModel = this.getView().getModel("i18n");
			var editSelectText = resourceModel.getProperty("EditSelectFail");

			if (selProject.projektnummer != "") {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(selProject);
				sap.ui.getCore().setModel(oModel, "SelectedProject");

				this.openFragUser();
			} else {
				sap.m.MessageToast.show(editSelectText);
			}
		},

		onAddClick: function() {
			this.openFragUser();
		},
		onOKClick: function() {
			var oEntry = {};

			var resourceModel = this.oView.getModel("i18n");
			var oModelTics = this.oView.getModel("tics");

			var oModel = sap.ui.getCore().getModel("SelectedProject");
			if (typeof oModel !== 'undefined') {
				var selProject = oModel.getData("selProject");
				if (typeof selProject !== 'undefined') {
					var editOKTxt = resourceModel.getProperty("EditOK");
					var editFailTxt = resourceModel.getProperty("EditFail");

					oEntry.projektnummer = fragProject.byId("__inputProject").getValue();
					oEntry.beschreibung = fragProject.byId("__inpuProjectDesc").getValue();

					oModelTics.update("/PROJECT_SET(projektnummer='" + oEntry.projektnummer + "')", oEntry, {
						success: function(data) {
							sap.m.MessageToast.show(editOKTxt);
						},
						error: function(e) {
							sap.m.MessageToast.show(editFailTxt);
						}
					});
				}
			} else {
				oModelTics.create("/PROJECT_SET", oEntry);
				var resourceModel = this.getView().getModel("i18n");
				var addOKTxt = resourceModel.getProperty("ProjectAddOK");
				sap.m.MessageToast.show(addOKTxt);
			}
		},

		onCancelClick: function() {
			fragProject.close();
			//fragProject.destroy(true);
		},

		onDeleteClick: function() {
			var oTable = this.getView().byId("__tableProjects");
			var resourceModel = this.getView().getModel("i18n");
			var deleteSelectText = resourceModel.getProperty("DeleteSelectFail");
			var deleteOKText = resourceModel.getProperty("DeleteOK");
			var deleteFailText = resourceModel.getProperty("DeleteFail");

			if (selProject.projektnummer != "") {
				var oModel = this.getView().getModel("tics");

				oModel.remove("/PROJECT_SET(projektnummer='" + selProject.projektnummer + "')", {
					method: "DELETE",
					success: function(data) {
						sap.m.MessageToast.show(deleteOKText);
					},
					error: function(e) {
						sap.m.MessageToast.show(deleteFailText);
					}
				});
				oModel.refresh();
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
		}
	});
});