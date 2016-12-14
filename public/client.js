// First javascript run

var allConditions = "";

$(function() {
  $('#defaultTab')[0].click();
  
  var lastLocLatLng = readCookie(COOKIE_LAST_LOCATION_LAT_LNG);
  var lastLocName = readCookie(COOKIE_LAST_LOCATION_NAME);
  
  if (lastLocLatLng !== null && lastLocName !== null) {
    $('#mainSearchBar').val(lastLocName);
    
    searchedLatLng = lastLocLatLng.split(',');
    // getCurrentConditionsForLatLong(searchedLatLng[0], searchedLatLng[1]);
  }
  
  addSearchBarMethods();
  
  $('#hourlyContainer').hide();
  // $('#nowDetailsContainer').hide();
  
  // $('.tab').hide();
  // $('.tabcontent').hide();
});

function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

