// Creating the map object
let myMap = L.map("map", {
  center: [30.2672, -97.7431], // Set Austinas center
  zoom: 4
});

// Adding the tile layer for base mapping
L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXJpZWxnYW1pbm8iLCJhIjoiY2t5ZjRmaGV2MGY4ejJvcGxhaXpmeGRuaiJ9.y5NFodPtNK_FHZekxtrCUQ', {
     attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
     tileSize: 512,
     zoomOffset: -1
}).addTo(myMap);


// Read the geojson file containing the earthquakes from past 7 days
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then((data) => {

  // Print on the console
  console.log(data.features);

  // Function to calculate the marker size based on magnitude of the earthquake
  function markersize(magnitude){
      return magnitude*10000;
  }


  // Function to return marker color based on the depth
  function markerColor(depth) {
    if (depth <= 10) return "#FFFFFF"; // Shallowest: White
    else if (depth <= 30) return "#CCFFFF"; // Shallower: Almost white
    else if (depth <= 50) return "#99CCFF"; // Shallow: Very light blue
    else if (depth <= 70) return "#66CCFF"; // Moderate: Light blue
    else if (depth <= 90) return "#3399FF"; // Deep: Lighter blue
    else return "#0000FF"; // Deepest: Blue
  }

  // Add markers to each co-ordinate in the earthquake data
  data.features.forEach((record) => {

     let marker = L.circle([record.geometry.coordinates[1],record.geometry.coordinates[0]],{
      stroke: true,
      fillOpacity: 0.75,
      color: '#000',
      weight : 1,
      opacity : 0.75,
      fillColor: markerColor(record.geometry.coordinates[2]),
      radius : markersize(record.properties.mag),
     // Adding popup to provide additional information on the earthquake like location, magnitude and depth
     }).bindPopup("<h3>Location: " + record.properties.place + "<h3><h3>Magnitude: " + record.properties.mag + "<h3><h3>Depth: " + record.geometry.coordinates[2] + "</h3>").addTo(myMap);
  })

  // Define legend icons and labels with reversed order for "Deepest" and "Shallowest"
const legendItems = [
  { color: '#FFFFFF', label: 'Shallowest: -10 to 10' },
  { color: '#CCFFFF', label: 'Shallower: 10 to 30' },
  { color: '#99CCFF', label: 'Shallow: 30 to 50' },
  { color: '#66CCFF', label: 'Moderate: 50 to 70' },
  { color: '#3399FF', label: 'Deep: 70 to 90' },
  { color: '#0000FF', label: 'Deepest: 90+' }
];

// Adding a legend to the map
const legend = L.control({ position: 'bottomright' });
legend.onAdd = function () {
  const div = L.DomUtil.create('div', 'legend-container');

  // Loop through legend items and create icons and labels
  legendItems.forEach(item => {
    const iconHtml = `<i class="legend-icon" style="background:${item.color}"></i>`;
    const label = `<span>${iconHtml}${item.label}</span>`;
    div.innerHTML += label + '<br>';
  });

  return div;
};

// Add the legend to the map
legend.addTo(myMap);




});
