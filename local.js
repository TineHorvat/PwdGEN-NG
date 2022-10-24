var arr;
$(document).ready(function () {
	var specials = ["!", "%", "$", "#", "?", "+", "_", "=", "-", "@", "*"];
	$(".genButton").on("click", function (e) {
		arr = new Array();
		e.preventDefault();
		var status = statusHtmlStorage('cWords');
		if (status) {
			arr = JSON.parse(localStorage.getItem('cWords'));
		} else {
			buildArray();
			setHtmlStorage('cWords', JSON.stringify(arr), 30);
		}
		var arrLen = arr.length;
		var itemNo = getRandomInt(0, arrLen - 1);
		var randNum = getRandomInt(100, 999);
		var specNo = getRandomInt(0, specials.length - 1);
		var genP = randomCaseStr(arr[itemNo]); //arr[itemNo];
		var extraP = getRandomStr(3);
		var genPass = extraP+ genP + randNum + specials[specNo];
		$(".taResults").val(genPass);
		var proc = 0;
		$('.taResults').complexify({ strengthScaleFactor: 0.6 }, function (valid, complexity) {
			$(".pwdMeterHolder span.pwdMeter").css("width", Math.round(complexity) + '%');
			$(".pwdMeterNum").text('Strength: ' + Math.round(complexity) + '%');
			proc = Math.round(complexity);
		});
		var ts = TimeStamp();
		$(".generatedPasswords").append("<li>" + ts + "&gt;<span>" + genPass + " [" + proc + "%]</span></li>");
	});
});
//functions
function buildArray() {
	$.ajax({
		url: 'words.xml',
		dataType: 'xml',
		async: false,
		success: function (data) {
			var xml_node = $('words', data);
			$(xml_node).find('word').each(function () {
				arr.push($.trim($(this).text()));
			});
		},
		error: function (data) {
			if (window.console)
				console.log('Error loading XML data');
		}
	});
}
function randomCaseStr(str) {
	var s = "";
	for (var i = 0; i < str.length; i++) {
		var rnd = getRandomInt(0, 1);
		if (rnd)
			s += str[i].toUpperCase();
		else
			s += str[i];
	}
	return s;
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomStr(len) {
	return randomCaseStr(Math.random().toString(36).substr(2, len));
}
function TimeStamp() {
	var d = new Date();
	return AddZero(d.getDate()) + "." + (d.getMonth() + 1) + "." + d.getFullYear() + " " + AddZero(d.getHours()) + ":" + AddZero(d.getMinutes()) + ":" + AddZero(d.getSeconds());
}
function AddZero(num) {
    return (num >= 0 && num < 10) ? "0" + num : num + "";
}
function removeHtmlStorage(name) {
	localStorage.removeItem(name);
	localStorage.removeItem(name + '_ts');
}
function setHtmlStorage(name, value, expires) {
	if (expires == undefined || expires == 'null') { var expires = 3600; }
	var date = new Date();
	var schedule = Math.round((date.setSeconds(date.getSeconds() + expires)) / 1000);
	localStorage.setItem(name, value);
	localStorage.setItem(name + '_ts', schedule);
}
function statusHtmlStorage(name) {
	var date = new Date();
	var current = Math.round(+date / 1000);
	var stored_time = localStorage.getItem(name + '_ts');
	if (stored_time == undefined || stored_time == 'null') { var stored_time = 0; }
	if (stored_time < current) {
		removeHtmlStorage(name);
		return 0;
	} else {
		return 1;
	}
}