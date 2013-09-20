/**
 * Login view
 *
 * This is the IFrame that should be show to a user when they initially load the application and are not already
 * logged in.
 */
Ext.define('Savanna.view.Login', {
    extend: 'Ext.panel.Panel',
    alias:  'widget.login',

    requires:[
        'Savanna.Config',
        'Ext.ux.IFrame'
    ],

    layout: 'fit',

    items: [],

    initComponent: function() {
        this.items = [
            {
                xtype: 'uxiframe',
                src: Savanna.Config.savannaUrlRoot + Savanna.Config.loginUrl
            }
        ];

        this.callParent(arguments);
    }
});