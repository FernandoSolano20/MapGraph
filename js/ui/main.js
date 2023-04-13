// eslint-disable-next-line import/no-extraneous-dependencies
import cytoscape from 'cytoscape';
import avsdf from 'cytoscape-avsdf';
import Controller from '../dl/controller';

const controller = new Controller();
controller.createGraph().then(() => {
  cytoscape.use(avsdf);
  const vertices = controller.getAllNodes();
  const nodes = vertices.map((vertice) => ({ data: { id: vertice.code } }));
  const edges = controller.getAllEdges();
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
});
