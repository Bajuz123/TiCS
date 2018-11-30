sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"TiCS/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("TiCS.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();

			var messageLanguage = 'SK';
			sap.ui.getCore().getConfiguration().setLanguage(messageLanguage); //setting the selected language to the core.
			messagebundleLocal: messageLanguage; //assigning language to the message bundle.

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// set the user model
			var user = {
				username: "",
				passwd: "",
				authentificated:""
			};
			var oUserModel = new sap.ui.model.json.JSONModel();
			oUserModel.setData(user);
			sap.ui.getCore().setModel(user, "User");
		}
	});
});