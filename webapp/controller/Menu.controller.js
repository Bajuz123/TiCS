sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("TiCS.controller.Menu", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf TiCS.view.Menu
		 */
		onMenuClick: function() {
			var menu = this.getView().byId("__menuList");
			var rowItem = menu.getSelectedItem();
			var id = rowItem.getId();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			
			if (id.includes("__item1")) {
				oRouter.navTo("Project");
				return;
			}	

			if (id.includes("__item2")) {
				oRouter.navTo("TaskData");
				return;
			}	

			if (id.includes("__item3")) {
				oRouter.navTo("Users");
				return;
			}	

			if (id.includes("__item4")) {
				oRouter.navTo("Logout");
				return;
			}	
		},

		onInit: function() {
/*			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Project");
*/		}
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf TiCS.view.Menu
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf TiCS.view.Menu
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf TiCS.view.Menu
		 */
		//	onExit: function() {
		//
		//	}

	});

});