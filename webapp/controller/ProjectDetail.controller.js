sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("TiCS.controller.ProjectDetail", {
		onOKClick: function() {
			var oEntry = {};

			var resourceModel = this.getView().getModel("i18n");
			oEntry.projektnummer = this.getView().byId("__inputProject").getValue();
			oEntry.beschreibung = this.getView().byId("__inpuProjectDesc").getValue();

			var oModelRegTest = this.getView().getModel("tics");

			var oModel = sap.ui.getCore().getModel("SelectedProject");
			if (typeof oModel !== 'undefined') {
				var selProject = oModel.getData("selProject");
				if (typeof selProject !== 'undefined') {
					var editOKTxt = resourceModel.getProperty("EditOK");
					var editFailTxt = resourceModel.getProperty("EditFail");
	
					oModelRegTest.update("/PROJECT_SET(projektnummer='" + oEntry.projektnummer + "')", oEntry, {
						success : function(data) {
							sap.m.MessageToast.show(editOKTxt);
						},
						error : function(e) {
							sap.m.MessageToast.show(editFailTxt);
						}
					});
				}
			} else {
				oModelRegTest.create("/PROJECT_SET", oEntry);
				var resourceModel = this.getView().getModel("i18n");
				var addOKTxt = resourceModel.getProperty("ProjectAddOK");
				sap.m.MessageToast.show(addOKTxt);
			}

			oModelRegTest.refresh();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Project");
		},

		onCancelClick: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Project");
		},

		onBeforeRendering: function() {
			this.getView().byId("__inputProject").setValue("");
			this.getView().byId("__inpuProjectDesc").setValue("");
			var oModel = sap.ui.getCore().getModel("SelectedProject");
			if (typeof oModel !== 'undefined') {
				var selProject = oModel.getData("selProject");
				if (typeof selProject !== 'undefined') {
					this.getView().byId("__inputProject").setValue(selProject.projektnummer);
					this.getView().byId("__inpuProjectDesc").setValue(selProject.beschreibung);
				}
			}
		}
	});
});