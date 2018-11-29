sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	var fragUser;
	var selectedUser = {
		personal_nr: "",
		username: "",
		role: "",
		calendar: ""
	};

	return Controller.extend("TiCS.controller.UserManager", {
		onAddClick: function() {
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

				oModel.remove("/USER_SET(projektnummer='" + selectedUser.personal_nr + "')", {
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
			oRouter.navTo("User");
		},

		onEditClick: function() {
			var oTable = this.getView().byId("__tableUser");
			var resourceModel = this.getView().getModel("i18n");
			var editSelectText = resourceModel.getProperty("EditSelectFail");

			if (selectedUser.personal_nr != "") {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(selectedUser);
				sap.ui.getCore().setModel(oModel, "SelectedUser");

				this.openFragUser();
			} else {
				sap.m.MessageToast.show(editSelectText);
			}
		},

		onOKClick: function() {
			var oEntry = {};

			var resourceModel = this.oView.getModel("i18n");
			oEntry.personal_nr = fragUser.byId("__inputUser_Personal_nr").getValue();
			oEntry.username    = fragUser.byId("__inputRole").getValue();
			oEntry.role        = fragUser.byId("__inputUser_Calendar").getValue();
			oEntry.calendar    = fragUser.byId("__inputUser_Username").getValue();

			var oModelTics = this.oView.getModel("tics");

			var oModel = sap.ui.getCore().getModel("SelectedUser");
			if (typeof oModel !== 'undefined') {
				var selUser = oModel.getData("selectedUser");
				if (typeof selUser !== 'undefined') {
					var editOKTxt = resourceModel.getProperty("EditOK");
					var editFailTxt = resourceModel.getProperty("EditFail");

					oModelTics.update("/USER_SET(projektnummer='" + oEntry.personal_nr + "')", oEntry, {
						success: function(data) {
							sap.m.MessageToast.show(editOKTxt);
						},
						error: function(e) {
							sap.m.MessageToast.show(editFailTxt);
						}
					});
				}
			} else {
				oModelTics.create("/USER_SET", oEntry);
				var resourceModel = this.getView().getModel("i18n");
				var addOKTxt = resourceModel.getProperty("ProjectAddOK");
				sap.m.MessageToast.show(addOKTxt);
			}
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