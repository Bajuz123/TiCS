sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	var fragUser;
	return Controller.extend("TiCS.controller.UserManager", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf TiCS.view.UserManager
		 */
			onAddClick: function() {
		//	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		//	oRouter.navTo("UserDetail");
			
			if (!fragUser) {
    		 fragUser  = new sap.ui.xmlfragment("TiCS.view.UserManagerDetail", this.oView.getController() );
             this.oView.addDependent(fragUser);
    	}
        	fragUser.open();
		},

		
			onDeleteClick: function() {

		},
		
		onCancelClick: function() {
		//fragUser.close();
		fragUser.destroy(true);
		},
	onEditClick: function() {

		},
		onInit: function() {
		
			}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf TiCS.view.UserManager
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf TiCS.view.UserManager
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf TiCS.view.UserManager
		 */
		//	onExit: function() {
		//
		//	}

	});

});