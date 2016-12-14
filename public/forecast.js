// Handles forecast methods

var allForecast = "";

var isForecastShowing = false;

function forecastClick(evt) {
  showHideForecast(!isForecastShowing);
  
  if (allForecast === '') {
    $.get('/forecast?' + $.param({lat: searchedLatLng[0], lng: searchedLatLng[1]}), function(conds) {
      allForecast = conds.forecast;
      
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
                                
        var forecastRowTemplate = '<a class="forecastRow">' +
                                  '<span class="underline">' + date + '</span>' +
                                   
                                  '<br>' +
                                   
                                  '<img class="iconMedium" src="'+ iconUrl + '" alt="' + icon + '"/>' + 
                                  '<span id="forecastHighTemp' + i + '" class="forecastHighTemp">' + highTemp + '</span>' +
                                  '<span id="forecastLowTemp' + i + '" class="italic smaller paddingLeftSmall">(' + lowTemp + '&deg;F)</span>' +
                                  
                                  '<br>' +
                                  
                                  '<span>' +
                                    '<span id="forecastWx' + i + '">' + wx + '</span>' +
                                    '<span id="forecastPop' + i + '" class="paddingLeftSmall">(' + pop + '%)</span>' +
                                     
                                    '<br>' +
                                    
                                    '<span class="sameLine">' +
                                      '<img id="forecastWindIcon' + i + '" class="icon" src="https://cdn.hyperdev.com/80bb8063-52b2-4adc-b41f-36a027ed93ab%2Fup_arrow.jpeg"/>' +
                                      '<span id="forecastWind' + i + '" class="paddingLeftSmall">' + windDir + ' ' + windSpeed + ' mph, ' + windGust + ' mph gusts</span>' +
                                    '</span>' +
                                     
                                  '</span>' +
                                 
                                '</a>';
                                
        $('#forecastRowsContainer').append(forecastRowTemplate);
        
        processTemps($('#forecastHighTemp' + i), $('#forecastLowTemp' + i), highTemp, lowTemp, true);
        processWind($('#forecastWind' + i), $('#forecastWindIcon' + i), windDegrees, windDir, windSpeed, windGust);
        
        if (pop >= 30) {
          $('#forecastPop' + i).css('font-weight', 'bold');
          $('#forecastWx' + i).css('font-weight', 'bold');
        } else {
          $('#forecastPop' + i).css('font-weight', 'normal');
          $('#forecastWx' + i).css('font-weight', 'normal');
        }
      });
    });
  }
}

function showHideForecast(shouldShow) {
  var plusForecast = '+ forecast';
  var minusForecast = '- forecast';
  
  if (shouldShow) {
    $('#forecastLabel').text(minusForecast);
    
    $('#btnGetForecast').stop().animate({ width: '98%', height: '98%' }, 300, function() {
      $('#forecastRowsContainer').fadeIn(300);
    });
    
    isForecastShowing = true;
  } else {
    $('#forecastLabel').text(plusForecast);
    
    $('#forecastRowsContainer').stop().fadeOut(300, function () {
      $('#btnGetForecast').css('width', 'initial');
      $('#btnGetForecast').css('height', 'initial');
      
      isForecastShowing = false;
    });
  }
}