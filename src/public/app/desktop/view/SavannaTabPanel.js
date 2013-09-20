/**
 * Created with IntelliJ IDEA.
 * User: bcannon
 * Date: 9/11/13
 * Time: 9:29 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.desktop.view.SavannaTabPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.desktop_tabpanel',
    requires: [
        'Ext.ux.TabReorderer',
        'Ext.ux.TabCloseMenu',
        'Savanna.crumbnet.view.CrumbnetComponent'
    ],
    enableTabScroll: true,
//    plugins: [
//            Ext.create('Ext.ux.TabReorderer'),
//            Ext.create('Ext.ux.TabCloseMenu', {
//                extraItemsHead: [
//                    '-',
//                    {
//                        text: 'Split',
//                        hideOnClick: true,
//                        handler: function (item) {
//                            currentItem.tab.setClosable(item.checked);
//                        }
//                    },
//                    '-',
//                    {
//                        text: 'Move right',
//                        hideOnClick: true,
//                        hidden: (this.mainPanel === false),
//                        handler: function(item) {
//                            currentItem.tab.setDisabled(!item.checked);
//                        }
//                    }
//                ],
//            })
//    ],
    tabBar:{
        items:[{
            xtype: 'button',
            text:'+',
            closable: false,
            menu: {
                xtype: 'menu',
                plain: true,
                defaults: {
                    handler: function(item) {
                        var tabPanel = item.up('tabpanel');
                        var dummyCrumbnet = Ext.create('Savanna.crumbnet.view.CrumbnetComponent', {title: 'Tab' + item.text});
                        var tab = tabPanel.add(dummyCrumbnet);
                        tabPanel.doLayout();
                        tabPanel.setActiveTab(tab);
                    }
                },
                items: [
                    { text: 'A' },
                    { text: 'B' },
                    { text: 'C' },
                    { text: 'D' },
                    { text: 'E' }
                ]
            }
        }]
    }
});