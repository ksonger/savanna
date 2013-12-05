/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 7/31/13
 * Time: 4:31 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.view.searchComponent.searchBody.ResultsComponent', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.search_resultscomponent',
    bubbleEvents: ['Search:PageSizeChanged', "Search:SortByChanged", 'search:changeSelectedStore'],
    controller: 'Savanna.search.controller.ResultsComponent',
    requires: [
        'Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsDals',
        'Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsPanel',
        'Savanna.controller.Factory',
        'Savanna.search.store.DalSources'
    ],
    layout: 'border',
    defaults: {
        titleCollapse: true,
        collapsible: true,
        split: true
    },
    currentResultSet:null,
    initComponent: function () {
        this.allResultSets = [];
        this.callParent(arguments);

    },

    items: [
        {
            xtype: 'search_resultsdals',
            itemId: 'resultsdals',
            split: true,
            collapseMode: 'header'
        },
        {
            xtype: 'search_resultspanel',
            itemId: 'resultspanel'
        }
    ]
});
