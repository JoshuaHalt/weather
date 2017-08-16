// Helper class

var currentTopIndex = {};
// var currentSelectorText = {};

var fadeInSpeed = {};

function showHidePopup(show, evt) {
  if (evt !== undefined && evt.currentTarget.classList.contains('popupSubContainer')) {
    evt.stopPropagation();
    return;
  }
  
  if (show) {
    $('.popupContainer').fadeIn(300);
    $('#popupBackgroundBlocker').fadeIn(300);
  } else {
    $('.popupContainer').fadeOut(300);
    $('#popupBackgroundBlocker').fadeOut(300);
    
    $('#hourlyGraphTemp').html('');
    $('#hourlyGraphWind').html('');
    $('#hourlyGraphPop').html('');
    
    $('#forecastGraphContainer').html('');
  }
}

function fadeIn(selectorText, totalCount, setIndex) {
  fadeInSpeed[setIndex] = 150;
  
  // currentSelectorText[setIndex] = selectorText;
  currentTopIndex[setIndex] = totalCount;
  
  // fadeInRecursive(currentSelectorText[setIndex], 0, setIndex);
  fadeInRecursive(selectorText, 0, setIndex);
}

function fadeInRecursive(selectorText, index, setIndex) {
  $(selectorText + index).show('fade', fadeInSpeed[setIndex], function () {
    index++;
    
    if (index > 7)
      fadeInSpeed[setIndex] = 20;
    
    if (index < currentTopIndex[setIndex])
      fadeInRecursive(selectorText, index, setIndex);
  });
}

function processTemps(tempSelector, feelsLikeSelector, temp, feels, abbreviated) {
  tempSelector.html(temp + '<sup class="smaller">&deg;F</sup>');
  
  colorTemperature(tempSelector, temp);
  colorTemperature(feelsLikeSelector, feels);


  if (temp == feels)
    feelsLikeSelector.hide();
  else {
    feelsLikeSelector.show();
    
    if (abbreviated) 
      feelsLikeSelector.text('(' + feels + '\xB0F)');
    else
      feelsLikeSelector.text('Feels like ' + feels + '\xB0F');
      
    if (Math.abs(feels - temp) > 10)
      feelsLikeSelector.css('font-size', '18px');
    else
      feelsLikeSelector.css('font-size', '');
  }
}

function processWind(textSelector, imageSelector, deg, dir, mph, gust) {
  var windString = '';
  var windIconUrl = '';
  var spinWindIcon;
  
  if (mph < 1) {
    windString = 'Calm';
    windIconUrl = 'https://cdn.hyperdev.com/80bb8063-52b2-4adc-b41f-36a027ed93ab%2Fwind.png';
    spinWindIcon = false;
  } else {
    windString = dir + ', ' + parseInt(mph) + ' mph' + (gust > mph ? ' gusting to ' + parseInt(gust) + ' mph' : '');
    windIconUrl = 'https://cdn.hyperdev.com/80bb8063-52b2-4adc-b41f-36a027ed93ab%2Fup_arrow.jpeg';
    spinWindIcon = true;
  }
  
  if (mph >= 15)
    textSelector.css('font-weight', 'bold');
  else
    textSelector.css('font-weight', ''); // clears it
    
  textSelector.text(windString);
  imageSelector.attr('src', windIconUrl);
  
  if (spinWindIcon) {
    imageSelector.rotate({
      duration: 300,
      angle: 0,
      animateTo: deg - 180
    });
  } else {
    imageSelector.rotate({
      duration: 300,
      animateTo: 0
    });
  }
}

function showGraph(title, xAxisTitle, yAxisTitle, colorSet, dataSets, selector, isPrecip) {
  // { "Temperature": tempArray, "Feels Like": feelsLikeArray }
  
  var dataArray = [];
  var i = 0;
  
  for (var key in dataSets) {
    if (dataSets.hasOwnProperty(key)) {
      dataArray[i] = {
  			type: "spline",
  			name: key,
  			lineThickness: 3,
  			indexLabelFontFamily: "helvetica neue, arial, sans-serif",
  			showInLegend: true,
  			dataPoints: dataSets[key]
  		};
      
      i++;
    }
  }
  
  var options = {
  		title: {
  			text: title,
  			fontFamily: "helvetica neue, arial, sans-serif"
  		},
  		
      animationEnabled: true,
      animationDuration: 900,
      colorSet: colorSet,
  		width: 1000,
  		
  		axisX: {
  		  title: xAxisTitle,
  		  titleFontFamily: "helvetica neue, arial, sans-serif",
  		  tickLength: 10,
  		  labelFontFamily: "helvetica neue, arial, sans-serif"
  		},
  		
  		axisY: {
  		  title: yAxisTitle,
  		  titleFontFamily: "helvetica neue, arial, sans-serif",
  		  tickLength: 10,
  		  labelFontFamily: "helvetica neue, arial, sans-serif"
  		},
  		
  		legend: {
  		  fontFamily: "helvetica neue, arial, sans-serif",
  		  fontSize: 16
  		},
  		
  		data: dataArray
  };
  
  if (isPrecip)
    options["axisY"]["maximum"] = 100;
  	
  selector.CanvasJSChart(options);
}

function colorTemperature(selector, temp) {
  var hexValue = "#000000";
  selector.removeClass('textBorder');
  
  switch(true) {
    case temp <= -15:
      hexValue = "#66ffff";
      selector.addClass('textBorder');
      break;
    case -15 < temp && temp <= -5:
      hexValue = "#1ad1ff";
      break;
    case -5 < temp && temp <= 5:
      hexValue = "#3385ff";
      break;
    case 5 < temp && temp <= 15:
      hexValue = "#0066ff";
      break;
    case 15 < temp && temp <= 25:
      hexValue = "#0000e6";
      break;
    case 25 < temp && temp <= 32:
      hexValue = "#0000b3";
      break;
    case 32 < temp && temp <= 40:
      hexValue = "#000099";
      break;
    case 40 < temp && temp <= 50:
      hexValue = "#00004d";
      break;
    case 50 < temp && temp <= 60:
      hexValue = "#000000";
      break;
    case 60 < temp && temp <= 70:
      hexValue = "#4d0000";
      break;
    case 70 < temp && temp <= 80:
      hexValue = "#990000";
      break;
    case 80 < temp && temp <= 86:
      hexValue = "#b30000";
      break;
    case 86 < temp && temp <= 94:
      hexValue = "#cc0000";
      break;
    case 94 < temp && temp <= 100:
      hexValue = "#e60000";
      break;
    case 100 < temp && temp <= 110:
      hexValue = "#ff1a1a";
      break;
    case 110 < temp:
      hexValue = "#ff4d4d";
      selector.addClass('textBorder');
      break;
  }
  
  selector.css('color', hexValue);
  
  if (temp <= 0)
    selector.addClass('bold');
  else
    selector.removeClass('bold');
}

function writeCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function clearCookie(name) {
    writeCookie(name, "", -1);
}