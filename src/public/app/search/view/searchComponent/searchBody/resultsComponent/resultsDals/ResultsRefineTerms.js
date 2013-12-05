/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 9/13/13
 * Time: 11:44 AM
 * To change this template use File | Settings | File Templates.
 */
/* global Ext: false */
Ext.define('Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsRefineTerms', {
    extend: 'Ext.container.Container',
    alias: 'widget.search_resultsDals_resultsterms',
    controller: 'Savanna.search.controller.resultsComponent.resultsDals.ResultsRefineTermsController',
    requires: [
        'Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsRefineTerm',
        'Savanna.search.controller.resultsComponent.resultsDals.ResultsRefineTermsController',
        'Savanna.components.tags.Tag'
    ],
    termIndex: 0,

    addTerm: function (newTermText) {
        //add the newTermText as a new refine search term. This function does NOT check for duplicate terms - the caller
        //should be responsible for determining whether this term should be added or not before calling this function.
        var refineTerm = Ext.create('Savanna.components.tags.Tag', {
            itemId: 'term' + this.termIndex,
            cls: 'refine-term'
        });
        ++this.termIndex;

        refineTerm.setTerm(newTermText);
        this.add(refineTerm);
    },

    getRefineSearchString: function () {
        var refineSearchString = '';
        for (var i = 0; i < this.items.items.length; i++) {
            refineSearchString += (this.items.items[i].getText() + ' AND ');
        }
        return refineSearchString;
    },

    termExists: function (term) {
        for (var i = 0; i < this.items.items.length; i++) {
            if (this.items.items[i].getText().toLowerCase() === term.toLowerCase()) {
                return true;
            }
        }
        return false;
    }
});