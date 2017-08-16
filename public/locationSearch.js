const COOKIE_LAST_LOCATION_LAT_LNG = 'cookieLastLocationLatLng';
const COOKIE_LAST_LOCATION_NAME = 'cookieLastLocationName';

var searchedLatLng = [0, 0];

var currentLocationList = [];
var isSearchShowing = false;

function addSearchBarMethods() {
  $("#mainSearchBar").on('keyup', function (e) {
    if (e.target.value.length > 2 && e.which !== 13)
        searchForLocation();
    else {
      $('#locationList').hide();
    }
    
    if (e.which == 13)
      $('#searchGlass').click();
  });
  
  $('#mainSearchBar').on('keydown', function (e) {
    if (e.which == 9) { // tab
      e.preventDefault();
      
      if (currentLocationList.length > 0) {
        $('#mainSearchBar').val(currentLocationList[0].name);
        $('#mainSearchBar').focus();
      }
    }
  });
  
  $("#mainSearchBar").on('focusout', function (e) {
    if (e.relatedTarget === null || e.relatedTarget.id !== 'searchGlass')
      showHideSearch(false);
  });
  
  $("#mainSearchBar").on('focus', function (e) {
    if (e.target.value.length > 2)
      searchForLocation();
  });
  
  $('#locationList').hide();
  $('#mainSearchBar').hide();
  
  if ("geolocation" in navigator) {
    /* geolocation is available */
  } else {
    $('#currentLocation').hide();
  }
}

function searchForLocation() {
  var searchLoc = $('#mainSearchBar').val();
  
  $.get('/searchForLoc?' + $.param({loc: searchLoc}), function(locs) {
    $('#locationList').html("");
    
    if (!isSearchShowing)
      return;
    
    currentLocationList = locs.RESULTS;
    
    $.each(currentLocationList, function(i, loc) {
        $('<li></li>').html("<a href=\"javascript:void(0)\" onclick=\"handleLocationSelected('" +
          loc.name + "', " + loc.lat + ", " + loc.lon + ")\">" + loc.name + "</a>").addClass('flex').appendTo('#locationList');
          
      if (i === 9)
        return false;
    });
    
    if (currentLocationList.length === 0)
      $('#locationList').hide();
    else
      $('#locationList').fadeIn(300);
  });
}

function currentLocationClick() {
  navigator.geolocation.getCurrentPosition(function(location) {
    var searchLoc = location.coords.latitude + "," + location.coords.longitude;
    
    $.get('/searchForLatLng?' + $.param({loc: searchLoc}), function(locs) {
      $('#locationList').hide();
      
      var loc = locs.location;
      handleLocationSelected(loc.city + ", " + loc.state, loc.lat, loc.lon);
    });
  });
}

function searchGlassClick() {
  if (isSearchShowing) {
    if (currentLocationList.length === 0)
      return;
  
    handleLocationSelected(currentLocationList[0].name, currentLocationList[0].lat, currentLocationList[0].lon);
  } else {
    showHideSearch(true);
  }
}

function handleLocationSelected(name, lat, lng) {
  showHideSearch(false);
  
  $("#mainSearchBar").val(name);
  
  if (isHourlyShowing) {
    showHideHourly(false);
    allHourly = '';
    $('#hourlyRowsContainer').html('');
  }
    
  if (isForecastShowing) {
    showHideForecast(false);
    allForecast = '';
    $('#forecastRowsContainer').html('');
  }
  
  searchedLatLng = [lat, lng];
  
  writeCookie(COOKIE_LAST_LOCATION_LAT_LNG, lat + ',' + lng, 365 * 5);
  writeCookie(COOKIE_LAST_LOCATION_NAME, name, 365 * 5);
  
  getCurrentConditionsForLatLong(lat, lng);
}

function showHideSearch(shouldShow) {
  if (shouldShow) {
    isSearchShowing = true;
    $('#mainSearchContainer').stop().addClass('quarter', 300, function() {
      $('#mainSearchBar').show(300);
      $('#mainSearchBar').focus();
    });
  } else {
    isSearchShowing = false;
    $('#locationList').fadeOut(200);
    $('#mainSearchBar').stop().hide(300, function() {
      $('#mainSearchContainer').removeClass('quarter', 300);
    });
  }
}