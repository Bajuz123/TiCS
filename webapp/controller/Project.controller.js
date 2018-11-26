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

		onAddClick: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("ProjectDetail");

		},
		onInit: function() {
			//			var oModel = new sap.ui.model.odata.v2.ODataModel("https://services.odata.org/V2/Northwind/Northwind.svc/");
			//			var oModel = new sap.ui.model.odata.v2.ODataModel(this.getUrl("/sap/opu/odata/sap/Z_WEB_TICS_SRV/PROJECT_SET/")); //, {

			/*		    var xmlHttp = new XMLHttpRequest();
			    		xmlHttp.open("GET", "http://ibssaphd1.ibs.local:8050/sap/opu/odata/sap/Z_WEB_TICS_SRV/", false, "stoma", "palipali89"); // false for synchronous request
			    		xmlHttp.send( null );
			    		if ( xmlHttp.status == 200 ){ 
			    			return true;
			    		} else {
			    			return false;
			    		}




				oModel.refreshSecurityToken();

				var oModel = new sap.ui.model.odata.ODataModel(
						"http://ibssaphd1.ibs.local:8050/sap/opu/odata/sap/Z_WEB_TICS_SRV/", true );
			*/

			//	var oModel = new sap.ui.model.odata.ODataModel(
			//			var oModel = new sap.ui.model.odata.v2.ODataModel("http://ibssaphd1.ibs.local:8050/sap/opu/odata/sap/Z_WEB_TICS_SRV/", true, headers, true); //, {
			/*							var oModel = new sap.ui.model.odata.v2.ODataModel(getUrl("/sap/opu/odata/sap/Z_WEB_TICS_SRV/PROJECT_SET/"), {
											user: "...",
											password: "..."
										});
			*/
			//			this.getView().setModel(oModel);
			//			sap.m.MessageToast.show("Working with Real Data");

			/*				var oData = this.getView().getModel("TICS");
							oData.read("/Employees", {
							  success:function(){
								sap.m.MessageToast.show("ok");
							  },
							  error:function(){
								sap.m.MessageToast.show("fail");
							  }
							});
			*/
/*									var oModel = new sap.ui.model.json.JSONModel();
									oModel.loadData("json/mockup_project.json");
									this.getView().setModel(oModel);
									sap.m.MessageToast.show("Working with Mockup");
*/			
/*			var headers = {
				"X-CSRF-Token": "fetch",
				"set-cookie": "MYSAPSSO2"
			};
			var oModel = new sap.ui.model.odata.ODataModel("http://ibssaphd1.ibs.local:8050/sap/opu/odata/sap/Z_WEB_TICS_SRV/", true, headers,
				true);
*/
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