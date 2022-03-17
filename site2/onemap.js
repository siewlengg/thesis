var center = L.bounds([1.56073, 104.11475], [1.16, 103.502]).getCenter();
var map = L.map('mapdiv').setView([1.3106396396662117, 103.86145014183286], 17);

var basemap = L.tileLayer('https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png', {
  detectRetina: true,
  maxZoom: 18,
  minZoom: 15
});

map.setMaxBounds([[1.56073, 104.1147], [1.16, 103.502]]);

basemap.addTo(map);

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
}


function showPosition(position) {           
  marker = new L.Marker([position.coords.latitude, position.coords.longitude], {bounceOnAdd: false}).addTo(map);             
  var popup = L.popup()
  .setLatLng([position.coords.latitude, position.coords.longitude]) 
  .setContent('You are here!')
  .openOn(map);         
}

var site = L.latLng(1.31, 103.86);

var circle = L.circle (site, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius:100
}).addTo(map);

//L.Icon.Default.imagePath = 'https://unpkg.com/browse/leaflet@1.7.1/dist/images/';

map.invalidateSize();