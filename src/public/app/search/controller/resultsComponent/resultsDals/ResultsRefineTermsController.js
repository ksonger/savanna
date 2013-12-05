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