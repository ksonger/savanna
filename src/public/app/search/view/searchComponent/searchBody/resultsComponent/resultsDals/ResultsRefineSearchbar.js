Ext.define('Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsRefineSearchbar', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.search_resultsDals_resultsrefine',

    requires: [
        'Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsRefineTerms',
        'Savanna.search.controller.resultsComponent.resultsDals.ResultsRefineSearchbarController',
        'ThetusUikit.ux.form.SearchField'
    ],

    controller: 'Savanna.search.controller.resultsComponent.resultsDals.ResultsRefineSearchbarController',

    width:'100%',
    title: 'refine search',
    ui: 'simple-grey',
    layout: 'fit',

    items: [
        {
            // adding thetus-searchfield removes the necessity for a submit button.
            xtype: 'thetus-searchfield',
            width: '100%',
            name: 'refine_search_terms',
            itemId: 'refine_search_terms',
            enableKeyEvents: true,
            emptyText: 'Search in results'
        }
    ]
});
