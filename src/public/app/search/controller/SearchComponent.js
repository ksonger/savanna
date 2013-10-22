/* global Ext: false, OpenLayers: false, SavannaConfig: false */
/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 7/17/13
 * Time: 11:09 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.controller.SearchComponent', {
    extend: 'Ext.app.Controller',

    requires: [
        'Savanna.search.model.SearchRequest',
        'Savanna.search.store.SearchResults',
        'Savanna.search.view.searchComponent.searchBody.searchMap.SearchLocationComboBox',
        'Savanna.controller.Factory',
        'Savanna.metadata.store.Metadata',
        'Savanna.search.model.ResultMetadata',
        'Savanna.search.store.ResultsMetadata'
    ],
    stores: [
        'Savanna.search.store.DalSources'
    ],

    views: [
        'Savanna.search.view.SearchComponent'
    ],

    init: function () {
        var me = this;
        this.control({
            'search_searchcomponent': {
                render: this.onSearchRender
            },
            'search_searchcomponent #search_reset_button': {
                click: this.handleNewSearch
            },
            'search_searchcomponent #searchadvanced_btn': {
                click: this.showHideMenu
            },
            'search_searchcomponent #search_terms': {
                keyup: this.handleSearchTermKeyUp,
                'onsearchclick': this.handleSearchSubmit,
                'onclearclick' : this.clearSearch
            },
            'search_searchcomponent #searchadvanced_menu textfield': {
                keyup: this.handleSearchTermKeyUp
            },
            'search_searchcomponent #search_submit': {
                click: this.handleSearchSubmit
            },
            'search_searchcomponent #search_clear': {
                click: this.clearSearch
            },
            'search_searchcomponent #advancedsearch_submit': {
                click: this.handleSearchSubmit
            },
            'search_searchcomponent #searchadvanced_menu': {
                render: function (menu) {
                    menu.queryById('close_panel').on('click', this.handleClose);
                    menu.queryById('advancedsearch_submit').on('click', me.handleSearchSubmit, me);
                }
            },
            'search_searchcomponent #optionsbutton': {
                click: this.onBodyToolbarClick
            },
            'search_searchcomponent #resultsbutton': {
                click: this.onBodyToolbarClick
            },
            'search_searchcomponent #searchMapCanvas': {
                beforerender: this.loadDefaultLayer,
                afterrender: this.loadVectorLayer,
                resize: this.onMapCanvasResize
            },
            'search_searchcomponent #drawLocationSearch': {
                click: this.activateDrawFeature
            },
            'search_searchcomponent #clearLocationSearch': {
                click: this.clearDrawFeature
            },
            'search_searchcomponent #mapZoomToMenu': {
                click: this.enableZoomMenu
            },
            'search_searchcomponent #mapZoomToMenu menu': {
                click: this.zoomToSearchExtent
            },
            'search_searchmap': {
                resize: this.onSearchMapResize
            },
            'search_searchmap search_searchlocationcombobox': {
                zoomButtonClick: this.zoomToLocation
            }
        });

        this.getApplication().on('results:dalreset', this.doSearch, this);

        this.getApplication().on('results:refineSearch', this.doSearch, this);

        this.getApplication().on('results:buildAndLoadResultsStore', this.buildAndLoadResultsStore, this);
    },

    // CUSTOM METHODS

    /*
     with search now appearing within a window component, the advanced search terms menu
     no longer works correctly as a menu. Converted it to a panel (which is a good thing), but
     moving the window around with the menu open causes misalignment issues with the menu.  These event
     listeners on the parent window seem to sort it out.
     */

    onSearchRender: function (search) {
        if (search.up('desktop_searchwindow')) {
            var advanced_menu = search.down('#searchadvanced_menu');

            search.up('desktop_searchwindow').header.getEl().on('mousedown', function () {
                advanced_menu.wasOpen = advanced_menu.isVisible();
                advanced_menu.hide();
            });

            search.up('desktop_searchwindow').on('move', function (win) {
                if (advanced_menu.wasOpen) {
                    advanced_menu.showBy(win.down('#search_form'));
                }
            });
        }
        /*
        hide Start New Search button
         */
        search.down('#search_reset_button').setVisible(false);
    },

    handleNewSearch: function (elem) {
        var component = this.getSearchComponent(elem);

        if (component.down('search_resultsDals_resultsterms')) {   // doesn't exist if results page has not yet been created

            component.down('search_resultsDals_resultsterms').queryById('termValues').removeAll();  // remove refine terms in results screen
        }

        var form = component.down('#search_form'),
            searchBar = component.down('#searchbar');


        searchBar.queryById('search_terms').setValue('');

        var formField = form.queryById('searchadvanced_menu').queryById('form_container');

        Ext.Array.each(formField.query('searchadvanced_textfield'), function (field) {
            if (field.xtype === 'searchadvanced_textfield') {
                field.setValue('');
            }
        });

        var sources = this.getSelectedDals(this.getSearchComponent(elem)),
            dals = component.down('#searchdals');

        Ext.each(sources, function (source) {
            /*
             clear facet filters, if any
             */
            if (source.get('facetFilterCriteria').length) {
                source.set('facetFilterCriteria', []);
            }

            /*
             clear date ranges, if any
             */
            if (source.get('dateTimeRanges').length) {
                source.set('dateTimeRanges', []);
            }

            if (dals.queryById(source.get('id')).query('checkbox')[0].getValue()) {
                dals.queryById(source.get('id')).query('checkbox')[0].setValue(false);
            }
        });

        dals.queryById(dals.store.defaultId).query('checkbox')[0].setValue(true);

        this.resetCustomSearchOptions(component);

        component.down('#resultsdals').removeAll();


        /*
         return to the options screen if we're not already there
         */

        if (component.down('#searchbody').currentPanel !== 'searchoptions') {
            var optionsBtn = component.queryById('optionsbutton');
            optionsBtn.fireEvent('click', optionsBtn);
        }

        /*
         clear the grid - it's misleading in error states to see results in the grid, even though
         the search request has failed for one reason or another
         */
        component.down('#resultspanel').updateGridStore({store: Ext.create('Savanna.search.store.SearchResults')});

        /*
         hide Start New Search button
         */
        component.down('#search_reset_button').setVisible(false);
    },

    clearSearch: function (elem) {
        var form = elem.findParentByType('search_searchcomponent').down('#searchbar');

        var formField = form.queryById('searchadvanced_menu').queryById('form_container');

        Ext.Array.each(formField.query('searchadvanced_textfield'), function (field) {
            if (field.xtype === 'searchadvanced_textfield') {
                field.setValue('');
            }
        });

    },

    resetCustomSearchOptions:function(component) {
        var dalsView = component.down('search_searchdals');
        dalsView.createDalPanels(dalsView);
        dalsView.down('#selectAllDals').setText('Select All');
    },

    handleSearchSubmit: function (btn) {
        this.doSearch(btn);
    },

    handleSearchTermKeyUp: function (field, evt) {
        if (evt.keyCode === Ext.EventObject.ENTER) {
            this.doSearch(field);
        }
    },

    handleClose: function (btn) {
        btn.up('#searchadvanced_menu').hide();
    },

    hideMenu: function (elem) {
        elem.down('#searchadvanced_menu').hide();
    },

    showHideMenu: function (btn) {
        var adv_menu = btn.findParentByType('search_searchcomponent').down('#searchadvanced_menu');

        if (adv_menu.isVisible()) {
            adv_menu.hide();
        } else {
            adv_menu.showBy(btn.up('#search_form'));
        }
    },

    onBodyToolbarClick: function (button) {
        var component = button.findParentByType('search_searchcomponent'),
            body = component.queryById('searchbody'),
            options = body.queryById('mainsearchoptions'),
            results = body.queryById('searchresults'),
            options_button = component.queryById('optionsbutton'),
            results_button = component.queryById('resultsbutton');

        if (body.currentPanel !== 'searchoptions' && button === options_button) {
            options.show();
            results.hide();
            body.currentPanel = 'searchoptions';
        }

        if (body.currentPanel !== 'results' && button === results_button) {
            options.hide();
            results.show();
            body.currentPanel = 'results';
        }
    },


    /*
     used in a few places, moving this out of doSearch
     */
    getSearchComponent: function (elem) {
        return elem.findParentByType('search_searchcomponent');
    },

    /*
     used in a few places, moving this out of doSearch
     */
    getSelectedDals: function (component) {

        var sources = [],
            dalSelected = false,
            dals = component.down('#searchdals');

        dals.store.each(function (source) {

            if (dals.queryById(source.get('id')).query('checkbox')[0].getValue()) {
                dalSelected = true;
                sources.push(source);
            }
        });

        if (!dalSelected) {
            dals.queryById(dals.store.defaultId).query('checkbox')[0].setValue(true);
            sources.push(dals.store.getById(dals.store.defaultId));
        }

        return sources;
    },

    buildSearchObject: function (searchString, dal, currentDalPanel, mapView) {
        var searchObj = Ext.create('Savanna.search.model.SearchRequest', {
            'textInputString': searchString,
            'displayLabel': searchString
        });

        if ((typeof mapView != 'undefined') && mapView &&  mapView.searchLayer) {
            if (mapView.searchLayer.features.length > 0){
                var polyVo = {};
                var polyRings = [];
                var vertices = mapView.searchLayer.features[0].geometry.getVertices();
                for (var i = 0; i < vertices.length; i++) {
                    var point = [vertices[i].x, vertices[i].y];
                    polyRings.push(point);
                }
                polyVo.coordinates = [polyRings];
                polyVo.type = 'Polygon';
                searchObj.set('polygonVo', polyVo);
            }
        }

        searchObj.set('contentDataSource', dal.get('id'));

        searchObj.set('searchPreferencesVOs', [
            {
                'dalId': dal.get('id'),
                'sortOrder': 'Default',
                'customSearchSelections': this.getCustomSearchSelections(currentDalPanel)
            }
        ]);

        /*
         build the 'desiredFacets' array for the request, by iterating over
         facetValueSummaries in the DAL sources json
         */
        var desiredFacets = [];

        Ext.each(dal.get('facetDescriptions'), function (description) {
            desiredFacets.push(description.facetId);
        });

        searchObj.set('desiredFacets', desiredFacets);


        /*
         set the facet filters, if any
         */
        if (dal.get('facetFilterCriteria').length) {
            searchObj.set('facetFilterCriteria', dal.get('facetFilterCriteria'));
        }

        /*
         set the date ranges, if any
         */
        if (dal.get('dateTimeRanges').length) {
            searchObj.set('dateTimeRanges', dal.get('dateTimeRanges'));
        }

        return searchObj;
    },

    buildAndLoadResultsStore:function(dal, component, searchObj, action, pageSize) {

        //supposedly the best way to check for undefined
        //Page size is undefined when view is first opened.
        if( typeof pageSize == 'undefined')     {
            pageSize = dal.get('resultsPerPage');
        }

        var resultsStore = Ext.create('Savanna.search.store.SearchResults', {
            storeId: 'searchResults_' + dal.get('id'),
            pageSize: pageSize
        });

        var resultsDal = component.down('#resultsdals'),
            resultsPanel = component.down('#resultspanel');

        resultsStore.proxy.jsonData = Ext.JSON.encode(searchObj.data);  // attach the search request object
        resultsStore.load({
            callback: Ext.bind(this.searchCallback, this, [resultsDal, resultsPanel, dal.get('id'), resultsStore, action], true)
        });

        resultsDal.updateDalStatus(dal.get('id'), 'pending');   // begin in a pending state
    },

    doSearch: function (elem) {

        var component = this.getSearchComponent(elem),
            sources = this.getSelectedDals(component);

        this.hideMenu(component);

        var searchString = component.queryById('searchbar').buildSearchString(),
            resultsComponent = component.queryById('searchresults');

        var mapView = component.down('#searchMapCanvas');

        /*
         this is an array of objects - they store the dal id and the store instance for that dal's results.
         For each selected DAL, a new store is generated and this array is used to keep track
         */
        resultsComponent.allResultSets = [];


        /*
         Create the search request payload
         */

        var dals = component.down('#searchdals'),
            resultsDal = component.down('#resultsdals'),
            searchObj;

        resultsDal.createDalPanels(sources);

        /*
         Check for selected additional Dals, and do a search on each of them
         */
        Ext.each(sources, function (source) {

            var dalId = source.get('id'),
                currentDalPanel = dals.queryById(dalId),
                checked = dals.queryById(dalId).query('checkbox')[0].getValue();    // has this checkbox been selected in search options?

            if (checked) {  // checked, or always search the default dal

                searchObj = this.buildSearchObject(searchString, source, currentDalPanel, mapView);

                this.buildAndLoadResultsStore(source, component, searchObj, 'search');
            }

        }, this);


        /*
         clear the grid - it's misleading in error states to see results in the grid, even though
         the search request has failed for one reason or another
         */
        component.down('#resultspanel').updateGridStore({store: Ext.create('Savanna.search.store.SearchResults')});

        /*
         show Start New Search button
         */
        component.down('#search_reset_button').setVisible(true);


        this.showResultsPage(component);
    },

    getCustomSearchSelections: function (currentDalPanel) {

        var customSearchOptions = [],
            customInputs = currentDalPanel.query('[cls=customInputField]');

        Ext.each(customInputs, function (input) {
            var customSearchInput = {},
                type = input.xtype;

            customSearchInput.key = input.name;
            customSearchInput.value = input.value;

            switch (type) {
                case 'datefield':
                    customSearchInput.value = input.value.valueOf();
                    break;
                case 'radiogroup':
                    if (input.defaultType === 'radiofield') {
                        customSearchInput.value = input.getValue().options;
                    }
                    break;
                case 'fieldcontainer':
                    customSearchInput.key = input.down('combobox').value;
                    customSearchInput.value = input.down('[name=keyValueText]').value;
                    break;
            }

            if (customSearchInput.value === undefined || customSearchInput.value === null) {
                customSearchInput.value = '';
            }
            customSearchOptions.push(customSearchInput);
        });

        return customSearchOptions;
    },

    searchCallback: function (records, operation, success, resultsDal, resultsPanel, dalId, store, action) {

        if (!success) {
            // server down..?
            Ext.Error.raise({
                msg: 'The server could not complete the search request - the DAL "' + dalId + '" may be unavailable.'
            });
        } else {

            var resultsObj = {id: dalId, store: store, metadata: []};

            /*
             array of uri's to get the metadata for these results
             */

            var metadataArray = [];

            Ext.each(records, function (record) {
                metadataArray.push(record.data.uri);
            });


            if (action === 'search') {
                /*
                 add an object tying the dal and store together for referencing
                 */
                resultsPanel.up('#searchresults').allResultSets.push(resultsObj);

                if (store.facetValueSummaries !== null) {
                    resultsDal.createDalFacets(dalId);
                }

            } else {
                /*
                 filtering, action set to 'filter'
                 */
                Ext.each(resultsPanel.up('#searchresults').allResultSets, function (resultset, index) {
                    if (resultset.id === dalId) {
                        resultsPanel.up('#searchresults').allResultSets[index] = resultsObj;
                    }
                });
            }

            var statusString = success ? 'success' : 'fail';
            resultsDal.updateDalStatus(dalId, statusString);


            var searchResultsView = resultsPanel.up('#searchresults');
            if (action === 'search') {
                if (dalId === Ext.data.StoreManager.lookup('dalSources').defaultId) {

                    searchResultsView.fireEvent('search:changeSelectedStore', resultsDal.queryById(dalId));
                }
            } else {
                /*
                 filtering, action set to 'filter'
                 */
                searchResultsView.fireEvent('search:changeSelectedStore',  resultsDal.queryById(dalId));
            }
        }
    },

    showResultsPage: function (component) {
        var resultsBtn = component.down('#resultsbutton');

        resultsBtn.fireEvent('click', resultsBtn);
    },

    loadDefaultLayer: function (canvas) {
        canvas.map.addLayer(new OpenLayers.Layer.WMS(SavannaConfig.mapBaseLayerLabel,
            SavannaConfig.mapBaseLayerUrl, {layers: SavannaConfig.mapBaseLayerName}));
    },

    loadVectorLayer: function (canvas) {
        // Add a feature layer to the map.
        var searchLayer = new OpenLayers.Layer.Vector('searchLayer');
        searchLayer.events.register('featureadded', canvas, this.onFeatureAdded);
        searchLayer.events.register('featureremoved', canvas, this.onFeatureRemoved);
        canvas.searchLayer = searchLayer;
        canvas.map.addLayer(searchLayer);

        // Add the draw feature control to the map.
        var drawFeature = new OpenLayers.Control.DrawFeature(searchLayer, OpenLayers.Handler.Polygon, {
            id: 'PolygonDrawTool'
        });

        drawFeature.handler.callbacks.point = this.pointCallback;
        canvas.map.addControl(drawFeature);
        canvas.drawFeature = drawFeature;
    },

    onFeatureAdded: function (event) {
        // Scope: drawFeature
        this.drawFeature.deactivate();
        this.fireEvent('searchPolygonAdded', this);
    },

    onFeatureRemoved: function (event) {
        this.fireEvent('searchPolygonRemoved', this);
    },

    onMapCanvasResize: function (canvas) {
        canvas.map.updateSize();
    },

    pointCallback: function () {
        // Scope: drawFeature
        // Called each time a point is added to the feature.
        if (this.layer.features.length > 0) {
            this.layer.removeAllFeatures();
        }
    },

    activateDrawFeature: function (button) {
        var canvas = button.up('search_searchmap').down('search_map_canvas');
        canvas.drawFeature.activate();
    },

    clearDrawFeature: function (button) {
        var canvas = button.up('search_searchmap').down('search_map_canvas');
        canvas.searchLayer.removeAllFeatures();
        canvas.drawFeature.deactivate();
    },
    zoomToLocation: function (comboBoxButton) {
        var viewBox = comboBoxButton.viewBox;
        var mapCanvas = comboBoxButton.parentComboBox.up('search_searchmap').down('search_map_canvas');
        var extent = new OpenLayers.Bounds(viewBox.west, viewBox.south, viewBox.east, viewBox.north);
        mapCanvas.map.zoomToExtent(extent, true);
        console.log(mapCanvas.map.maxExtent);
    },

    enableZoomMenu: function (button) {
        var mapCanvas = button.up('search_searchmap').down('search_map_canvas');
        var menuButton = button.up('search_searchmap').down('#zoomToSelectedArea');
        //check if search layer is populated
        //if search layer has a feature enable zoom to selected area
        if (mapCanvas.searchLayer.features.length > 0) {
            menuButton.setDisabled(false);
        }
        else {
            menuButton.setDisabled(true);
        }
    },

    zoomToSearchExtent: function (menu) {
        var mapCanvas = menu.up('search_searchmap').down('search_map_canvas');
        if (menu.activeItem) {
            switch (menu.activeItem.itemId) {
                case 'zoomToWholeWorld':
                    mapCanvas.map.zoomToMaxExtent();
                    break;
                case 'zoomToSelectedArea':
                    mapCanvas.map.zoomToExtent(mapCanvas.searchLayer.getDataExtent());
                    break;
            }
        }
    },

    onSearchMapResize: function (searchMap) {
        //position the draw select area button
        var canvasSize = searchMap.body.getSize();
        var polyButton = searchMap.down('#drawLocationSearch');
        polyButton.setPosition(canvasSize.width - 50, 10);
    },

    mapGetSearchResults: function (results, resultsDal) {
        resultsDal.fireEvent('mapNewSearchResults', results, resultsDal);
    }
});