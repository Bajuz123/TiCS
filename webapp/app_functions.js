var logoffService = "/sap/public/bc/icf/logoff";

function getUrl(sUrl) {
	if (sUrl == "") {
		return sUrl;
	}
	if ((/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(window.location.hostname) == true) && (sUrl == logoffService)) {
		return "http://" + window.location.hostname + "/logoff";
	}	
	if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(window.location.hostname) == true) {
		return "http://" + window.location.hostname + "/hd1";
	}	
	switch (window.location.hostname) {
	case "localhost":
		return "proxy" + sUrl;
	default:
		return sUrl;
	}
}