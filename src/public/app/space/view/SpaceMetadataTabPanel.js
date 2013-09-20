/**
 * Created with IntelliJ IDEA.
 * User: bcannon
 * Date: 9/5/13
 * Time: 8:51 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.space.view.SpaceMetadataTabPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.space_metadatatabpanel',
    requires:[
        'Ext.tab.Panel',
        'Savanna.space.view.metadata.DetailPanel',
        'Savanna.space.view.metadata.TeamPanel',
        'Savanna.space.view.metadata.CommentPanel',
        'Savanna.space.view.metadata.ActivityPanel'
    ],
    activeTab: 0,
    items: [
        {
            xtype: 'space_detailpanel',
            itemId: 'spacedetails'
        },
        {
            xtype: 'space_teampanel',
            itemId: 'spaceteam'
        },
        {
            xtype: 'space_commentpanel',
            itemId: 'spacecomments'
        },
        {
            xtype: 'space_activitypanel',
            itemId: 'spaceactivity'
        }
    ]
});
