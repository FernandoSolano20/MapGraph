import cytoscape from 'cytoscape';
import avsdf from 'cytoscape-avsdf';
// eslint-disable-next-line import/no-extraneous-dependencies
import Swal from 'sweetalert2';
import Controller from '../dl/controller';
import SelectCountry from './components/selectCountry';

const controller = new Controller();
controller.createGraph().then(() => {
  cytoscape.use(avsdf);
  const countries = controller.getAllCountries();
  const nodes = countries.map((vertice) => ({ data: { id: vertice.code } }));
  const edges = controller.getAllEdges();
  const selectOriginCountry = new SelectCountry(countries);
  const selectDestinationCountry = new SelectCountry(countries, 'destination');
  cytoscape({
    container: document.getElementById('graph'),

    layout: {
      name: 'avsdf',
      nodeSeparation: 120,
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
      const result = controller.getMinPath(formValues.origin, formValues.destination);
      if (result.path.length) {
        Swal.fire(`El camino mínimo es: ${result.path.join(' -> ')} con una distancia de ${result.cost.toFixed(2)} km`);
      } else {
        const countryOrigin = controller.getCountryByCode(formValues.origin);
        const countryDestination = controller.getCountryByCode(formValues.destination);
        Swal.fire(`No hay camino entre ${countryOrigin.name} y ${countryDestination.name}`);
      }
    }
  });

  document.querySelector('#max_path_country').addEventListener('click', async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Distancia máxima entre países',
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
      const result = controller.getMaxPath(formValues.origin, formValues.destination);
      if (result.path.length) {
        Swal.fire(`El camino máximo es: ${result.path.join(' -> ')} con una distancia de ${result.cost.toFixed(2)} km`);
      } else {
        const countryOrigin = controller.getCountryByCode(formValues.origin);
        const countryDestination = controller.getCountryByCode(formValues.destination);
        Swal.fire(`No hay camino entre ${countryOrigin.name} y ${countryDestination.name}`);
      }
    }
  });
});
