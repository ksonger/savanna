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
    searchLayer: null,
    resultsLayer: null,
    controls: null,

    initComponent: function() {


        this.map = new OpenLayers.Map({
            projection: new OpenLayers.Projection(SavannaConfig.mapDefaultBaseLayer.projection),
            controls: [
                new OpenLayers.Control.Navigation(),
                new OpenLayers.Control.PanZoomBar({
                    panIcons: false
                })
            ]
        });

        /*
        Geocache TMS (TMS2) layers require the resolution of the map to be overriden.
         */

        this.callParent(arguments);
    },

    beforeRender: function () {
        var baseLayer = SavannaConfig.mapDefaultBaseLayer;
        switch (baseLayer.type){
            case 'WMS':
                this.map.addLayer(new OpenLayers.Layer.WMS(baseLayer.layerLabel, baseLayer.url, {layers: baseLayer.layerName}));
                break;
            case 'XYZ':
                this.map.addLayer(new OpenLayers.Layer.XYZ(baseLayer.layerLabel, baseLayer.url, {layers: baseLayer.layerName}));
                break;
            case 'TMS':
                this.map.maxResolution = baseLayer.maxResolution;
                this.map.addLayer(new OpenLayers.Layer.TMS(baseLayer.layerName, baseLayer.url, {layername: baseLayer.layerName, type: baseLayer.imgType}));
                break;
            /*
             The case is for the GeoCache TMS layers
             */
            case 'TMS2':
                this.map.maxResolution = baseLayer.maxResolution ;
                this.map.addLayer(new OpenLayers.Layer.TMS(baseLayer.layerName, baseLayer.url, {layername: baseLayer.layerName, type: baseLayer.imgType, 'getURL': this.createGeoCacheUrl}));
                break;
        }

    },

    onRender: function () {
        this.callParent(arguments);
        this.map.render(this.getEl().dom);
        this.map.setCenter(new OpenLayers.LonLat.fromString(SavannaConfig.mapDefaultBaseLayer.center), SavannaConfig.mapDefaultBaseLayer.zoom);
    },

    createGeoCacheUrl: function (bounds) {
        bounds = this.adjustBounds(bounds);
        var res = this.getResolution();
        var x = Math.round((bounds.left - this.tileOrigin.lon) / (res * this.tileSize.w));
        var y = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h));
        var z = this.serverResolutions != null ?
            OpenLayers.Util.indexOf(this.serverResolutions, res) :
            this.getZoomForResolution(res) + this.zoomOffset;
        var path = this.serviceVersion + "/" + this.layername + "/" + z + "/" + x + "/" + y + "." + this.type;
        var url = this.url;
        if (OpenLayers.Util.isArray(url)) {
            url = this.selectUrl(path, url);
        }
        url = url + path + "";
        return url;
    }
});

