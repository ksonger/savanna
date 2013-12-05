/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 9/13/13
 * Time: 11:44 AM
 * To change this template use File | Settings | File Templates.
 */
/* global Ext: false */
Ext.define('Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsRefineTerm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.search_resultsDals_resultsterm',
    requires: [
        'Savanna.search.controller.resultsComponent.resultsDals.ResultsRefineTermController'
    ],
    bubbleEvents: ['Search:RemoveSearchTerm'],
    controller: 'Savanna.search.controller.resultsComponent.resultsDals.ResultsRefineTermController',

    cls: 'refine-term',

    setTerm: function (term) {
        this.queryById('termValue').setText(term);
    },

    items: [
        {
            xtype: 'label',
            itemId: 'termValue',
            height: 22,
            text: ''
        },
        {
            xtype: 'button',
            itemId: 'removeTerm',
            glyph: 'closeRollout',
            height: 22,
            style: {
                background: 'transparent',
                border: 'none'
            }
        }
    ]
});