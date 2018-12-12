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
		addDays: function(date, days) {
			var result = new Date(date);
			result.setDate(result.getDate() + days);
			return result;
		},

		onInit: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(selTics);
			this.getView().setModel(oModel, "SelectedTics");
			var oUserModel = sap.ui.getCore().getModel("User");
			oUserModel.username = localStorage.getItem("User_Login");
			oUserModel.password = localStorage.getItem("User_Pwd");
			oUserModel.authentificated = localStorage.getItem("User_Authentificated");
			oUserModel.admin = localStorage.getItem("User_Admin");
			oUserModel.personalNr = localStorage.getItem("User_PersonalNr");
			this.getView().setModel(oUserModel, "User");

			var today = new Date();
			this.getView().byId("__pickerTo").setValue(today.toJSON().slice(0, 10).replace(/-/g, "/"));
			today = this.addDays(today, -7);
			this.getView().byId("__pickerFrom").setValue(today.toJSON().slice(0, 10).replace(/-/g, "/"));

			var fieldPersNr = this.getView().byId("__inputPersonalNumber");
			fieldPersNr.setValue(oUserModel.personalNr);
			fieldPersNr.setEnabled(oUserModel.admin === "true");
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
			var oDataModel = this.getView().getModel("tics");
			oDataModel.read("/TICS_SET", {
				error: function(e) {
					sap.m.MessageToast.show(e);
				}
			});
			this.createUserFilter(oDataModel);
		},

		createUserFilter: function(oUser) {
			var filterDateFrom = new sap.ui.model.Filter({
				path: "vonzeit",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: this.getView().byId("__pickerFrom").getValue() //proper conversion needed
			});

			var filterDateTo = new sap.ui.model.Filter({
				path: "biszeit",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: this.getView().byId("__pickerTo").getValue() //proper conversion needed
			});

			var filterPersonalNr = new sap.ui.model.Filter({
				path: "personalnr",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: this.getView().byId("__inputPersonalNumber").getValue()
			});

			var filterPwd = new sap.ui.model.Filter({
				path: "password",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: oUser.password
			});

			var filterUname = new sap.ui.model.Filter({
				path: "username",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: oUser.username
			});

			var filtersTics = new sap.ui.model.Filter({
				filters: [filterDateFrom, filterDateTo, filterPersonalNr, filterUname, filterPwd],
				and: true
			});

			var oTable = this.getView().byId("__tableTics");
			var oBinding = oTable.getBinding("items");
			oBinding.filter(filtersTics);
		},

		onCancelClick: function() {
			fragTics.close();
		},

		onDeleteClick: function() {
			//			var oTable = this.getView().byId("__tableTics");
			var resourceModel = this.getView().getModel("i18n");
			var deleteSelectText = resourceModel.getProperty("DeleteSelectFail");
			var deleteOKText = resourceModel.getProperty("DeleteOK");
			var deleteFailText = resourceModel.getProperty("DeleteFail");

			if (selTics.ticsId !== "") {
				var oModel = this.getView().getModel("tics");

				oModel.remove("/TICS_SET(ticsId='" + selTics.ticsId + "')", {
					method: "DELETE",
					success: function() {
						sap.m.MessageToast.show(deleteOKText);
					},
					error: function() {
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
			//			var oTable = this.getView().byId("__tableTicss");
			var editSelectText = resourceModel.getProperty("EditSelectFail");

			if (selTics.ticsId !== "") {
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
		},
		onBeforeRendering: function() {
			this.onFilterClick();
		}
	});
});