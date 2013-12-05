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
        }
        /* help and mystuff are not in this release
        ,
        {
            glyph: 61786
        },
        {
            glyph: 61746
        } */
    ]

});