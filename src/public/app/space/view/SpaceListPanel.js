/**
 * Created with IntelliJ IDEA.
 * User: bcannon
 * Date: 9/9/13
 * Time: 2:18 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.space.view.SpaceListPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.space_spacelist',
    title: 'My Spaces',
    layout: {
        type: 'hbox',
        align: 'middle',
        padding: '20'
    },
    items: [
        {
            xtype: 'button',
            scale: 'large',
            text: '<b>Create<br>New Space</b>'
        }
    ]
});