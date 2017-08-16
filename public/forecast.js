// Handles forecast methods

const COOKIE_LAST_FORECAST_TYPE = 'cookieLastForecastType';

var allForecast = "";

var isForecastShowing = false;

var standardText = 'standard view';
var textText = 'text view';

function forecastClick(evt) {
  showHideForecast(!isForecastShowing);
  
  if (allForecast === '') {
    $.get('/forecast?' + $.param({lat: searchedLatLng[0], lng: searchedLatLng[1]}), function(conds) {
      allForecast = conds.forecast;
      
      var lastForecastType = readCookie(COOKIE_LAST_FORECAST_TYPE);
      if (lastForecastType === null || lastForecastType === 'standard') {
        showStandardForecast();
        $('#forecastDetailsLabel').text(textText);
      }
      else if (lastForecastType === 'text') {
        showTextForecast();
        $('#forecastDetailsLabel').text(standardText);
      }
    });
  }
}

function showStandardForecast() {
  $('#forecastRowsContainer').html('');
  
  if (allForecast === '')
    return;
    
  $.each(allForecast.simpleforecast.forecastday, function (i, day) {
    var icon = day.icon;
    var iconUrl = day.icon_url;
    
    var date = day.date.weekday + ', ' + day.date.month + '/' + day.date.day;
    
    var highTemp = day.high.fahrenheit;
    var lowTemp = day.low.fahrenheit;
    
    var wx = day.conditions;
    var pop = day.pop;
    
    var windDegrees = day.avewind.degrees;
    var windDir = day.avewind.dir;
    var windSpeed = day.avewind.mph;
    var windGust = day.maxwind.mph;
    
    var rainTotal = day.qpf_allday.in;
    var snowTotal = day.snow_allday.in;
    
    // var tooltip = allForecast.txt_forecast.forecastday[i].fcttext + '\n' + allForecast.txt_forecast.forecastday[i + 1].fcttext;
                            
    var forecastRowTemplate = '<a id="forecastRow' + i + '" class="forecastRow">' +
                                '<span class="underline">' + date + '</span>' +
                               
                                '<br>' + '<br>' +
                               
                                '<span id="forecastHighTemp' + i + '" class="smallerTemp highRight">' + highTemp + '</span>' +
                                '<span id="forecastLowTemp' + i + '" class="smallerTemp lowLeft">' + lowTemp + '</span>' +
                              
                                '<br>' +
                              
                                '<img class="iconMedium" src="'+ iconUrl + '" alt="' + icon + '"/>' + 
                                '<span id="forecastWx' + i + '" class="paddingLeftSmall">' + wx + '</span>' +
                                '<span id="forecastPop' + i + '" class="paddingLeftSmall">(' + pop + '%)</span>' +
                              
                                '<br>' +
                              
                                '<img id="forecastWindIcon' + i + '" class="icon" src="https://cdn.hyperdev.com/80bb8063-52b2-4adc-b41f-36a027ed93ab%2Fup_arrow.jpeg"/>' +
                                '<span id="forecastWind' + i + '" class="paddingLeftSmall">' + windDir + ' ' + windSpeed + ' mph</span>' +
                              
                              '</a>';
                            
    $('#forecastRowsContainer').append(forecastRowTemplate);
    
    
    $('#forecastRow' + i).css('display', 'none');
    
    if (i + 1 === allForecast.simpleforecast.forecastday.length)
      $('#forecastRow' + i).css('border-right', 'none');
    
    processForecastTemp($('#forecastHighTemp' + i), highTemp);
    processForecastTemp($('#forecastLowTemp' + i), lowTemp);
    processWind($('#forecastWind' + i), $('#forecastWindIcon' + i), windDegrees, windDir, windSpeed, -10);
    
    if (pop >= 30) {
      $('#forecastPop' + i).css('font-weight', 'bold');
      $('#forecastWx' + i).css('font-weight', 'bold');
    } else {
      $('#forecastPop' + i).css('font-weight', 'normal');
      $('#forecastWx' + i).css('font-weight', 'normal');
    }
  });
  
  writeCookie(COOKIE_LAST_FORECAST_TYPE, 'standard');
  
  completeShowingForecast(true);
}

