/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 11/18/13
 * Time: 12:42 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.controller.resultsComponent.resultsDals.ResultsRefineTermsController',
    {
        extend: 'Deft.mvc.ViewController',

        init: function () {
            this.getView().on('Tag:RemoveSearchTerm', this.onRemoveSearchTerm, this);
            return this.callParent(arguments);
        },

        onRemoveSearchTerm: function ( termString, termComponent ) {
            termComponent.destroy();

            var searchController = Savanna.controller.Factory.getController('Savanna.search.controller.SearchComponent');

            if (searchController !== undefined) {
                searchController.doSearch(this.getView());
            }
        }
    }
);