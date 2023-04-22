import '../../styles/styles.scss';
import Swal from 'sweetalert2';

const url = new URLSearchParams(window.location.search);
const originLatLng = url.get('originLatLng').split('|');
const originLat = +originLatLng[0];
const originLng = +originLatLng[1];
const destinationLatLng = url.get('destinationLatLng').split('|');
const destinationLat = +destinationLatLng[0];
const destinationLng = +destinationLatLng[1];
const divMapa = document.getElementById('map');
const path = document.getElementById('path');

window.initMap = () => {
  const origin = new google.maps.LatLng(originLat, originLng);
  const destination = new google.maps.LatLng(destinationLat, destinationLng);

  const objConfig = {
    zoom: 2,
    center: origin,
  };
  const gMapa = new google.maps.Map(divMapa, objConfig);

  const objConfigDS = {
    origin,
    destination,
    travelMode: google.maps.TravelMode.DRIVING,
  };

  const ds = new google.maps.DirectionsService(); // obtiene coordenadas

  function fnRutear(results, status) {
    if (status === 'OK') {
      const dr = new google.maps.DirectionsRenderer(); // traduce coordenadas a la ruta visible
      dr.setDirections(results);
      dr.setMap(gMapa);
      let html = '<ul>';
      results.routes[0].legs[0].steps.forEach((step) => {
        html += `<li>${step.instructions}; tiempo: ${step.duration.text}; distancia: ${step.distance.text}</li>`;
      });
      html += '</ul>';
      path.innerHTML = html;
    } else {
      Swal.fire(`Google maps tiene problemas con la ruta`);
    }
  }
  ds.route(objConfigDS, fnRutear);
};
