/* global Ext: false, Savanna: false */
Ext.define('Savanna.search.view.searchComponent.SearchToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.search_searchtoolbar',

    border: false,
    frame: false,
    docked: 'top',

    items: [
        {
            xtype: 'tbfill'
        },
        {
            glyph: 61786,
            ui: 'flat-toolbar-button'
        },
        {
            glyph: 61746,
            ui: 'flat-toolbar-button'
        }
    ]

});