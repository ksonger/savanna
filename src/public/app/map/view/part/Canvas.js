Ext.define('Savanna.map.view.part.Canvas', {
    extend: 'Ext.Component',
    alias: 'widget.map_canvas',

    center: '0,0',

    zoom: 2,

    map: null,

    initComponent: function() {

        this.map = new OpenLayers.Map();
        this.map.addControl(new OpenLayers.Control.LayerSwitcher());

        this.callParent(arguments);

        Savanna.controller.Factory.getController('Savanna.map.controller.MapController');
    },

    onRender: function() {

        var element;

        this.callParent(arguments);

        element = Ext.DomHelper.insertHtml('afterBegin', this.getEl().dom, '<div class="map" style="width: 100%; height: 100%; position: absolute;"></div>');

        this.map.addLayers(this.layers);
        this.map.render(element);
        this.map.setCenter(new OpenLayers.LonLat.fromString(this.center), this.zoom);
    },

    onResize: function() {
        this.map.updateSize();
    }
});