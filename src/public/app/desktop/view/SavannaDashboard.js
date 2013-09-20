/**
 * Created with IntelliJ IDEA.
 * User: bcannon
 * Date: 9/2/13
 * Time: 11:14 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.desktop.view.SavannaDashboard', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.desktop_savannadashboard',
    layout: {
        type: 'fit'
    },
    items: [{
        xtype: 'label',
        text: 'Dashboard'
    }]
});
