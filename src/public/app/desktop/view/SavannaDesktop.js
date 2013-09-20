/**
 * Central view for the Savanna client application
 */
Ext.define('Savanna.desktop.view.SavannaDesktop', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.desktop_savannadesktop',
    requires:[
        'Ext.panel.Panel',
        'Savanna.desktop.view.SavannaToolbar',
        'Savanna.desktop.view.SavannaDashboard',
        'Savanna.desktop.view.SavannaWorkspace',
        'Savanna.space.view.SpaceManagerComponent',
        'Savanna.controller.Factory'
    ],
    layout: {
        type: 'border'
    },
    items: [
        {
            xtype: 'desktop_savannatoolbar',
            itemId: 'savannatoolbar',
            region: 'north'
        },
        {
            xtype: 'panel',
            itemId: 'desktopcontainer',
            layout: 'fit',
            region: 'center',
            items: [
                /*todo: - the space manager component is the first child of the desktop container. We should probably
                * change the code to create and add the desktop children only when they are needed. Do we have them
                * as local variables in this view? or do we do that in the controller? What is the proper approach?
                */
                {
                    xtype: 'space_spacemanagercomponent',
                    itemId: 'spacemanager'
                },
                {
                    xtype: 'desktop_savannadashboard',
                    itemId: 'savannadashboard',
                    width: '100%',
                    hidden: true
                },
                {
                    xtype: 'desktop_savannaworkspace',
                    itemId: 'savannaworkspace',
                    hidden: true
                }
            ]
        }

    ],

    initComponent: function() {
        this.callParent(arguments);
        Savanna.controller.Factory.getController('Savanna.desktop.controller.DesktopController');
    }
});
