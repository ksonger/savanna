Ext.define('Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsPanelToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.search_resultspaneltoolbar',

    requires: [
        'Savanna.controller.Factory',
        'Ext.form.field.ComboBox',
        'Ext.data.Store'
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
                {'sortby': 'relevance', 'name': 'Relevance'}
            ]
        });

        var countStore = Ext.create('Ext.data.Store', {
            fields: ['count', 'name'],
            data: [
                {'count': '20', 'name': '20'},
                {'count': '50', 'name': '50'},
                {'count': '100', 'name': '100'}
            ]
        });

        return [
            {
                xtype: 'tbtext',
                text: 'Sort by:',
                itemId: 'sortby_combobox_label'
            },
            {
                xtype: 'combobox',
                itemId: 'resultsSortByCombobox',
                store: sortStore,
                displayField: 'name',
                valueField: 'sortby',
                value: 'relevance'

            },
            {
                xtype: 'tbtext',
                text: 'Results Per Page:',
                itemId: 'pagesize_combobox_label'
            },
            {
                xtype: 'combobox',
                itemId: 'resultsPageSizeCombobox',
                store: countStore,
                displayField: 'name',
                valueField: 'count',
                value: '20'

            },
            {
                xtype: 'tbfill'
            },

            {
                text:'Imgs',
                ui: 'flat-toolbar-button'
            },
            {
                text:'List',
                ui: 'flat-toolbar-button'
            },
            {
                text:'Map',
                ui: 'flat-toolbar-button'
            }
        ]
    }

});