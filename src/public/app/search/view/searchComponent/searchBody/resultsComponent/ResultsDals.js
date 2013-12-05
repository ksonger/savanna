/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 7/31/13
 * Time: 4:31 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsDals', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.search_resultsdals',
    bubbleEvents: ['search:changeSelectedStore'],
    controller: 'Savanna.search.controller.resultsComponent.resultsDals.ResultsDals',
    requires: [
        'Savanna.controller.Factory',
        'Ext.form.Label',
        'Ext.toolbar.Spacer',
        'Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsOptions',
        'Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsFacets',
        'Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsRefineSearchbar'
    ],

    title: 'Search Sources',
    region: 'west',
    headerPosition: 'right',
    collapsedCls: 'light-blue',
    header: {
        ui: 'light-blue'
    },
    /*
     NOTE: to be replaced with a class attribute I'm sure - this just
     here to get the panel to display for development.
     */
    width: 220,
    height: '100%',

    layout: 'vbox',
    autoScroll: true,

    defaults: {
        padding: 10,
        width: '100%'
    },

    items: [],

    initComponent: function () {
        this.callParent(arguments);
    }
});
