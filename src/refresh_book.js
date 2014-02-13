function notify(title,msg) {
	chrome.extension.sendMessage({ event:"notify", message:msg, title:title });
}

var s_dateDiff;
function init_server_time() {
	var http = new XMLHttpRequest;   
	http.open("HEAD", ".", false);   
	http.send(null);   
	var server = new Date(http.getResponseHeader("Date"));
	var local = new Date()
	s_dateDiff = server.getTime() - local.getTime()
	console.log(s_dateDiff);
	console.log(server);
}

function get_server_time() {
	return new Date(new Date().getTime() + s_dateDiff);
}

function add_plguin_div() {
	var bars = document.getElementsByClassName('bar_middle');
	if(bars.length > 0) {
		var bar = bars[0];
		var pluginDiv=document.createElement("div");
		pluginDiv.id="plugin_div"
		html = "<input id='auto_refresh' type='checkbox'>自动";
		html += "<a id='refresh_link' href='javascript:_jyDocSchMast(_thks_unit_id,_thks_dep_id,_thks_doc_id,_state_time);';>刷新</a>&nbsp;&nbsp;&nbsp;&nbsp;";
		html += "服务器时间:<div id='server_time'></div>"
		
		pluginDiv.innerHTML = html;
		bar.appendChild(pluginDiv);
	}
	else {
		alert("can not find bar_middle");
	}
}

function timer_trikcer() {
	var stime = get_server_time().toLocaleTimeString();
	var servertime=document.getElementById("server_time");
	servertime.innerHTML = stime;

	var auto_refresh_click=document.getElementById("auto_refresh");
	if(auto_refresh_click.checked==true) {
		//console.log("timer_trikcer checked");
		var loading_bar = document.getElementById("schMastloading");
		if(loading_bar.class=="loading-schedule") {
			console.log("loading, do nothing");
		}
		else {
			do_refresh_ifneed();
		}
		
		if(check_orders() == true) {
			auto_refresh_click.checked = false;
		}
	}
	
	window.setTimeout(timer_trikcer,1000);
}

var s_last_refresh;
function do_refresh_ifneed() {
	var now = (new Date() + s_dateDiff);
	
	if(s_last_refresh == undefined) {
		//console.log("do first refresh");
		s_last_refresh = now;
		document.getElementById('refresh_link').click();
	}
	else {
		var lasttime = now-s_last_refresh;
		if(lasttime >= 4000) {
			//console.log("refresh--"+lasttime);
			s_last_refresh = now;
			document.getElementById('refresh_link').click();
		}
	}
}

function check_orders() {
	var orders = document.getElementsByClassName('schedule-timetable-order fl _login_tips_');
	
	//for (var i = 0; i < orders.length; ++i) {
	//	var order = orders[i];  
	//	console.log("order "+i+" link="+order.href + " value="+order.innerHTML);
	//}
	
	if(orders.length > 0) {
		console.log("order found "+orders.length);
		notify("通知","可以挂号了！");
		return true;
	}
	
	return false;
}


init_server_time();
add_plguin_div();


window.setTimeout(timer_trikcer,1000);

