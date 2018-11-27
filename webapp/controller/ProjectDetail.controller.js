sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("TiCS.controller.ProjectDetail", {
		onOKClick: function() {
			var oEntry = {};

			oEntry.projektnummer = this.getView().byId("__inputProject").getValue();
			oEntry.beschreibung  = this.getView().byId("__inpuProjectDesc").getValue();

			var oModelRegTest = this.getView().getModel("tics");
			oModelRegTest.create("/PROJECT_SET", oEntry);

			var resourceModel = this.getView().getModel("i18n");
			var addOKTxt = resourceModel.getProperty("ProjectAddOK");
			sap.m.MessageToast.show(addOKTxt);

			oModelRegTest.refresh();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Project");
		},

		onCancelClick: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo(-1);
		}

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf TiCS.view.ProjectDetail
		 */
		//	onInit: function() {
		//
		//	},

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