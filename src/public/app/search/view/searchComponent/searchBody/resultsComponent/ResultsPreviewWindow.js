/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 7/31/13
 * Time: 4:31 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsPreviewWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.search_resultspreviewwindow',
    requires: [
        'Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsPreviewContent'
    ],
    layout: 'fit',
    floating: true,
    hideCollapseTool: true,
    closeAction: 'hide',
    width:640,
    height:500,
    header:true,
    items: [
        {
            xtype: 'search_resultspreviewcontent',
            itemId: 'resultspreviewcontent'
        }
    ],

    initComponent: function () {
        this.callParent(arguments);
        Savanna.controller.Factory.getController('Savanna.search.controller.ResultsComponent');
    },

    displayPreview:function(record, metadata, index, totalCount)   {
        if(metadata.data)    {
            this.show();
            this.queryById('resultspreviewcontent').populate(record, metadata, index, totalCount);
        }   else    {
            Ext.Error.raise({
                msg: 'No document metadata to display.'
            });
        }
    }
});
