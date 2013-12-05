/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 7/31/13
 * Time: 4:31 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.search_resultspanel',
    bubbleEvents: ['Search:PageSizeChanged', "Search:SortByChanged"],
    requires: [
        'Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsPanelToolbar',
        'Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsPanelGrid',
        'Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsMap',
        'Savanna.controller.Factory'
    ],

    region: 'center',
    header: false,
    layout: 'fit',


    initComponent: function () {
        //Savanna.controller.Factory.getController('Savanna.search.controller.ResultsComponent');
        this.items = this.setupItems();
        this.callParent(arguments);
    },

    setupItems: function () {
        return [
            {
                xtype: 'search_resultspanelgrid',
                itemId: 'resultspanelgrid'
            },
            {
                xtype: 'search_resultsmap',
                itemId: 'resultsmap',
                hidden: true
            }
        ];
    },
    /*
     tried to give this a more intuitive name - it swaps the store assigned to our grid
     based on whichever DAL the user selects from the left-hand panel, pages to the current
     page, and re-binds the paging toolbar.
     */
    updateGridStore: function (obj) {
        var grid = this.queryById('resultspanelgrid');
        //only do the rebinding if the store actually changed
        if (!grid.store.valid || (obj.store.storeId !== grid.store.storeId)) {
            grid.reconfigure(obj.store);
            this.queryById('gridtoolbar').bindStore(obj.store);

            obj.store.loadPage(obj.store.currentPage);
        }
    },

    clearGridStore: function () {
        var grid = this.queryById('resultspanelgrid');
        //I tried using gridtoolbar.bindStore() to unbind the current store and reset the paging toolbar, but didn't work
        grid.store.removeAll();
        grid.store.totalCount = 0;
        this.queryById('gridtoolbar').onLoad();
        grid.store.valid = false;
    },

    dockedItems: [
        {
            xtype: 'search_resultspaneltoolbar',
            itemId: 'resultspaneltoolbar'
        }
    ]
});
