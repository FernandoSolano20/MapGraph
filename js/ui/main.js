// eslint-disable-next-line import/no-extraneous-dependencies
import cytoscape from 'cytoscape';
import avsdf from 'cytoscape-avsdf';

cytoscape.use(avsdf);

document.addEventListener('DOMContentLoaded', () => {
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
        },
      },
    ],

    elements: {
      nodes: [
        { data: { id: 'v1', weight: 1 } },
        { data: { id: 'v2', weight: 2 } },
        { data: { id: 'v3', weight: 3 } },
        { data: { id: 'v4', weight: 4 } },
        { data: { id: 'v5', weight: 5 } },
        { data: { id: 'v6', weight: 6 } },
        { data: { id: 'v7', weight: 7 } },
      ],
      edges: [
        { data: { source: 'v1', target: 'v2', directed: 'true' } },
        { data: { source: 'v1', target: 'v4', directed: 'false' } },
        { data: { source: 'v1', target: 'v5', directed: 'false' } },
        { data: { source: 'v2', target: 'v4', directed: 'false' } },
        { data: { source: 'v2', target: 'v6', directed: 'false' } },
        { data: { source: 'v3', target: 'v4', directed: 'false' } },
        { data: { source: 'v3', target: 'v7', directed: 'false' } },
        { data: { source: 'v4', target: 'v5', directed: 'false' } },
        { data: { source: 'v4', target: 'v7', directed: 'false' } },
        { data: { source: 'v5', target: 'v6', directed: 'false' } },
        { data: { source: 'v6', target: 'v7', directed: 'false' } },
        { data: { source: 'v6', target: 'v3', directed: 'false' } },
      ],
    },
  });
});
