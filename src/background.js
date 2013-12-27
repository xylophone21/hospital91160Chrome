chrome.extension.onMessage.addListener(function(message,sender,sendResponse) {
	if(message.event == "notify" ) {
		var notify = webkitNotifications.createNotification('icon.png', message.title, message.message);
		notify.show();
		setTimeout(function(){ notify.cancel(); },10000);
	}
});