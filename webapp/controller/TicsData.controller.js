sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	var ticsId = "";
	var fragTics;
	var approveDataObj = {
		personal_nr: "0000001",
		date_from: "01/01/1900",
		date_to: "01/01/1900"
	};
	var selTics = {
		tag: "",
		vonzeit: "",
		erf_datum: "",
		erf_uhrzeit: "",
		createtime: "",
		biszeit: "",
		pause: "",
		projektzeit: "",
		projektnummer: "",
		abrechnungsschl: "",
		projektschl: "",
		aufgabe: "",
		fefahrzeit: "",
		fakturierbarfah: "",
		ticsId: ""
	};

	return Controller.extend("TiCS.controller.TicsData", {

		onInit: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(selTics);
			this.getView().setModel(oModel, "SelectedTics");
			var oUserModel = sap.ui.getCore().getModel("User");
			oUserModel.username = localStorage.getItem("User_Login");
			oUserModel.password = localStorage.getItem("User_Pwd");
			oUserModel.authentificated = localStorage.getItem("User_Authentificated");
			oUserModel.admin = localStorage.getItem("User_Admin");
			this.getView().setModel(oUserModel, "User");
		},
		setSelectedData: function() {
			//approveDataObj	
		},

		successApproval: function() {
			sap.m.MessageToast.show("ok");
		},

		errorApproval: function() {
			sap.m.MessageToast.show("fail");
		},

		approveData: function() {
			var oDataModel = this.getView().getModel("tics");

			//oData selection (from-to), personalnr
			this.setSelectedData();
			var oUrlParams = {
				personal_nr: approveDataObj.personal_nr,
				date_from: approveDataObj.date_from,
				date_to: approveDataObj.date_to
			};

			oDataModel.callFunction("/CHECK_DATA", {
				method: "GET",
				urlParameters: oUrlParams,
				success: jQuery.proxy(this.successApproval, this),
				error: jQuery.proxy(this.errorApproval, this)
			}); // callback function for error
		},

		onItemPress: function(oEvent) {
			selTics.vonzeit = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("vonzeit");
			selTics.ticsId = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("ticsId");
			selTics.tag = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("tag");
			selTics.projektzeit = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("projektzeit");
			selTics.projektschl = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("projektschl");
			selTics.pause = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("pause");
			selTics.fefahrzeit = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("fefahrzeit");
			selTics.fakturierbarfah = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("fakturierbarfah");
			selTics.erf_uhrzeit = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("erf_uhrzeit");
			selTics.createtime = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("createtime");
			selTics.erf_datum = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("erf_datum");
			selTics.biszeit = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("biszeit");
			selTics.aufgabe = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("aufgabe");
			selTics.abrechnungsschl = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("abrechnungsschl");
		},

		onAddClick: function() {
			this.openFragTics();
		},

		onFilterClick: function() {

		},

		onCancelClick: function() {
			fragTics.close();
		},

		onDeleteClick: function() {
			var oTable = this.getView().byId("__tableTics");
			var resourceModel = this.getView().getModel("i18n");
			var deleteSelectText = resourceModel.getProperty("DeleteSelectFail");
			var deleteOKText = resourceModel.getProperty("DeleteOK");
			var deleteFailText = resourceModel.getProperty("DeleteFail");

			if (selTics.ticsId != "") {
				var oModel = this.getView().getModel("tics");

				oModel.remove("/TICS_SET(ticsId='" + selTics.ticsId + "')", {
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
			var resourceModel = this.getView().getModel("i18n");
			var oTable = this.getView().byId("__tableTicss");
			var editSelectText = resourceModel.getProperty("EditSelectFail");

			if (selTics.ticsId != "") {
				var oModel = this.getView().getModel("SelectedTics");
				selTics.method = "update";
				oModel.setData(selTics);
				this.getView().setModel(oModel, "SelectedTics");
				this.openFragTics();
			} else {
				sap.m.MessageToast.show(editSelectText);
			}
		},
		openFragTics: function() {
			if (!fragTics) {
				fragTics = new sap.ui.xmlfragment("TiCS.view.TicsDataDetail", this.oView.getController());
				this.oView.addDependent(fragTics);
			}
			fragTics.open();
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