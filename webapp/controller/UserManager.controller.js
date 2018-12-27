sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	var fragUser;

	var selectedUser = {
		personal_nr: "",
		role: "",
		calendar: "",
		usr_name:"",
		pwd:"",
		method: "create"
	};

	return Controller.extend("TiCS.controller.UserManager", {
		onInit: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(selectedUser);
			this.getView().setModel(oModel, "SelectedUser");
			var oUserModel = sap.ui.getCore().getModel("User");
			oUserModel.username = localStorage.getItem("User_Login");
			oUserModel.password = localStorage.getItem("User_Pwd");
			oUserModel.authentificated = localStorage.getItem("User_Authentificated");
			oUserModel.admin = localStorage.getItem("User_Admin");
			oUserModel.personalNr = localStorage.getItem("User_PersonalNr");
			this.getView().setModel(oUserModel, "User");
			
			var btnAdd = this.getView().byId("__buttonAdd");
			btnAdd.setEnabled( oUserModel.admin === "true" );
			var btnEdit = this.getView().byId("__buttonEdit");
			btnEdit.setEnabled( oUserModel.admin === "true" );
			var btnDelete = this.getView().byId("__buttonDelete");
			btnDelete.setEnabled( oUserModel.admin === "true" );
		},

		onItemPress: function(oEvent) {
			selectedUser.personal_nr = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("personal_nr");
			selectedUser.role = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("role");
			selectedUser.calendar = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("calendar");
			selectedUser.usr_name = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("usr_name");
			selectedUser.pwd = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("pwd");
		},

		onAddClick: function() {
			var oModel = this.getView().getModel("SelectedUser");
			this.clearSelected();
			selectedUser.method = "create";

			oModel.setData(selectedUser);
			this.getView().setModel(oModel, "SelectedUser");
			this.openFragUser();
		},

		onDeleteClick: function() {
			var oTable = this.getView().byId("__tableUser");
			var resourceModel = this.getView().getModel("i18n");
			var deleteSelectText = resourceModel.getProperty("DeleteSelectFail");
			var deleteOKText = resourceModel.getProperty("DeleteOK");
			var deleteFailText = resourceModel.getProperty("DeleteFail");

			if (selectedUser.personal_nr != "") {
				var user = this.getView().getModel("User");
				var oModel = this.getView().getModel("tics");

				oModel.remove("/USER_SET(personal_nr='" + selectedUser.personal_nr + "')", {
					method: "DELETE",
					urlParameters: { "username": user.username, "password": user.password },
					success: function(data) {
						sap.m.MessageToast.show(deleteOKText);
					},
					error: function(e) {
						sap.m.MessageToast.show(deleteFailText);
					}
				});
				oModel.refresh();
				this.clearSelected();
			} else {
				sap.m.MessageToast.show(deleteSelectText);
			}
		},

		onEditClick: function() {
			var oTable = this.getView().byId("__tableUser");
			var resourceModel = this.getView().getModel("i18n");
			var editSelectText = resourceModel.getProperty("EditSelectFail");

			if (selectedUser.personal_nr != "") {
				selectedUser.method = "update";
				var oModel = this.getView().getModel("SelectedUser");
				oModel.setData(selectedUser);
				this.getView().setModel(oModel, "SelectedUser");
				this.openFragUser();
			} else {
				sap.m.MessageToast.show(editSelectText);
			}
		},

		onOKClick: function() {
			var oEntry = {};

			var resourceModel = this.oView.getModel("i18n");
			var oModelTics = this.oView.getModel("tics");
			var editOKTxt = resourceModel.getProperty("EditOK");
			var editFailTxt = resourceModel.getProperty("EditFail");
			var addOKTxt = resourceModel.getProperty("UserAddOK");
			var addFailTxt = resourceModel.getProperty("UserAddFail");

			var oModel = this.getView().getModel("SelectedUser");
			if (typeof oModel !== 'undefined') {
				var selUser = oModel.getData("selectedUser");
				if (typeof selUser !== 'undefined') {
					oEntry.personal_nr = selectedUser.personal_nr;
					oEntry.usr_name = selectedUser.usr_name;
					oEntry.pwd		= selectedUser.pwd;
					oEntry.role 	= sap.ui.getCore().byId('__boxUserRole').getSelectedItem().getKey();
					oEntry.calendar = sap.ui.getCore().byId('__boxUserCalendar').getSelectedItem().getKey();
					var oUserModel = this.getView().getModel("User");
					oEntry.username = oUserModel.username;
					oEntry.password = oUserModel.password;

					if (selUser.method !== 'create') {
						oModelTics.update("/USER_SET(personal_nr='" + oEntry.personal_nr + "')", oEntry, {
							success: function(data) {
								sap.m.MessageToast.show(editOKTxt);
							},
							error: function(e) {
								sap.m.MessageToast.show(editFailTxt);
							}
						});
					} else if (selUser.method === 'create') {
						oModelTics.create("/USER_SET", oEntry, {
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
				sap.m.MessageToast.show(editFailTxt);
			}
			oModelTics.refresh();
			this.clearSelected();
			fragUser.close();
		},
		onCancelClick: function() {
			this.clearSelected();
			fragUser.close();
		},
		openFragUser: function() {
			if (!fragUser) {
				fragUser = new sap.ui.xmlfragment("TiCS.view.UserManagerDetail", this.oView.getController());
				this.oView.addDependent(fragUser);
			}
			fragUser.open();
		},
		clearSelected: function() {
			selectedUser.personal_nr = "";
			selectedUser.role = "";
			selectedUser.calendar = "";
			selectedUser.usr_name = "";
			selectedUser.pwd = "";
		}
	});
});