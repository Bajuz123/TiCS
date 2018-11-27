sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("TiCS.controller.Project", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf TiCS.view.ProjectDetail
		 */

		getTableSelectedObject:function (oTable, oSelIndex) {
			var bind = oTable.getBinding("rows");
			var context = oTable.getContextByIndex(oSelIndex);
			var boundObject = context.getProperty(context.getPath());
			return boundObject;
		},

		onAddClick: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("ProjectDetail");
		},

		onDeleteClick: function() {
			var oTable = this.getView().byId("__tableProjects");
			var selIndex = oTable.getSelectedIndex();
			var resourceModel = this.getView().getModel("i18n");
			var deleteSelectText = resourceModel.getProperty("DeleteSelectFail");
			var deleteOKText = resourceModel.getProperty("DeleteOK");
			var deleteFailText = resourceModel.getProperty("DeleteFail");

			if (!selIndex.equals("-1")) {
				var boundObject = this.getTableSelectedObject(oTable, selIndex);
				var idProject = boundObject.projektnummer;
				var oModel = this.getView().getModel("tics");

				oModel.remove("/PROJECT_SET(projektnummer ='" + idProject + "')", {
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

		onInit: function() {}

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