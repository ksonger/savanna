/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 11/18/13
 * Time: 12:42 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.controller.resultsComponent.ResultsPanelToolbarController', {
    extend: 'Deft.mvc.ViewController',
    control: {
        view: {
            boxready: "onViewBoxReady"
        },

        resultsPageSizeCombobox: {
            select: 'onPageSizeChange'
        },
        results_listViewButton: {
            click: 'onViewBtnClick'
        },
        results_mapViewButton: {
            click: 'onViewBtnClick'
        }
    },

    onViewBoxReady:function()   {
        this.getView().queryById('results_listViewButton').toggle();
    },


    onPageSizeChange: function (box, record) {
        this.getView().fireEvent("Search:PageSizeChanged", record[0].data.count);

    },

    onSortByChange: function (box, record) {
        this.getView().fireEvent("Search:SortByChanged", record);

    },

    onViewBtnClick:function(btn)  {
        if(!btn.pressed)    {
            this.getView().queryById('results_listViewButton').toggle();
            this.getView().queryById('results_mapViewButton').toggle();
        }
    },

    init: function () {
        return this.callParent(arguments);
    }

});