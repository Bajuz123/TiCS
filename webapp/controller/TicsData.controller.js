sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	var ticsId = "";
	return Controller.extend("TiCS.controller.TicsData", {
	approveData: function() {
		
	},
		
	onItemPress: function(oEvent) {
			ticsId = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("ticsId") ;
		},
	onAddClick: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("TicsDataDetail");
		},
	onFilterClick: function() {

		},
	onDeleteClick: function() {
			var oTable = this.getView().byId("__tableTics");
			var resourceModel = this.getView().getModel("i18n");
			var deleteSelectText = resourceModel.getProperty("DeleteSelectFail");
			var deleteOKText = resourceModel.getProperty("DeleteOK");
			var deleteFailText = resourceModel.getProperty("DeleteFail");

			if (ticsId != "") {
				var oModel = this.getView().getModel("tics");

				oModel.remove("/TICS_SET(id='" + ticsId + "')", {
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
			oRouter.navTo("TicsData");
		},
	onEditClick: function() {

		},
			onInit: function() {
		}
		
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf TiCS.view.TaskData
		 */

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf TiCS.view.TaskData
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf TiCS.view.TaskData
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf TiCS.view.TaskData
		 */
		//	onExit: function() {
		//
		//	}

	});

});