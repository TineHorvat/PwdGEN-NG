var arr;
$(document).ready(function () {
	var specials = ["!", "#", "$", "%", "&", "(", ")", "*", "+", ",", "-", ".", "/", ":", ";", "<", "=", ">", "?", "@", "[", "]", "^", "_", "{", "|", "}", "~"];
	$(".genButton").on("click", function (e) {
		arr = new Array();
		e.preventDefault();
		var status = statusHtmlStorage('cWords');
		if (status) {
			arr = JSON.parse(localStorage.getItem('cWords'));
		} else {
			var arrSI = buildArray("words.xml");
			var arrEN = buildArray("words.en.xml");
			arr = arrSI.concat(arrEN);
			setHtmlStorage('cWords', JSON.stringify(arr), 30);
		}
		var arrLen = arr.length;
		var itemNo = getRandomInt(0, arrLen - 1);
		var randNum = getRandomInt(100, 999);
		var specNo = getRandomInt(0, specials.length - 1);
		var genP = randomCaseStr(arr[itemNo]); //arr[itemNo];
		var extraP = getRandomStr(3);
		
		var passChunks = new Array();
		passChunks.push(extraP, genP, randNum, specials[specNo]);
		//shuffle password chunks to random positions and join to string
		var genPass = shuffleArray(passChunks).join('');

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

	//dark mode option
	var currentTheme = localStorage.getItem("theme");
	if (currentTheme == "dark-theme") {
		$('body').addClass('dark-theme');
		$("#color_mode").prop("checked", "checked");
	}
	$("div.toggle-dark-mode-holder").fadeIn();
	$("#color_mode").on("change", function () {
       toggleDarkMode(this);
    });
});
//functions
function toggleDarkMode(ele) {
    if($(ele).prop("checked") == true){
        $('body').addClass('dark-theme');
		localStorage.setItem("theme", "dark-theme");
    }
    else if($(ele).prop("checked") == false){
        $('body').removeClass('dark-theme');
		localStorage.removeItem("theme");
    }
}
function buildArray(fileName) {
	var xmlArray = [];
	$.ajax({
		url: fileName,
		dataType: 'xml',
		async: false,
		success: function (data) {
			var xml_node = $('words', data);
			$(xml_node).find('word').each(function () {
				xmlArray.push($.trim($(this).text()));
			});
		},
		error: function (data) {
			if (window.console)
				console.log('Error loading XML data');
		}
	});
	return xmlArray;
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
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
	return array;
}