Ext.define('Savanna.search.controller.resultsComponent.resultsDals.ResultsRefineTermController', {
        extend: 'Deft.mvc.ViewController',

        view: 'Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsRefineTerm',

        control: {
            view: {
                click: {
                    element: 'closeEl',
                    fn: 'onCloseButton'
                }
            }
        },

        init: function () {
            return this.callParent(arguments);
        },

        onCloseButton: function () {
            if (!this.getView().disabled) {
                this.getView().fireEvent('Search:RemoveSearchTerm', this.getView().text, this.getView());
            }
        }
    }
);