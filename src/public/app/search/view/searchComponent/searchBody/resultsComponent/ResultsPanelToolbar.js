Ext.define('Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsPanelToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.search_resultspaneltoolbar',
    controller: 'Savanna.search.controller.resultsComponent.ResultsPanelToolbarController',
    bubbleEvents: ['Search:PageSizeChanged', "Search:SortByChanged"],
    requires: [
        'Savanna.controller.Factory',
        'Ext.form.field.ComboBox',
        'Ext.data.Store',
        'Savanna.search.controller.resultsComponent.ResultsPanelToolbarController'
    ],

    initComponent: function () {
        Savanna.controller.Factory.getController('Savanna.search.controller.SearchComponent');
        this.items = this.setupItems();
        this.callParent(arguments);
    },

    setupItems:function()   {

        var sortStore = Ext.create('Ext.data.Store', {
            fields: ['sortby', 'name'],
            data: [
                {'sortby': 'relevance', 'name': 'Sort by Relevance'}
            ]
        });

        var countStore = Ext.create('Ext.data.Store', {
            fields: ['count', 'name'],
            data: [
                {'count': 20, 'name': '20 results per page'},
                {'count': 50, 'name': '50 results per page'},
                {'count': 100, 'name': '100 results per page'}
            ]
        });

        return [{
                xtype: 'combobox',
                itemId: 'resultsSortByCombobox',
                store: sortStore,
                displayField: 'name',
                valueField: 'sortby',
                value: 'relevance',
                editable: false,
                ui: 'combo-button'
            }, {
                xtype: 'combobox',
                itemId: 'resultsPageSizeCombobox',
                store: countStore,
                displayField: 'name',
                valueField: 'count',
                value: 'Results per page',
                editable: false,
                ui: 'combo-button'

            }, {
                xtype: 'tbfill'
            }, {
                text:'Imgs'
            }, {
                text:'List'
            }, {
                text:'Map'
        }]
    }

});
