sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	var fragUser;
	return Controller.extend("TiCS.controller.UserManager", {
		onInit: function() {

		},

		onCancelClick: function() {
			fragUser.close();
		},

		onAddClick: function() {

			if (!fragUser) {
				fragUser = new sap.ui.xmlfragment("TiCS.view.UserManagerDetail", this.oView.getController());
				this.oView.addDependent(fragUser);
			}
			fragUser.open();
		},

		onDeleteClick: function() {

		},

		onEditClick: function() {

		}
	});

});