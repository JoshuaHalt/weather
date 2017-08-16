// Handles hourly methods

var allHourly = "";

var isHourlyShowing = false;

var isIgnoringClickActions = false;

function hourlyClick(evt) {
  if (isIgnoringClickActions)
    return;
  
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
                                
        var hourlyRowTemplate = '<a id="hourlyRow' + i + '" class="hourlyRow">' +
                                  '<span class="underline">' + time + '</span>' +
                                   
                                  '<br>' +
                                   
                                  '<img class="iconMedium" src="'+ iconUrl + '" alt="' + icon + '"/>' + 
                                  '<span id="hourlyTemp' + i + '" class="smallerTemp paddingLeftSmall">' + temp + '</span>' +
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
        
        $('#hourlyRow' + i).css('display', 'none');
        
        if (i + 1 === allHourly.length)
          $('#hourlyRow' + i).css('border-right', 'none');
        
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
      
      $('#hourlyGraphLabel').fadeIn(300);
      $('#hourlyRowsContainer').fadeIn(300, function() {
        isIgnoringClickActions = false;
        
        fadeIn('#hourlyRow', allHourly.length, 'hourly');
      });
    });
  }
}

function hourlyGraphClick() {
  if (allHourly !== '') {
    
    var colorSet = allHourly[0].temp.english > 55 ? 'summerColors' : 'winterColors';
    
    var tempArray = [];
    var feelsLikeArray = [];
    var popArray = [];
    var windSpeedArray = [];
    
    $.each(allHourly, function (i, hour) {
      tempArray.push({ 'label': hour.FCTTIME.civil, y: parseInt(hour.temp.english) });
      feelsLikeArray.push({ 'label': hour.FCTTIME.civil, y: parseInt(hour.feelslike.english) });
      popArray.push({ 'label': hour.FCTTIME.civil, y: parseInt(hour.pop) });
      windSpeedArray.push({ 'label': hour.FCTTIME.civil, y: parseInt(hour.wspd.english) });
    });
    
    $('#defaultTabGraphPopup')[0].click();
    
    showGraph('Hourly Temps', '36 Hour Forecast', 'Temperature (\xB0F)', colorSet,
              { 'Temperature': tempArray, 'Feels Like': feelsLikeArray }, $('#popupGraphTemp'), false);
              
    showGraph('Hourly Wind', '36 Hour Forecast', 'Wind (mph)', colorSet,
              { 'Wind Speed': windSpeedArray }, $('#popupGraphWind'), false);
              
    showGraph('Hourly Precipitation Chance', '36 Hour Forecast', 'Chance (%)', colorSet,
              { 'Precip Chance': popArray }, $('#popupGraphPop'), true);
  	
  	showHidePopup(true);
  }
}

function showHideHourly(shouldShow) {
  isIgnoringClickActions = true;
  
  var plusHourly = '+ hourly';
  var minusHourly = '- hourly';
  
  if (shouldShow) {
    $('#hourlyLabel').text(minusHourly);
    
    $('#btnGetHourly').stop().animate({ width: '100%' }, 300, function() {
      if (allHourly !== '') {
        $('#hourlyRowsContainer').fadeIn(300);
        $('#hourlyGraphLabel').fadeIn(300);
        
        isIgnoringClickActions = false;
      }
    });
    
    isHourlyShowing = true;
  } else {
    $('#hourlyLabel').text(plusHourly);
    
    $('#hourlyGraphLabel').fadeOut(250);
    $('#hourlyRowsContainer').stop().fadeOut(300, function () {
      $('#btnGetHourly').css('width', '');
      
      isHourlyShowing = false;
      isIgnoringClickActions = false;
    });
  }
}