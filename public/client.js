// First javascript run

$(function() {
  var lastLocLatLng = readCookie(COOKIE_LAST_LOCATION_LAT_LNG);
  var lastLocName = readCookie(COOKIE_LAST_LOCATION_NAME);
  
  if (lastLocLatLng !== null && lastLocName !== null) {
    $('#mainSearchBar').val(lastLocName);
    
    searchedLatLng = lastLocLatLng.split(',');
    // getCurrentConditionsForLatLong(searchedLatLng[0], searchedLatLng[1]);
    $('#defaultTab')[0].click();
  } else {
    $('#searchGlass')[0].click();
  }
  
  addSearchBarMethods();
  
  CanvasJS.addColorSet('winterColors', ['#000099', '#0000e6']);
  CanvasJS.addColorSet('summerColors', ['#990000', '#e60000']);
});

function showHideTab(tabName, shouldShow) {
  if (shouldShow) {
    $('.tab').show();
    $('#' + tabName).show('blind', 1000);
  } else {
    $('.tab').fadeOut(300);
    $('#' + tabName).fadeOut(300);
  }
}

function openTab(evt, tabName, tabGroup) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent" + tabGroup);
  for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks" + tabGroup);
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the link that opened the tab
  if (tabGroup === '')
    showHideTab(tabName, true);
  else
    document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}