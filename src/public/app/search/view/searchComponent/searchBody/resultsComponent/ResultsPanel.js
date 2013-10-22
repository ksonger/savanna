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
    layout:'fit',


    initComponent: function () {
        Savanna.controller.Factory.getController('Savanna.search.controller.ResultsComponent');
        this.items = this.setupItems();
        this.callParent(arguments);
    },

    setupItems: function () {
        return [
            {
                xtype: 'search_resultspanelgrid',
                itemId: 'resultspanelgrid',
                dockedItems:[
                    {
                        xtype: 'pagingtoolbar',
                        itemId: 'gridtoolbar',
                        dock: 'top',
                        displayInfo: true
                    }
                ]
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
        grid.reconfigure(obj.store);
        grid.queryById('gridtoolbar').bindStore(obj.store);

        obj.store.loadPage(obj.store.currentPage);
    },

    dockedItems: [
        {
            xtype: 'search_resultspaneltoolbar',
            itemId: 'resultspaneltoolbar'
        }
    ]
});
