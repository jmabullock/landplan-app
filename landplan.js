var map;
var json = "https://sheets.googleapis.com/v4/spreadsheets/1kbWwWz5brzterp16PqUdSNwDc4tUuAyJAEqvxEx2p84/values/Sheet1!A:T?key=";
var infowindow = new google.maps.InfoWindow();

function initialize() {

    var mapProp = {
        center: new google.maps.LatLng(42.602571, 0.466670), //LLANDRINDOD WELLS
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map"), mapProp);
    
    var latLngObj = {};

    $.getJSON(json, function(result,status,bleh) {
        
        json1 = getJsonArrayFromData(result.values);
        
        
        $.each(json1, function (key, data) {
            
            var regex = '^.+@(.+),(.+),.+$';
            var found = data["exact location link"].match(regex);
            if (found !== null){
            var lat = parseFloat(found[1])
            var lng = parseFloat(found[2])
            if (lat in latLngObj){
                lat += 0.01;
                lng += 0.01;
                latLngObj[lat] = lng;
                
            } else {
                latLngObj[lat] = lng;
            }
            var latLng = new google.maps.LatLng(lat, lng);

            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                
            });
            
            
            var details = "<div> Link: <a href='"+data["link"]+"'>"+data["link"]+"</a>"  + 
                          "<br> Price: €" + data["Price EUR"] + 
                          "<br> Hectares: " + data["area (ha)"] +
                          "</div>";

            bindInfoWindow(marker, map, infowindow, details);
        };
    });
    });
}
  
function bindInfoWindow(marker, map, infowindow, strDescription) {
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(strDescription);
        infowindow.open(map, marker);
    });
}

function getJsonArrayFromData(data)
{

  var obj = {};
  var result = [];
  var headers = data[0];
  var cols = headers.length;
  var row = [];

  for (var i = 1, l = data.length; i < l; i++)
  {
    // get a row to fill the object
    row = data[i];
    // clear object
    obj = {};
    for (var col = 0; col < cols; col++) 
    {
      // fill object with new values
      obj[headers[col]] = row[col];    
    }
    // add object in a final result
    result.push(obj);  
  }

  return result;  

}

google.maps.event.addDomListener(window, 'load', initialize);