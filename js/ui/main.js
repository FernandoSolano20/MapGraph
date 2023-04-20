/* eslint-disable import/no-extraneous-dependencies */
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';
import Swal from 'sweetalert2';
import Controller from '../dl/controller';
import SelectCountry from './components/selectCountry';

const controller = new Controller();
controller.createGraph().then(() => {
  cytoscape.use(coseBilkent);
  const countries = controller.getAllCountries();
  const nodes = countries.map((vertice) => ({ data: { id: vertice.code } }));
  const edges = controller.getAllEdges();
  const selectOriginCountry = new SelectCountry(countries);
  const selectDestinationCountry = new SelectCountry(countries, 'destination');
  cytoscape({
    container: document.getElementById('graph'),

    layout: {
      name: 'cose-bilkent',
      nodeRepulsion: 4500,
      quality: 'default',
      // Whether to include labels in node dimensions. Useful for avoiding label overlap
      nodeDimensionsIncludeLabels: true,
      // number of ticks per frame; higher is faster but more jerky
      refresh: 30,
      // Whether to fit the network view after when done
      fit: true,
      // Padding on fit
      padding: 1,
      // Whether to enable incremental mode
      randomize: true,
      // Ideal (intra-graph) edge length
      idealEdgeLength: 150,
      // Divisor to compute edge forces
      edgeElasticity: 0.45,
      // Nesting factor (multiplier) to compute ideal edge length for inter-graph edges
      nestingFactor: 1,
      // Gravity force (constant)
      gravity: 2,
      // Maximum number of iterations to perform
      numIter: 2500,
      // Whether to tile disconnected nodes
      tile: true,
      // Type of layout animation. The option set is {'during', 'end', false}
      animate: 'end',
      // Duration for animate:end
      animationDuration: 500,
      // Amount of vertical space to put between degree zero nodes during tiling (can also be a function)
      tilingPaddingVertical: 10,
      // Amount of horizontal space to put between degree zero nodes during tiling (can also be a function)
      tilingPaddingHorizontal: 10,
      // Gravity range (constant) for compounds
      gravityRangeCompound: 1.5,
      // Gravity force (constant) for compounds
      gravityCompound: 1.0,
      // Gravity range (constant)
      gravityRange: 3.8,
      // Initial cooling factor for incremental layout
      initialEnergyOnIncremental: 0.5,
    },

    style: [
      {
        selector: 'node',
        style: {
          label: 'data(id)',
          'text-valign': 'center',
          color: '#000000',
          'background-color': '#3a7ecf',
        },
      },

      {
        selector: 'edge',
        style: {
          width: 2,
          'line-color': '#3a7ecf',
          opacity: 0.5,
          label: 'data(value)',
        },
      },
    ],

    elements: {
      nodes,
      edges,
    },
  });

  document.querySelector('#min_path_country').addEventListener('click', async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Distancia mínima entre países',
      html: `<label>Seleccione un país<label>${selectOriginCountry.html}
      <label>Seleccione un país<label>${selectDestinationCountry.html}`,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => ({
        origin: document.getElementById('origin').value,
        destination: document.getElementById('destination').value,
      }),
    });

    if (formValues) {
      Swal.fire(`Origen: ${formValues.origin}
      Destino: ${formValues.destination}`);
    }
  });

  document.querySelector('#adjacency_countries').addEventListener('click', async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Busqueda entre países',
      html: `<label>Seleccione un país<label>${selectOriginCountry.html}`,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => ({
        origin: document.getElementById('origin').value,
      }),
    });

    if (formValues) {
      Swal.fire(`${controller.getAdjacencyList(formValues.origin)}`);
    }
  });
});
navigator.geolocation.getCurrentPosition(fn_ok, fn_error);

var divMapa = document.getElementById("mapa");

function fn_error(){
    divMapa.innerHTML= 'Hubo un problema solicitando los datos';
}

function fn_ok( respuesta ){
    var latitud = respuesta.coords.latitude;
    var lon = respuesta.coords.longitude;
    divMapa.innerHTML = latitud + ', ' + lon;

    var gLatLon = new google.maps.LatLng( latitud, lon);

    var objConfig = {
      zoom: 17,
      center: gLatLon
    }

    var gMapa = new google.maps.Map(divMapa, objConfig);
    
    var objConfingMarker = {
      position:  gLatLon,
      map: gMapa
    }
    var gMarker = new google.maps.Marker(objConfingMarker);

    var gCoder = new google.maps.geocode();
    var objInformacion = {
      address: '5R74+RRF, Poasito, Provincia de Alajuela, Alajuela'
    }
    gCoder.geocode(objInformacion, fn_coder);

    function fn_coder(datos){
      var coordenadas = datos[0].geometry.location;

      var config= {
        map: gMapa,
        position: coordenadas
      }

      var gMarkerDV = new google.maps.Marker(config);
    }

}
function mostrar_objeto( obj){
  for(var prop in obj){
    document.write( prop+ " : " + obj[prop] + '<br> />');
  }
}

var objConfigDR = {
    map: gMapa
}

var objConfigDS = {
    origin: gLatLon ,
    destination: '5R74+RRF, Poasito, Provincia de Alajuela, Alajuela',
    travelMode: google.maps.TravelMode.DRIVING
}

var ds = new google.maps.DirectionsService(); //obtiene coordenadas

var dr = new google.maps.DirectionsRenderer(objConfigDR);// traduce coordenadas a la ruta visible

function fn_rutear(resultados, status){
    if(status == 'OK'){
      dr.setDirections( resultados);
    }else{
      alert('Error' + status);
    }
}
ds.route(objConfigDS, fn_rutear);

