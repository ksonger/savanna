/**
 * Created with IntelliJ IDEA.
 * User: bcannon
 * Date: 9/2/13
 * Time: 11:21 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.space.view.SpaceManagerComponent', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.space_spacemanagercomponent',
    requires:[
        'Ext.panel.Panel',
        'Savanna.space.view.SpaceMetadataTabPanel',
        'Savanna.space.view.SpaceListPanel',
        'Savanna.controller.Factory'
    ],
    layout: {
        type: 'border'
    },
    items: [
        {
            region: 'center',
            xtype: 'panel',
            layout: 'vbox',
            items: [
                {
                    //todo: extract into a separate toolbar or move into tbar
                    xtype: 'toolbar',
                    width: '100%',
                    border: 0,
                    margin: 10,
                    frame: false,
                    flex: 1,
                    items: [
                        {
                            xtype: 'label',
                            text: 'Space Manager:'
                        },
                        '->',
                        {
                            xtype: 'button',
                            text: 'Go to Space',
                            itemId: 'openspacebutton'
                        }
                    ]
                },
                {
                    //todo: replace with map component
                    xtype: 'panel',
                    layout: 'fit',
                    width: '100%',
                    flex: 9,
                    items: [
                        {
                            xtype: 'draw',
                            items: [
                                {
                                    type: 'circle',
                                    radius: 60,
                                    x: 100,
                                    y: 100,
                                    fill: 'blue'
                                }
                            ]
                        }
                    ]
                },
                {
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'center',
                        defaultMargins: '10'
                    },
                    width: '100%',
                    flex: 1,
                    items: [
                        {
                            xtype: 'button',
                            text: 'Save'
                        },
                        {
                            xtype: 'button',
                            text: 'Cancel'
                        }
                    ]
                }
            ]
        },
        {
            /*
            TabPanel that displays detailed information about the space.
             */
            region: 'east',
            xtype: 'space_metadatatabpanel',
            itemId: 'metadatatab',
            layout: 'fit',
            width: '30%', //design should apply appropriate styling properties
            weight: -1,
            collapsible: true,
            split: true
        },
        {
            /*
            Area to show a list of the user's spaces. Also contains a control to allow them to create
            a new space.
             */
            xtype: 'space_spacelist',
            region: 'south',
            collapsible: true,
            split: true,
            height: '20%', //design should apply appropriate styling properties
            //make sure this value is below that of the metadata tab panel, to ensure correct layout
            weight: -2
        }
    ],
    initComponent: function() {
        this.callParent(arguments);
        Savanna.controller.Factory.getController('Savanna.space.controller.SpaceManagerController');
    }
});
