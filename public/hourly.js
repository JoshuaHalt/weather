// Handles hourly methods

var allHourly = "";

var isHourlyShowing = false;

function hourlyClick(evt) {
  showHideHourly(!isHourlyShowing);
  
  if (allHourly === '') {
    $.get('/hourly?' + $.param({lat: searchedLatLng[0], lng: searchedLatLng[1]}), function(conds) {
      allHourly = conds.hourly_forecast;
      
      $.each(allHourly, function (i, hour) {
        var icon = hour.icon;
        var iconUrl = hour.icon_url;
        
        var time = hour.FCTTIME.civil;
        
        var temp = hour.temp.english;
        var feelsLike = hour.feelslike.english;
        var wx = hour.wx;
        var pop = hour.pop;
        
        var windDegrees = hour.wdir.degrees;
        var windDir = hour.wdir.dir;
        var windSpeed = hour.wspd.english;
        var snow = hour.snow.english;
                                
        var hourlyRowTemplate = '<a class="hourlyRow">' +
                                  '<span class="underline">' + time + '</span>' +
                                   
                                  '<br>' +
                                   
                                  '<img class="iconMedium" src="'+ iconUrl + '" alt="' + icon + '"/>' + 
                                  '<span id="hourlyTemp' + i + '" class="hourlyTemp">' + temp + '</span>' +
                                  '<span id="hourlyFeelsLike' + i + '" class="italic smaller paddingLeftSmall">(' + feelsLike + '&deg;F)</span>' +
                                  
                                  '<br>' +
                                  
                                  '<span>' +
                                    '<span id="hourlyWx' + i + '">' + wx + '</span>' +
                                    '<span id="hourlyPop' + i + '" class="paddingLeftSmall">(' + pop + '%)</span>' +
                                     
                                    '<br>' +
                                    
                                    '<span class="sameLine">' +
                                      '<img id="hourlyWindIcon' + i + '" class="icon" src="https://cdn.hyperdev.com/80bb8063-52b2-4adc-b41f-36a027ed93ab%2Fup_arrow.jpeg"/>' +
                                      '<span id="hourlyWind' + i + '" class="paddingLeftSmall">' + windDir + ' ' + windSpeed + ' mph</span>' +
                                    '</span>' +
                                     
                                  '</span>' +
                                 
                                '</a>';
                                
        $('#hourlyRowsContainer').append(hourlyRowTemplate);
        
        processTemps($('#hourlyTemp' + i), $('#hourlyFeelsLike' + i), temp, feelsLike, true);
        processWind($('#hourlyWind' + i), $('#hourlyWindIcon' + i), windDegrees, windDir, windSpeed, -100);
        
        if (pop >= 30) {
          $('#hourlyPop' + i).css('font-weight', 'bold');
          $('#hourlyWx' + i).css('font-weight', 'bold');
        } else {
          $('#hourlyPop' + i).css('font-weight', 'normal');
          $('#hourlyWx' + i).css('font-weight', 'normal');
        }
      });
    });
  }
}

function showHideHourly(shouldShow) {
  var plusHourly = '+ hourly';
  var minusHourly = '- hourly';
  
  if (shouldShow) {
    $('#hourlyLabel').text(minusHourly);
    
    $('#btnGetHourly').stop().animate({ width: '98%', height: '98%' }, 300, function() {
      $('#hourlyRowsContainer').fadeIn(300);
    });
    
    isHourlyShowing = true;
  } else {
    $('#hourlyLabel').text(plusHourly);
    
    $('#hourlyRowsContainer').stop().fadeOut(300, function () {
      $('#btnGetHourly').css('width', 'initial');
      $('#btnGetHourly').css('height', 'initial');
      
      isHourlyShowing = false;
    });
  }
}