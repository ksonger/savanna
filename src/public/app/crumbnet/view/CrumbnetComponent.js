/* global Ext: false */
Ext.define('Savanna.crumbnet.view.CrumbnetComponent', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.go-graph',

    requires: [
        'Ext.layout.container.Absolute',
        'Ext.layout.container.Border',
        'Savanna.crumbnet.view.part.PaletteMenu',
        'Savanna.crumbnet.view.part.Canvas',
        'Savanna.crumbnet.view.part.Overview',
        'Savanna.crumbnet.utils.ViewTemplates',
        'Savanna.crumbnet.view.part.Toolbar'
    ],

    layout: {
        type: 'border'
    },

    tbar: [
        {
            xtype: 'crumbnet_part_toolbar'
        }
    ],

    overview: null,

    initComponent: function() {
        this.items = this.setupItems();

        this.callParent(arguments);
    },

    // CUSTOM METHODS

    setupItems: function() {
        return [
            {
                xtype: 'crumbnet_part_palette-menu',
                region: 'west',
                collapsible: true,
                width: 100,
                height: '100%'
            },
            {
                xtype: 'panel',
                itemId: 'mainCrumbnetViewport',
                flex: 10,
                region: 'center',
                height: '100%',
                layout: {
                    type: 'absolute'
                },
                items:[
                    {
                        xtype: 'go-graph_canvas',
                        width: '100%',
                        height: '100%'
                    }
                    // NOTE: there is a dynamically added "go-graph_overview" component that is managed at runtime
                ]
            }
        ];
    }
});