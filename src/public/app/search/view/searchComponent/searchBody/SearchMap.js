/**
 * Created with IntelliJ IDEA.
 * User: swatson
 * Date: 7/19/13
 * Time: 1:48 PM
 * To change this template use File | Settings | File Templates.
 */
/**
 * TODO: Document what events we may emit...
 */
Ext.define('Savanna.search.view.searchComponent.searchBody.SearchMap', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.search_searchmap',

    requires: [
        'Savanna.controller.Factory',
        'Savanna.search.view.searchComponent.searchBody.searchMap.Canvas',
        'Savanna.search.view.searchComponent.searchBody.searchMap.SearchLocationComboBox'
    ],

    layout: 'absolute',

    items: [
        {
            xtype: 'search_map_canvas',
            height: '100%',
            width: '100%',
            itemId: 'searchMapCanvas',
            flex: 1
        },
        {
            xtype: 'button',
            itemId: 'drawLocationSearch',
            glyph: 'polygonTop',
            ui: 'basic',
            cls: 'locationSearch-drawPolygon',
            tooltip:'Click to outline search area'
        }
    ],
    tbar: {
        itemId: 'searchLocationDockedItems',
        layout: 'vbox',
        items: [{
            xtype: 'box',
            cls: 'toolbar-paddingSmall',
            html: 'Mark an area of interest. <em>Note: Not all search sources support location filtering.</em>'
        }, {
            xtype: 'toolbar',
            width: '100%',
            cls: 'toolbar-paddingSmall',
            items: [
                {
                    xtype: 'search_searchlocationcombobox',
                    itemId: 'searchcombobox'
                },
                {
                    xtype: 'button',
                    itemId: 'mapZoomToMenu',
                    text: 'Zoom To',
                    menu: [
                        {
                            itemId: 'zoomToWholeWorld',
                            text: 'Whole World',
                            disabled: false
                        },
                        {
                            itemId: 'zoomToSelectedArea',
                            text: 'Selected Area',
                            disabled: true
                        }
                    ]
                },
                '->',
                {
                    xtype: 'button',
                    itemId: 'clearLocationSearch',
                    text: 'Clear Location Search'
                }
            ]
        }]
    }
});