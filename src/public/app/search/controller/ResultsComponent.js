/* global Ext: false, OpenLayers: false, SavannaConfig: false, EventHub: false */

/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 7/17/13
 * Time: 11:09 AM
 * To change this template use File | Settings | File Templates.
 */

Ext.define('Savanna.search.controller.ResultsComponent', {
    extend: 'Deft.mvc.ViewController',

    views: [
        'Savanna.search.view.searchComponent.searchBody.ResultsComponent'
    ],
    requires: [
        'Savanna.controller.Factory'
    ],

    control:    {

        resultsFacetsReset: {
            live: true,
            listeners:  {
                click: 'onDalReset'
            }
        },

        'resultspanel > button': {
            live: true,
            listeners:  {
                click: 'changeResultView'
            }

        },

        gridtoolbar: {
            change: 'gridStoreLoad'
        },

        openDocButton: {
            click: 'mapOpenDocument'
        },

        search_resultscomponent: {
            live:true,
            listeners:  {
                clearPopUpOnNewSearch: 'hidePopUp'
            }

        }

    },

    init: function () {

        this.getView().on('search:PageSizeChanged', this.onPageSizeChange, this);
        this.getView().on('search:SortByChanged', this.onSortOrderChange, this);
        this.getView().on('search:changeSelectedStore', this.changeSelectedStore, this);
        this.getView().on('boxready', this.loadVectorLayer, this)

    },

    //The grid with the results.
    resultsGrid: null,

    //Results store
    resultsStore: null,

    getResultsComponent: function () {
        return this.component;
    },

    getCurrentDalId: function () {
        return this.getResultsComponent().currentResultSet.id;
    },

    onDalReset: function (btn) {
        var id = this.getCurrentDalId();
        var dalRecord = Ext.data.StoreManager.lookup('dalSources').getById(id),
            resultsDals = btn.up('#resultsdals'),
            resultsTerms = resultsDals.down('search_resultsDals_resultsterms');

        dalRecord.set('facetFilterCriteria', []);
        dalRecord.set('dateTimeRanges', []);
        resultsDals.queryById('resultsfacets').removeAll();
        resultsDals.createFacetsTabPanel();

        resultsTerms.removeAll();

        this.getApplication().fireEvent('results:dalreset', btn);
    },

    onSortOrderChange: function () {
        /*
         this is a placeholder at the moment - not sure what the available sort options
         will be, and only 'relevance' appears in the comps and flex client version.
         */
    },

    onPageSizeChange: function (newSize) {

        var id = this.getCurrentDalId();
        var dalRecord = Ext.data.StoreManager.lookup('dalSources').getById(id);
        /*
         regrettable but necessary call to the SearchController directly.  The target method
         'buildSearchObject' needs to return the request object, but when an event is fired it can
         only return a boolean.  If anyone thinks of a way around it, please feel free to update.
         */
        var searchController = Savanna.controller.Factory.getController('Savanna.search.controller.SearchComponent'),
            searchComponent = this.getResultsComponent().findParentByType('search_searchcomponent'),
            currentDalPanel = searchComponent.down('#searchdals').queryById(id),
            searchString = searchComponent.queryById('searchbar').buildSearchString(),
            searchObj = searchController.buildSearchObject(searchString, dalRecord, currentDalPanel, mapView);

        dalRecord.set('resultsPerPage', newSize);

        this.getApplication().fireEvent('results:buildAndLoadResultsStore', dalRecord, searchComponent, searchObj, 'filter', newSize);

    },

    /*
     swaps the store assigned to our grid based on whichever DAL the
     user selects from the left-hand panel, and triggers an update
     of the facets for the newly selected store.
     */
    changeSelectedStore: function (dal) {

        var component = dal.findParentByType('search_resultscomponent');

        Ext.each(component.allResultSets, function (resultSet) {
            if (resultSet.id === dal.itemId) {

                component.queryById('resultspanel').updateGridStore(resultSet);

                component.currentResultSet = resultSet;

                dal.up('#resultsdals').queryById('resultsfacets').setActiveTab('tab_' + dal.itemId);

                var pageValue = Ext.data.StoreManager.lookup('dalSources').getById(resultSet.id).get('resultsPerPage');

                component.down('#resultsPageSizeCombobox').setValue(pageValue);
            }
        });

    },

    changeResultView: function (button) {
        var mapPanel = button.up('search_resultscomponent').down('#resultsmap');
        var resultsGridPanel = button.up('search_resultscomponent').down('#resultspanelgrid');
        switch (button.itemId) {
            case 'results_mapViewButton':
                resultsGridPanel.hide();
                mapPanel.show();
                break;
            case 'results_listViewButton':
                mapPanel.hide();
                resultsGridPanel.show();
                break;
        }
    },

    parseDate: function (v) {
        return Ext.Date.format(new Date(v), 'F d, Y');
    },

    gridStoreLoad: function (grid) {
        //var me = Savanna.controller.Factory.getController('Savanna.search.controller.ResultsComponent');
        var event = null;
        this.hidePopUp(event, grid);
        this.loadPointsFromStore(grid);
    }
});