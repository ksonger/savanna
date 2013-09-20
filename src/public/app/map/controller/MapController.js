Ext.define('Savanna.map.controller.MapController', {
    extend: 'Ext.app.Controller',

    views: [
        'Savanna.map.view.MapComponent',
        'Savanna.map.view.part.Canvas'
    ],

    init: function() {
        this.control({
            'map_canvas': {
                beforerender: this.loadDefaultLayer
            }
        });
    },

    loadDefaultLayer: function(canvasView) {
        var layers = [];
        layers.push(new OpenLayers.Layer.OSM());
        canvasView.layers = layers;
    }
});