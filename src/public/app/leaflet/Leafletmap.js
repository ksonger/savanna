Ext.define('Savanna.leaflet.Leafletmap', {
    extend: 'Ext.Component',
    alias: 'widget.leafletmap',

    myMap: null, // keep current map accessible for all methods
    editMode: null,
    editableLayers: null,
    drawControl: null,
    myLayer: null,
    myContextMenu: null,
    keydownEvent: null,
    toolBarElement: null,
    toolbarDomElement: null,
    hasCurrentDrawing: false,
    toolbarEnableClass: 'leaflet-draw-toolbar-enabled',
    config:{
        map: null,
        lat: 45.5236,
        lng: -122.6750
    },

    afterRender: function(t, eOpts){
        this.callParent(arguments);
        var leafletRef = window.L;
        if (leafletRef == null){
            this.update('No leaflet library loaded');
        } else {
            this.myMap = L.map(this.getId(), {
                zoomControl: false, // turns off default +- control from zoom
                doubleClickZoom: false
            });
            this.myMap.setView([this.lat, this.lng], 2);
            this.setMap(this.myMap);
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}).addTo(this.myMap);
            this.addDrawControl();
        }
    },

    addDrawControl: function(){
        this.editableLayers = new L.FeatureGroup();
        this.myMap.addLayer(this.editableLayers);
        var options = {
            position: 'topright',
            draw: {
                polyline: false,
                circle: true,
                marker: false,
                rectangle: true,
                polygon: {
                    zIndexOffset: 100000,
                    allowIntersection: false, // Restricts shapes to simple polygons
                    drawError: {
                        message: '' +
                            'Polygon Lines May Not Intersect' // Message that will show when intersect
                    },
                    shapeOptions: {
                        color: '#0073ae',
                        weight: 2
                    }
                }
            }
        };

        this.drawControl = new L.Control.Draw(options);
        this.myMap.addControl(this.drawControl);

        this.myMap.on('draw:created', this.drawingAddedToMap, this);
        this.myMap.on('click', this.clickOnMap, this);
        this.myMap.on('blur', this.mapLostFocus, this);
        this.myMap.on('focus', this.mapGotFocus, this);

        this.editableLayers.on('click', this.clickOnLayer, this);
        this.editableLayers.on('contextmenu', this.drawingContextMenu, this);
        this.keydownEvent = Ext.bind(this.keyPressedOnMap, this);
        this.getEl().dom.addEventListener('keydown', this.keydownEvent);

        this.toolbarDomElement = Ext.dom.Query.select('.leaflet-draw-toolbar');
        this.toolBarElement = Ext.get(this.toolbarDomElement[0]);
        this.toolBarElement.addCls(this.toolbarEnableClass);

        this.clickToolbar = Ext.bind(this.clickOnToolbar, this);
        Ext.getDom(this.toolBarElement).addEventListener('click', this.clickToolbar, true);
        this.on('locationSearch:clear', this.deleteDrawing, this);
        this.on('locationSearch:zoomto', this.mapZoomToMenu, this)
    },

    mapZoomToMenu: function(button) {
        var self = this;

        var zoomMenu = button.menu;
        zoomMenu.remove('selectedAreaMenuItem');
        switch(button.menu.items.length) {

            case 1:
                zoomMenu.insert(0,{
                    text: 'Whole World',
                    handler: function() {self.myMap.fitWorld();},
                    scope: this
                });
                //intentional fall through
            case 2:

                if (this.hasCurrentDrawing){
                    zoomMenu.insert(1, {
                        text: 'Selected Area',
                        itemId: 'selectedAreaMenuItem',
                        handler: function() {self.myMap.fitBounds(self.myLayer.getBounds());},
                        scope: this
                    });
                }
        }
        zoomMenu.show();
    },

    clickOnToolbar: function(e) {
        if (!this.toolBarElement.hasCls(this.toolbarEnableClass)){
            e.stopPropagation();
            return false;
        }
        return true;
    },

    keyPressedOnMap: function(e) {
        if (e.keyCode === 46 && this.editMode && this.editMode._enabled){  // delete key press in edit mode
            this.editMode.save();
            this.deleteDrawing();
        }
    },

    drawingContextMenu: function(e) {
        this.myContextMenu = Ext.create('Ext.menu.Menu', {

            itemId:'leafletContextMenu',
            items:[{
                text: 'Delete',
                handler: this.deleteDrawing,
                scope: this
            },{
                text: 'Cancel'
            }]
        });
        this.myContextMenu.showAt(e.originalEvent.clientX, e.originalEvent.clientY);
    },

    deleteDrawing: function() {
        this.editableLayers.removeLayer(this.myLayer);
        if (this.editMode && this.editMode._enabled) {
            this.editMode.disable();
        }
        this.toolBarElement.addCls(this.toolbarEnableClass);
        this.hasCurrentDrawing = false;
    },

    drawingAddedToMap: function(e) {
        this.myLayer = e.layer;
        this.fireEvent('draw:created', e); //update with new points
        this.editableLayers.addLayer(this.myLayer);
        this.toolBarElement.removeCls(this.toolbarEnableClass);
        this.hasCurrentDrawing = true;
    },

    mapGotFocus: function() {
        this.getEl().dom.addEventListener('keydown', this.keydownEvent);
    },

    mapLostFocus: function() {
        if (this.editMode) {
            this.editMode.save();
            this.editMode.disable();
        }
        this.getEl().dom.removeEventListener('keydown', this.keydownEvent, false)
    },

    clickOnLayer: function() {
        this.editMode = new L.EditToolbar.Edit(this.myMap,{
            featureGroup: this.editableLayers,
            selectedPathOptions: this.drawControl.options.edit.selectedPathOptions
        });
        this.editMode.enable();
    },

    clickOnMap: function() {
        if (this.editMode && this.editMode._enabled) {
            this.editMode.save();
            this.editMode.disable();
        }
        if (this.myContextMenu) {
            this.myContextMenu.hide();
        }
    },

    onResize: function(w, h, oW, oH){
        this.callParent(arguments);
        var map = this.getMap();
        if (map){
            map.invalidateSize();
        }
    }
});