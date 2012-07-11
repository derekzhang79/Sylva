// JSHint options

/*global window:true, document:true, setTimeout:true, console:true, jQuery:true, sylv:true, prompt:true, alert:true, FileReader:true, Processing:true, sigma:true */


/****************************************************************************
 * Sigma.js visualizations
 ****************************************************************************/

;(function(sylv, sigma, $, window, document, undefined) {

  var Sigma = {
    init: function() {
      // Parse nodes and edges.
      var sylv_nodes = JSON.parse(JSON.stringify(sylv.nodes));
      var sylv_edges = JSON.parse(JSON.stringify(sylv.edges));
      // Node info.
      var $tooltip;

      // Instanciate Sigma.js and customize rendering.
      var sigInst = sigma.init(document.getElementById('graph-container')).drawingProperties({
        defaultLabelColor: '#fff',
        defaultLabelSize: 14,
        defaultLabelBGColor: '#fff',
        defaultLabelHoverColor: '#000',
        labelThreshold: 6,
        defaultEdgeType: 'curve'
      }).graphProperties({
        minNodeSize: 0.5,
        maxNodeSize: 5,
        minEdgeSize: 1,
        maxEdgeSize: 1
      }).mouseProperties({
        maxRatio: 32
      });

      // Add nodes.
      for (var n in sylv_nodes) {
        sigInst.addNode(n, {
          x: Math.random(),
          y: Math.random(),
          color: sylv.colors[sylv_nodes[n].type]
        });
      }

      // Add edges.
      for (var e in sylv_edges) {
        sigInst.addEdge(sylv_edges[e].id, sylv_edges[e].source, sylv_edges[e].target);
      }

      // Show node info and hide the rest of nodes and edges.
      sigInst.bind('overnodes', function(event) {
        var nodes = event.content;
        var nodeId = nodes[0];
        var neighbors = {};
        var isOrphan = true;

        // Converts obj properties into a string.
        var attributesToString = function(obj) {
          var str = [];
          for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
              str.push('<li>' + prop + ': ' + obj[prop] + '</li>');
            }
          }
          return str.join('');
        };

        // Show node info.
        sigInst.iterNodes(function(node) {
          $tooltip =
            $('<div class="node-info"></div>')
              .append('<ul>' + attributesToString(sylv_nodes[nodeId]) + '</ul>')
              .addClass('node-info')
              .css({
                'left': node.displayX+212,
                'top': node.displayY+61
              });
          $('#graph-container').append($tooltip);
        }, [nodeId]);

        // Hide edges and nodes.
        sigInst.iterEdges(function(e) {
          if (nodes.indexOf(e.source) >= 0 || nodes.indexOf(e.target) >= 0) {
            neighbors[e.source] = true;
            neighbors[e.target] = true;
            isOrphan = false;
          }
        });

        if (isOrphan) {
          neighbors[nodes[0]] = true;
        }

        sigInst.iterNodes(function(n) {
          if (!neighbors[n.id]) {
            n.hidden = true;
          }
        });

        // draw graph.
        sigInst.draw();
      });

      // Hide node info and show the rest of nodes and edges.
      sigInst.bind('outnodes', function(event) {
        // Hide node info.
        $tooltip.remove();
        // Show nodes and edges.
        sigInst.iterEdges(function(e) {
          e.hidden = false;
        }).iterNodes(function(n) {
          n.hidden = false;
        }).draw();
      });

      // Bind pause.
      var running = true;
      $('#sigma-pause').on('click', function() {
        if (running === true) {
          running = false;
          sigInst.stopForceAtlas2();
        } else {
          running = true;
          sigInst.startForceAtlas2();
        }
      });

      // Activate the FishEye.
      // sigInst.activateFishEye().draw();

      // Start the ForceAtlas2 algorithm.
      sigInst.startForceAtlas2();
    }
  };

  // Reveal module.
  window.sylv.Sigma = Sigma;

})(sylv, sigma, jQuery, window, document);
