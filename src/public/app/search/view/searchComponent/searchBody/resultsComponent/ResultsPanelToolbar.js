Ext.define('Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsPanelToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.search_resultspaneltoolbar',
    controller: 'Savanna.search.controller.resultsComponent.ResultsPanelToolbarController',
    bubbleEvents: ['Search:PageSizeChanged', 'Search:SortByChanged'],
    requires: [
        'Savanna.controller.Factory',
        'Ext.form.field.ComboBox',
        'Ext.data.Store',
        'Savanna.search.controller.resultsComponent.ResultsPanelToolbarController'
    ],
    height: 33,
    initComponent: function () {
        Savanna.controller.Factory.getController('Savanna.search.controller.SearchComponent');
        this.items = this.setupItems();
        this.callParent(arguments);
    },

    setupItems: function () {


        var countStore = Ext.create('Ext.data.Store', {
            fields: ['count', 'name'],
            data: [
                {'count': 20, 'name': '20 results per page'},
                {'count': 50, 'name': '50 results per page'},
                {'count': 100, 'name': '100 results per page'}
            ]
        });

        return [
            {
                xtype: 'combobox',
                itemId: 'resultsPageSizeCombobox',
                store: countStore,
                displayField: 'name',
                valueField: 'count',
                value: 'Results per page',
                editable: false,
                width: 150
            },
            '->',
            {
                xtype: 'pagingtoolbar',
                cls: 'paging-toolbar-bg',
                itemId: 'gridtoolbar',
                dock: 'top',
                displayInfo: true
            },
            '->',
            {
                xtype: 'button',
                glyph: 'list',
                itemId: 'results_listViewButton',
                width: 25,
                height: 25,
                cls: 'toolbarButtonFramework',
                tooltip: 'View search results as a list'
            },
            {
                xtype: 'button',
                glyph: 'earth',
                itemId: 'results_mapViewButton',
                width: 25,
                height: 25,
                cls: 'toolbarButtonFramework',
                tooltip: 'View search results on a map'
            }
        ]
    }

});
