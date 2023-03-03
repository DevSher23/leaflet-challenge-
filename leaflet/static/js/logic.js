// past 7 days GeoJSON data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// create features function
function circleSize(magnitude) {
    return (magnitude * 20000);
  }

//circle color for depth
function circleColor(depth) {
    switch(true) {
      case depth > 90:
        return "red";
      case depth > 70:
        return "purple";
      case depth > 50:
        return "orange";
      case depth > 30:
        return "gold";
      case depth > 10:
        return "yellow";
      default:
        return "limegreen";
    }
  }

  
  

// creating the map 
var myMap = L.map("map", {
    center: [37.52, -95.71],
    zoom: 4
  });

  // add tile layer 
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Get the data with d3.
d3.json(queryUrl).then(function(data){

    // Loop through data
  for (var i = 0; i < data.features.length; i++) {
    
    // Set the circle radius & color    
    L.circle([data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]], {
      color: "black",
      fillColor: circleColor(data.features[i].geometry.coordinates[2]),
      fillOpacity: 0.5,
      radius: circleSize(data.features[i].properties.mag)
    
    // add the popup feature 
    }).bindPopup(`<h3>${data.features[i].properties.title}</h3><hr><p>Depth: ${data.features[i].geometry.coordinates[2]} km</p>`)
    .addTo(myMap)     
}})



// add legend
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'info legend');
  var mag = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+'];
  // var mag = [0, 1, 2, 3, 4, 5];

  var colors = [
    "#98ee00",
    "#d4ee00",
    "#eecc00",
    "#ee9c00",
    "#ea822c",
    "#ea2c2c"
  ];

  
  div.innerHTML += '<h4>Magnitude Level</h4><hr>';

  for (var i = 0; i < mag.length; i++) {

    div.innerHTML +=
      '<i style="background:' + colors[i] + '"></i> ' +
      mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
  }

  return div;
};

legend.addTo(myMap);
