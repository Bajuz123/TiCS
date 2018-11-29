sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	var fragUser;

	var selectedUser = {
		personal_nr: "",
		username: "",
		role: "",
		calendar: "",
		method:"create"
	};

	return Controller.extend("TiCS.controller.UserManager", {
		onInit: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(selectedUser);
			this.getView().setModel(oModel, "SelectedUser");
		},

		onItemPress: function(oEvent) {
			selectedUser.personal_nr = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("personal_nr");
			selectedUser.role = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("role");
			selectedUser.calendar = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("calendar");
			selectedUser.username = oEvent.getParameter("listItem").getBindingContext("tics").getProperty("username");
		},

		onAddClick: function() {
			var oModel = this.getView().getModel("SelectedUser");
			selectedUser.personal_nr = "";
			selectedUser.username= "";
			selectedUser.role= "";
			selectedUser.calendar= "";
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
				var oModel = this.getView().getModel("tics");

				oModel.remove("/USER_SET(personal_nr='" + selectedUser.personal_nr + "')", {
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
					oEntry.username = selectedUser.username;
					oEntry.role = selectedUser.role;
					oEntry.calendar = selectedUser.calendar;
					if (selUser.method !== 'create') {

						oModelTics.update("/USER_SET(personal_nr='" + oEntry.personal_nr + "')", oEntry, {
							success: function(data) {
								sap.m.MessageToast.show(editOKTxt);
							},
							error: function(e) {
								sap.m.MessageToast.show(editFailTxt);
							}
						});
					} else {
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
			fragUser.close();
		},
		onCancelClick: function() {
			fragUser.close();
		},
		openFragUser: function() {
			if (!fragUser) {
				fragUser = new sap.ui.xmlfragment("TiCS.view.UserManagerDetail", this.oView.getController());
				this.oView.addDependent(fragUser);
			}
			fragUser.open();
		}
	});
});