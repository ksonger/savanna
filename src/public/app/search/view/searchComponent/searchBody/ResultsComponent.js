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
    requires: [
        'Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsDals',
        'Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsPanel',
        'Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsPreviewContent',
        'Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsPreviewWindow',
        'Savanna.controller.Factory',
        'Savanna.search.store.DalSources'
    ],
    layout: 'border',
    defaults: {
        // is collapsible good?  seemed handy.
        collapsible: true,
        split: true
    },
    currentResultSet:null,
    initComponent: function () {
        this.allResultSets = [];
        this.callParent(arguments);
        Savanna.controller.Factory.getController('Savanna.search.controller.ResultsComponent');
    },

    items: [
        {
            xtype: 'search_resultsdals',
            itemId: 'resultsdals'
        },
        {
            xtype: 'search_resultspanel',
            itemId: 'resultspanel'
        },
        {
            xtype: 'search_resultspreviewwindow',
            itemId: 'resultspreviewwindow'
        }
    ]
});
