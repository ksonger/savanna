/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 11/18/13
 * Time: 12:42 PM
 * To change this template use File | Settings | File Templates.
 */
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