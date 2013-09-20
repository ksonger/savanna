Ext.define('Savanna.map.view.MapComponent', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.map_component',

    requires: [
        'Ext.layout.container.Absolute',
        'Ext.layout.container.Border',
        'Savanna.map.view.part.Canvas'
    ],

    layout: {
        type: 'border'
    },


    initComponent: function() {
        this.items = this.setupItems();

        this.callParent(arguments);
    },

    setupItems: function() {
        return [
            {
                xtype: 'panel',
                flex: 10,
                region: 'center',
                height: '100%',
                layout: {
                    type: 'absolute'
                },
                items: [
                    {
                        xtype: 'map_canvas',
                        height: '100%',
                        width: '100%'
                    }
                ]
            }
        ]
    }
});