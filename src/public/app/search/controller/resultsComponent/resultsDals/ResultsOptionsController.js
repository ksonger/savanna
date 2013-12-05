Ext.define('Savanna.search.controller.resultsComponent.resultsDals.ResultsOptionsController',
    {
        extend: 'Deft.mvc.ViewController',

        onClick: function () {
            this.getView().fireEvent('search:changeSelectedStore',  this.getView());
        },

        init: function () {
            this.getView().on('click', this.onClick, this);
        }

    }
);