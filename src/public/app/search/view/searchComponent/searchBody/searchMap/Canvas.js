/**
 * Created with IntelliJ IDEA.
 * User: sseely
 * Date: 9/17/13
 * Time: 3:31 PM
 * To change this template use File | Settings | File Templates.
 */

Ext.define('Savanna.search.view.searchComponent.searchBody.searchMap.Canvas', {
    extend: 'Ext.Component',
    alias: 'widget.search_map_canvas',

    map: null,

    drawFeature: null,

    searchLayer: null,

    initComponent: function() {

        this.map = new OpenLayers.Map({
            controls: [
                new OpenLayers.Control.Navigation(),
                new OpenLayers.Control.PanZoomBar({
                    panIcons: false
                })
            ]
        });

        this.callParent(arguments);
    },

    onRender: function() {

        var element;

        this.callParent(arguments);

        element = Ext.DomHelper.insertHtml('afterBegin', this.getEl().dom, '<div class="map" style="width: 100%; height: 100%; position: absolute;"></div>');

        this.map.render(element);
        this.map.setCenter(new OpenLayers.LonLat.fromString(Savanna.Config.mapDefaultCenter), Savanna.Config.mapDefaultZoom);
    }
});

