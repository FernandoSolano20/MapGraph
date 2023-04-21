const url = new URLSearchParams(window.location.search);
const originLatLng = url.get('originLatLng').split('|');
const originLat = +originLatLng[0];
const originLng = +originLatLng[1];
const destinationLatLng = url.get('destinationLatLng').split('|');
const destinationLat = +destinationLatLng[0];
const destinationLng = +destinationLatLng[1];
const divMapa = document.getElementById('map');

window.initMap = () => {
  const origin = new google.maps.LatLng(originLat, originLng);
  const destination = new google.maps.LatLng(destinationLat, destinationLng);

  const objConfig = {
    zoom: 17,
    center: origin,
  };
  const gMapa = new google.maps.Map(divMapa, objConfig);

  const objConfigDR = {
    map: gMapa,
  };

  const objConfigDS = {
    origin,
    destination,
    travelMode: google.maps.TravelMode.DRIVING,
  };

  const ds = new google.maps.DirectionsService(); // obtiene coordenadas

  const dr = new google.maps.DirectionsRenderer(objConfigDR); // traduce coordenadas a la ruta visible

  function fnRutear(resultados, status) {
    if (status === 'OK') {
      dr.setDirections(resultados);
    } else {
      alert('Error' + status);
    }
  }
  ds.route(objConfigDS, fnRutear);
};
