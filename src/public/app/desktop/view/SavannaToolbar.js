/**
 * Created with IntelliJ IDEA.
 * User: bcannon
 * Date: 8/28/13
 * Time: 9:21 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.desktop.view.SavannaToolbar',{
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.desktop_savannatoolbar',
    requires: [
        'Ext.container.ButtonGroup'
    ],
    width: '100%',
    margin: 10,
    border: 0,
    items: [
        //savanna logo
        {
            xtype: 'button',
            text: 'Savanna Logo',
            itemId: 'logobutton',
            //todo: add image to css and use iconCls
            scale: 'large' //make the button large for now (to make it stand out) until an icon is used
        },
        '->',
        //navigation buttons
        {
            xtype: 'buttongroup',
            frame: false,
            layout: {
                type: 'hbox',
                defaultMargins: '5'
            },
            items: [{
                text: 'Dashboard',
                itemId: 'dashboardbutton'
            },{
                text: 'Space Manager',
                itemId: 'spacemanagerbutton'
            },{
                text: 'Search',
                itemId: 'searchbutton'
            },{
                text: 'Upload',
                itemId: 'uploadbutton'
            }]
        },
        '->',
        //utility buttons
        {
            xtype: 'buttongroup',
            frame: false,
            layout: {
                type: 'hbox',
                defaultMargins: '5'
            },
            items: [{
                text: 'Errors',
                itemId: 'errorbutton'
            },{
                text: 'Help',
                itemId: 'helpbutton'
            },{
                text: 'User',
                itemId: 'userbutton',
                menu: [
                    {
                        //todo: bind this text property to username
                        text: '<b>Current Username here</b>',
                        itemId: 'currentuser'
                    },
                    {
                        text: 'Account Settings',
                        itemId: 'accountsettings'
                    },
                    {
                        text: 'Log out',
                        itemId: 'savannalogout'
                    }
                ]
            }]
        }
    ]
});
