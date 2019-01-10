sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	var fragTics;
	var approveDataObj = {
		personalnr: "0000001",
		datefrom: "01/01/1900",
		dateto: "01/01/1900"
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
		ticsId: "",
		description: "",
		comment: "",
		personalnr: "",
		method: "create"
	};

	return Controller.extend("TiCS.controller.TicsData", {
		onDatePickerChange: function(oEvent) {
			var oDatePicker = oEvent.getSource();
			var oBinding = oDatePicker.getBinding("value");
			var oNewDate = oDatePicker.getDateValue();
			if (oNewDate) {
				var sPath = oBinding.getPath();
				var oFormatDate = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "yyyy-MM-dd"
				});
				oBinding.getModel().setProperty(sPath, new Date(oFormatDate.format(oNewDate)));
			}
		},

		exportToPdf: function() {
		var oModel = this.getView().getModel("tics");
		var oModelUser = sap.ui.getCore().getModel("User");
		
		var col = [{title: "Day", key: "tag"},
		           {title: "From", key: "vonzeit"},
		            {title: "To", key: "biszeit"},
		             {title: "Break", key: "pause"},
		              {title: "Proj. Time", key: "projektzeit"},
		               {title: "Proj. No.", key: "projektnummer"},
		                {title: "BK", key: "abrechnungsschl"},
		                 {title: "PK", key: "projektschl"},
		                  {title: "Task", key: "aufgabe"},
		                   {title: "Comment", key: "bemerkung"}];


						var dataArray = [];
                         var data, i, name, names;
                        //Will give you list of indices after filter & sort 
                        //var filteredIndices = table.getBinding().aIndices; 
                         data = oModel.getProperty("/");
                         names = Object.getOwnPropertyNames(data);
                        for (i = 0; i < names.length; i += 1) {
   						 name = names[i];
  						  // you have to check for the correct entity
   							 if (/TICS_SET/.test(name )) {
       							 dataArray.push(oModel.getProperty("/"+name));
   								 }
							}


          var doc = new jsPDF('p', 'pt', 'a4', true);
			doc.setFontSize(15);

         doc.text(40, 30, 'Activity Report');
         doc.text(375, 30, 'iBS Innov. Banking Sol. AG');
         doc.setFontSize(10);
         
		 doc.text(40, 50, oModelUser.personalNr);
		 doc.text(70, 50, oModelUser.username);

		 doc.text(40, 60,"Period from xx to xx");

		 doc.text(388, 50,"PPD0FI1000 Competence Center IBS");
  		 doc.text(403, 60,"CPD0FI1500 Subunternehmer iBS");
 		 doc.text(418, 70,"Line Manager Pleß, Ute (4816)");

		 doc.setLineWidth(0.5);
		 doc.line(40, 75, 558, 75);
		 
        doc.autoTable(col,dataArray,{
         	startY: 80,
    			styles: {
    		    overflow: 'linebreak',
      			fontSize: 8
    			}
    		});

          doc.save("DemoData.pdf");  
		},

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
			if (oUserModel.authentificated !== "true" && oUserModel.authentificated !== true) {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("Login");
			}
		},
		removeSlashes: function(date) {
			return date.replace(new RegExp("/", "g"), "");
		},

		setSelectedData: function() {
			approveDataObj.datefrom = this.removeSlashes(this.getView().byId("__pickerFrom").getValue());
			approveDataObj.dateto = this.removeSlashes(this.getView().byId("__pickerTo").getValue());
			approveDataObj.personalnr = this.getView().byId("__inputPersonalNumber").getValue();
		},

		successApproval: function(data, response) {
			sap.m.MessageToast.show(data.MSG_ID + ": " + data.TEXT);
		},

		errorApproval: function() {
			sap.m.MessageToast.show("something gone wrong by data exchange");
		},

		approveData: function() {
			var oDataModel = this.getView().getModel("tics");

			//oData selection (from-to), personalnr
			this.setSelectedData();
			var oUrlParams = {
				datefrom: approveDataObj.datefrom,
				dateto: approveDataObj.dateto,
				personalnr: approveDataObj.personalnr
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
			selTics.ticsId = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("id");
			selTics.tag = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("tag");
			selTics.personalnr = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("personalnr");
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
			selTics.comment = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("bemerkung");
		},

		onAddClick: function() {
			var today = new Date();
			this.clearSelected();
			selTics.tag = today;
			selTics.method = "create";
			this.openFragTics();
		},

		onFilterClick: function() {
			var oDataModel = this.getView().getModel("tics");
			oDataModel.read("/TICS_SET", {
				error: function(e) {
					sap.m.MessageToast.show(e);
				}
			});
			var oUser = this.getView().getModel("User");
			this.createUserFilter(oUser);
		},

		createUserFilter: function(oUser) {
			var dateFrom = this.getView().byId("__pickerFrom").getValue();
			dateFrom = dateFrom.replace(new RegExp("/", "g"), "");
			var filterDateFrom = new sap.ui.model.Filter({
				path: "datefrom",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: dateFrom
			});

			var dateTo = this.getView().byId("__pickerTo").getValue();
			dateTo = dateTo.replace(new RegExp("/", "g"), "");
			var filterDateTo = new sap.ui.model.Filter({
				path: "dateto",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: dateTo
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
				filters: [filterPersonalNr, filterUname, filterPwd, filterDateFrom, filterDateTo],
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
			var resourceModel = this.getView().getModel("i18n");
			var deleteSelectText = resourceModel.getProperty("DeleteSelectFail");
			var deleteOKText = resourceModel.getProperty("DeleteOK");
			var deleteFailText = resourceModel.getProperty("DeleteFail");

			if (selTics.ticsId !== "") {
				var user = this.getView().getModel("User");
				var oModel = this.getView().getModel("tics");

				oModel.remove("/TICS_SET(id='" + selTics.ticsId + "')", {
					method: "DELETE",
					urlParameters: {
						"username": user.username,
						"password": user.password,
						"personalNr": selTics.personalnr
					},
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
		},
		onEditClick: function() {
			var resourceModel = this.getView().getModel("i18n");
			var editSelectText = resourceModel.getProperty("EditSelectFail");
			selTics.method = "edit";

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
		},

		checkValues: function() {
			/*selectedTics.tag;
			selectedTics.vonzeit.slice(0, 5);
			selectedTics.biszeit.slice(0, 5);
			oEntry.pause = selectedTics.pause;
			selectedTics.projektnummer;
			selectedTics.abrechnungsschl;
			selectedTics.projektschl;
			selectedTics.aufgabe;
			selectedTics.comment;
			*/
			
			
			return true;
		},

		onOKClick: function() {
			if (this.checkValues()) {
				var oEntry = {};
				var resourceModel = this.oView.getModel("i18n");
				var oModelTics = this.oView.getModel("tics");
				var editOKTxt = resourceModel.getProperty("EditOK");
				var editFailTxt = resourceModel.getProperty("EditFail");
				var addOKTxt = resourceModel.getProperty("TicsAddOK");
				var addFailTxt = resourceModel.getProperty("TicsAddFail");
				var noModelTxt = resourceModel.getProperty("NoModel");

				var oTicsDataModel = this.getView().getModel("SelectedTics");
				if (typeof oTicsDataModel !== 'undefined') {
					var selectedTics = oTicsDataModel.getData("selectedTics");
					if (typeof selectedTics !== 'undefined') {
						var oUserModel = this.getView().getModel("User");
						oEntry.username = oUserModel.username;
						oEntry.password = oUserModel.password;
						oEntry.personalnr = oUserModel.personalNr;
						oEntry.tag = selectedTics.tag;
						oEntry.vonzeit = selectedTics.vonzeit.slice(0, 5);
						oEntry.createtime = selectedTics.createtime;
						oEntry.biszeit = selectedTics.biszeit.slice(0, 5);
						oEntry.pause = selectedTics.pause;
						oEntry.projektnummer = selectedTics.projektnummer;
						oEntry.abrechnungsschl = selectedTics.abrechnungsschl;
						oEntry.projektschl = selectedTics.projektschl;
						oEntry.aufgabe = selectedTics.aufgabe;
						oEntry.bemerkung = selectedTics.comment;

						if (selectedTics.method !== 'create') {
							oEntry.id = selectedTics.ticsId;
							oModelTics.update("/TICS_SET(id='" + oEntry.id + "')", oEntry, {
								success: function(data) {
									sap.m.MessageToast.show(editOKTxt);
								},
								error: function(e) {
									sap.m.MessageToast.show(editFailTxt);
								}
							});
						} else if (selectedTics.method === 'create') {
							oModelTics.create("/TICS_SET", oEntry, {
								success: function(data) {
									sap.m.MessageToast.show(addOKTxt);
								},
								error: function(e) {
									sap.m.MessageToast.show(addFailTxt);
								}
							});
						}
					}
				} else {
					sap.m.MessageToast.show(noModelTxt);
				}
				oModelTics.refresh();
				this.clearSelected();
				fragTics.close();
			}
		},
		clearSelected: function() {
			selTics.vonzeit = "";
			selTics.ticsId = "";
			selTics.tag = "";
			selTics.personalnr = "";
			selTics.projektzeit = "";
			selTics.projektschl = "";
			selTics.pause = "";
			selTics.fefahrzeit = "";
			selTics.fakturierbarfah = "";
			selTics.erf_uhrzeit = "";
			selTics.createtime = "";
			selTics.erf_datum = "";
			selTics.biszeit = "";
			selTics.aufgabe = "";
			selTics.abrechnungsschl = "";
			selTics.comment = "";
		}
	});
});