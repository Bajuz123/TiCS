sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	var selProject = {projektnummer: "", beschreibung: ""};

	return Controller.extend("TiCS.controller.Project", {
		onItemPress: function(oEvent) {
			selProject.projektnummer = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("projektnummer") ;
			selProject.beschreibung  = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("beschreibung") ;
		},

		onEditClick: function() {
			var oTable = this.getView().byId("__tableProjects");
			var resourceModel = this.getView().getModel("i18n");
			var editSelectText = resourceModel.getProperty("EditSelectFail");
	
			if (selProject.projektnummer != "") {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(selProject);
				sap.ui.getCore().setModel(oModel, "SelectedProject");
				
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
  				oRouter.navTo("ProjectDetail");
			} else {
				sap.m.MessageToast.show(editSelectText);
			}			
		},

		onAddClick: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("ProjectDetail");
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
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Project");
		},

		onInit: function() {
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf TiCS.view.ProjectDetail
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf TiCS.view.ProjectDetail
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf TiCS.view.ProjectDetail
		 */
		//	onExit: function() {
		//
		//	}

	});
});