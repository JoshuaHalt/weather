// Handles current conditions

var allConditions = "";

function getCurrentConditionsForLatLong(latitude, longitude) {
  $.get('/currentConditions?' + $.param({lat: latitude, lng: longitude}), function(conds) {
    allConditions = conds.current_observation;
    
    var currentTemp = Math.round(allConditions.temp_f);
    var feelsLike = Math.round(allConditions.feelslike_f);
    
    var windDegrees = allConditions.wind_degrees;
    var windDir = allConditions.wind_dir;
    var windMph = allConditions.wind_mph;
    var windGustMph = allConditions.wind_gust_mph;
    
    $('#nowTitle').text(allConditions.display_location.full);
    $('#nowWeather').text(allConditions.weather);
    
    processTemps($('#nowTemp'), $('#nowFeelsLike'), currentTemp, feelsLike, false);
    processWind($('#nowWind'), $('#nowWindIcon'), windDegrees, windDir, windMph, windGustMph);
    processNowPressure();
    processNowOther();
    
    // last updated time
    var now = new Date();
    now.setTime(parseInt(allConditions.observation_epoch) * 1000);
    $('#lastUpdated').html('Last updated ' + $.datepicker.formatDate('m/d', now) +
        ' at <b>' + now.toLocaleTimeString() + '</b>');
    
    // images
    var imageAlt = allConditions.icon;
    var imageUrl = allConditions.icon_url;
    var wuLogoUrl = allConditions.image.url;
    
    $('#nowImage').attr("src", imageUrl);
    $('#nowImage').attr("alt", imageAlt);

    $('#WULogo').attr("src", wuLogoUrl);
    $('#WULogo').attr("alt", "Weather Underground");
    $('#WULogo').removeClass('displayNone');
    
    showHideTab('now', true);
  });
}

function processNowPressure() {
  var pressureTrend = allConditions.pressure_trend; // ‘+’ up, ‘-‘ down, ‘0' stable
  var pressureMb = allConditions.pressure_mb;
  
  var pressureDegrees = 0;
  switch(pressureTrend) {
    case '0':
      pressureDegrees = 45;
      break;
    case '-':
      pressureDegrees = 90;
      break;
  }


  $('#nowPressure').text(pressureMb + ' mb');
  $('#nowPressureIcon').rotate({
    duration: 300,
    angle: 0,
    animateTo: 45 + pressureDegrees
  });
}

function processNowOther() {
  var relativeHumidity = allConditions.relative_humidity;
  var dewpoint = allConditions.dewpoint_f;
  var precipToday = allConditions.precip_today_in;
  var visibility = allConditions.visibility_mi;
  var solarRadiation = allConditions.solarradiation;
  var soilTemp = allConditions.soil_temp_f;
  var soilMoisture = allConditions.soil_moisture;
  
  
  $('#nowRelativeHumidity').text('RH: ' + relativeHumidity);
  $('#nowDewpoint').text('Dew point: ' + dewpoint + '\xB0F');
  $('#nowPrecip').text('Precip today: ' + precipToday + '"');
  
  $('#nowVisibility').text('Visibility: ' + visibility + ' miles');
  if (visibility < 10) {
    $('#nowVisibility').css('font-weight', 'bold');
    if (visibility < 1)
      $('#nowVisibility').css('color', '#800000');
  } else {
    $('#nowVisibility').css('font-weight', 'normal');
    $('#nowVisibility').css('color', '#000');
  }
  
  if (solarRadiation === '--')
    $('#nowSolarRadiationContainer').hide();
  else {
    $('#nowSolarRadiationContainer').hide();
    $('#nowSolarRadiation').html('Solar Radiation: ' + solarRadiation + ' w/m<sup>2</sup>');
  }
  
  if (soilTemp === undefined)
    $('#nowSoilTempContainer').hide();
  else {
    $('#nowSoilTempContainer').show();
    $('#nowSoilTemp').text('Soil temp: ' + soilTemp + '\xB0F');
  }
  
  if (soilMoisture === undefined)
    $('#nowSoilMoistureContainer').hide();
  else {
    $('#nowSoilMoistureContainer').show();
    $('#nowSoilMoisture').text('Soil moisture: ' + soilMoisture + '');
  }
}