function showTextForecast() {
  $('#forecastRowsContainer').html('');
  
  if (allForecast === '')
    return;
  
  var dailyArray = new Array(10);
  
  var j = -1;
  
  $.each(allForecast.txt_forecast.forecastday, function (i, day) {
    if (i % 2 === 0) {
      j++;
      dailyArray[j] = new Array(2);
    }
      
    dailyArray[j][i % 2] = day;
  });
  
  $.each(dailyArray, function (i, dayNight) {
      var iconDay = dayNight[0].icon;
      var iconUrlDay = dayNight[0].icon_url;
      
      var dateDay = dayNight[0].title;
      
      var wxDay = dayNight[0].fcttext;
      var popDay = dayNight[0].pop;
      
      
      var iconNight = dayNight[1].icon;
      var iconUrlNight = dayNight[1].icon_url;
      
      var dateNight = dayNight[1].title;
      
      var wxNight = dayNight[1].fcttext;
      var popNight = dayNight[1].pop;
      
      var forecastRowTemplate = '<a id="forecastDetailRow' + i + '" class="forecastDetailRow">' +
                                  '<img class="iconMedium marginTopMedium" src="'+ iconUrlDay + '" alt="' + iconDay + '"/>' + 
                                  '<span id="forecastDetailDateDay' + i + '" class="paddingLeftSmall underline">' + dateDay + '</span>' +
                                 
                                  '<br>' +
                                 
                                  '<span class="whiteSpaceNormal">' + wxDay + '</span>' +
                                  
                                  '<br>' + '<br>' +
                                  
                                  '<img class="iconMedium marginTopMedium" src="'+ iconUrlNight + '" alt="' + iconNight + '"/>' + 
                                  '<span id="forecastDetailDateNight' + i + '" class="paddingLeftSmall underline">' + dateNight + '</span>' +
                                 
                                  '<br>' +
                                 
                                  '<span class="whiteSpaceNormal">' + wxNight + '</span>' +
                                '</a>';
                              
      $('#forecastRowsContainer').append(forecastRowTemplate);
      
      
      $('#forecastDetailRow' + i).css('display', 'none');
      
      if (i + 1 === dailyArray.length)
        $('#forecastDetailRow' + i).css('border-right', 'none');
      
      if (popDay >= 30)
        $('#forecastDetailDateDay' + i).css('font-weight', 'bold');
      else
        $('#forecastDetailDateDay' + i).css('font-weight', 'normal');
      
      if (popNight >= 30)
        $('#forecastDetailDateNight' + i).css('font-weight', 'bold');
      else
        $('#forecastDetailDateNight' + i).css('font-weight', 'normal');
    });
    
    writeCookie(COOKIE_LAST_FORECAST_TYPE, 'text');
    
    completeShowingForecast(false);
}

function completeShowingForecast(isStandardForecast) {
  $('#forecastGraphLabel').fadeIn(300);
  $('#forecastDetailsLabel').fadeIn(300);
  $('#forecastRowsContainer').fadeIn(300, function() {
    if (isStandardForecast)
      fadeIn('#forecastRow', allForecast.simpleforecast.forecastday.length, 'forecast');
    else
      fadeIn('#forecastDetailRow', 10, 'forecast');
  });
}

function processForecastTemp(tempSelector, temp) {
  tempSelector.html(temp + '<sup class="smaller">&deg;F</sup>');
  
  colorTemperature(tempSelector, temp);
}

function forecastGraphClick() {
  if (allForecast !== '') {
    
    var colorSet = allForecast.simpleforecast.forecastday[0].high.fahrenheit > 55 ? 'summerColors' : 'winterColors';
    
    var highTempArray = [];
    var lowTempArray = [];
    var popArray = [];
    var windSpeedArray = [];
    
    $.each(allForecast.simpleforecast.forecastday, function (i, day) {
      highTempArray.push({ 'label': day.date.month + '/' + day.date.day, y: parseInt(day.high.fahrenheit) });
      lowTempArray.push({ 'label': day.date.month + '/' + day.date.day, y: parseInt(day.low.fahrenheit) });
      popArray.push({ 'label': day.date.month + '/' + day.date.day, y: parseInt(day.pop) });
      windSpeedArray.push({ 'label': day.date.month + '/' + day.date.day, y: parseInt(day.avewind.mph) });
    });
    
    $('#defaultTabGraphPopup')[0].click();
    
    showGraph('10 Day Temps', '10 Days', 'Temperature (\xB0F)', colorSet,
              { 'High': highTempArray, 'Low': lowTempArray }, $('#popupGraphTemp'), false);
              
    showGraph('10 Day Wind', '10 Days', 'Wind (mph)', colorSet,
              { 'Wind Speed': windSpeedArray }, $('#popupGraphWind'), false);
              
    showGraph('10 Day Precipitation Chance', '10 Days', 'Chance (%)', colorSet,
              { 'Precip Chance': popArray }, $('#popupGraphPop'), true);
  	
  	showHidePopup(true);
  }
}

function forecastDetailsClick() {
  if ($('#forecastDetailsLabel').text() === standardText) {
    $('#forecastDetailsLabel').text(textText);
    showStandardForecast();
  } else {
     $('#forecastDetailsLabel').text(standardText);
    showTextForecast();
  }
}

function showHideForecast(shouldShow) {
  var plusForecast = '+ forecast';
  var minusForecast = '- forecast';
  
  if (shouldShow) {
    $('#forecastLabel').text(minusForecast);
    
    $('#btnGetForecast').stop().animate({ width: '100%' }, 300, function() {
      if (allForecast !== '') {
        $('#forecastRowsContainer').fadeIn(300);
        $('#forecastGraphLabel').fadeIn(300);
        $('#forecastDetailsLabel').fadeIn(300);
      }
    });
    
    isForecastShowing = true;
  } else {
    $('#forecastLabel').text(plusForecast);
    
    $('#forecastGraphLabel').fadeOut(250);
    $('#forecastDetailsLabel').fadeOut(250);
    $('#forecastRowsContainer').stop().fadeOut(300, function () {
      $('#btnGetForecast').css('width', 'initial');
      
      isForecastShowing = false;
    });
  }
}