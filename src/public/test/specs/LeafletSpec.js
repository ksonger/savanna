/* global Ext: false,
          describe: false, beforeEach: false, afterEach: false, it: false, expect: false, spyOn: false,
          Savanna: false, ThetusTestHelpers: false,
          L: false
 */
Ext.require('Savanna.search.view.searchComponent.SearchBody');

describe('Search Map', function() {

    beforeEach(function() {
        ThetusTestHelpers.ExtHelpers.createTestDom();
    });

    afterEach(function() {
        ThetusTestHelpers.ExtHelpers.cleanTestDom();
    });

    describe('Savanna.search.view.searchComponent.searchBody.SearchMap', function() {

        describe('constructor', function() {

            it('should be able to create a search map', function() {
                var map = Ext.create('Savanna.search.view.searchComponent.searchBody.SearchMap',  { renderTo: ThetusTestHelpers.ExtHelpers.TEST_HTML_DOM_ID });

                expect(map instanceof Savanna.search.view.searchComponent.searchBody.SearchMap).toBeTruthy();

            });

        });
    });
    describe('Savanna.leaflet.Leafletmap', function() {
        var map;
        var myPanel;
        var southWest = new L.LatLng(40.712, -74.227),
            northEast = new L.LatLng(40.774, -74.125),
            bounds = new L.LatLngBounds(southWest, northEast);
        var layer = L.rectangle(bounds);

        beforeEach(function() {
            myPanel = Ext.create('Ext.panel.Panel', {
                layout: 'fit',
                renderTo: ThetusTestHelpers.ExtHelpers.TEST_HTML_DOM_ID
            });
            map = Ext.create('Savanna.leaflet.Leafletmap');
            spyOn(map, 'afterRender').andCallThrough();
            spyOn(map, 'addDrawControl').andCallThrough();
        });

        afterEach(function() {
            myPanel = null;
            map = null;
        });

        it('afterRender should call afterRender and addDrawControl', function() {
            myPanel.add(map);
            expect(map.afterRender).toHaveBeenCalled();
            expect(map.addDrawControl).toHaveBeenCalled();
            expect(map.myMap).toBeTruthy();
        });

        describe('mapZoomToMenu', function() {
            var myButton = null;

            beforeEach(function() {
                myButton = Ext.create(Ext.Button, {
                    text: 'click me',
                    renderTo: ThetusTestHelpers.ExtHelpers.TEST_HTML_DOM_ID,
                    menu:  [{
                        text: 'Cancel'
                    }]
                });
            });

            afterEach(function() {
                myButton = null;
            });

            it('should have 2 items if hasCurrentDrawing is false', function() {
                map.hasCurrentDrawing = false;
                map.mapZoomToMenu(myButton);
                expect(myButton.menu.items.length).toBe(2);
            });

            it('should have 3 items if hasCurrentDrawing is true', function() {
                map.hasCurrentDrawing = true;
                map.mapZoomToMenu(myButton);
                expect(myButton.menu.items.length).toBe(3);
            });

            it('should go back to having 2 items after having 3 items when hasCurrentDrawing is set back to false', function() {
                map.hasCurrentDrawing = false;
                map.mapZoomToMenu(myButton);
                expect(myButton.menu.items.length).toBe(2);
            });
        });

        describe('events:', function() {
            var e = {};

            beforeEach(function() {
                e.layer = layer;
                e.type = 'polyline';
                e.stopPropagation = function(){};

                myPanel.add(map);

                spyOn(map, 'fireEvent').andCallThrough();
                spyOn(map.editableLayers, 'addLayer').andCallThrough();
                spyOn(map.editableLayers, 'removeLayer').andCallThrough();
            });

            afterEach(function() {
                e = null;
            });

            // events need to be run one after another to follow state correctly
            it('should call the right functions', function() {
                expect(map.clickOnToolbar(e)).toBeTruthy();

                map.drawingAddedToMap(e);

                expect(map.fireEvent).toHaveBeenCalled();
                expect(map.editableLayers.addLayer).toHaveBeenCalled();
                expect(map.clickOnToolbar(e)).toBeFalsy();

                //clickOnLayer turns on editMode
                expect(map.editMode).toBeFalsy();

                map.clickOnLayer();

                expect(map.editMode._enabled).toBeTruthy();

                //clicking on map should turn off edit mode
                map.clickOnMap();

                expect(map.editMode._enabled).toBeFalsy();

                // turn edit mode back on
                map.clickOnLayer();

                expect(map.editMode._enabled).toBeTruthy();

                //when map loses focus turn off edit mode
                map.mapLostFocus();

                expect(map.editMode._enabled).toBeFalsy();

                // delete key in editmode should removeLayer
                map.clickOnLayer();

                expect(map.editMode._enabled).toBeTruthy();

                var evt = {keyCode: 46};

                map.keyPressedOnMap(evt);

                expect(map.editableLayers.removeLayer).toHaveBeenCalled();
                expect(map.editMode._enabled).toBeFalsy();

                // deleteDrawing should removeLayer
                map.clickOnLayer();

                expect(map.editMode._enabled).toBeTruthy();

                map.deleteDrawing();

                expect(map.editableLayers.removeLayer.callCount).toBe(2);
                expect(map.editMode._enabled).toBeFalsy();

                // drawingContextMenu should create a context menu
                var event = {
                    originalEvent: {
                        clientX: 10,
                        clientY: 10
                    }
                };

                map.drawingContextMenu(event);

                var myMenu = myPanel.query('#leafletContextMenu');

                expect(myMenu).toBeTruthy();

                map.myContextMenu.hide();
            });
        });

        describe('afterRender', function() {

            it('with no leaflet reference should call update', function() {
                delete window.L;

                spyOn(map, 'update').andCallThrough();

                myPanel.add(map);

                expect(map.update).toHaveBeenCalledWith('No leaflet library loaded');
            });
        });
    });
});

