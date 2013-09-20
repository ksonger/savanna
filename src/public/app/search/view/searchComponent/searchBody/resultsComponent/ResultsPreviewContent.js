/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 7/31/13
 * Time: 4:31 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsPreviewContent', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.search_resultspreviewcontent',
    requires: [

    ],
    overflowY:'auto',

    items:  [
        {
            xtype:'panel',
            itemId: 'previewcontent'
        }
    ],

    tbar: [
        {
            height: 54,
            layout: 'anchor',
            xtype: 'container',
            border: false,
            defaults: {
                anchor: '100%',
                height: 27
            },
            items : [
                {
                    xtype: 'toolbar',
                    width: 440,
                    border: false,
                    itemId: 'results_preview_nav_text',
                    items: [
                        {
                            xtype: 'label',
                            text: 'Preview Results 1 of 10'
                        },
                        '->',
                        {
                            xtype: 'button',
                            text: 'prev'
                        },
                        {
                            xtype: 'button',
                            text: 'next'
                        }
                    ]
                },{
                    xtype: 'toolbar',
                    width: 440,
                    border: false,
                    items: [
                        {
                            xtype: 'button',
                            text: 'Add to MyStuff'
                        },
                        {
                            xtype: 'tbfill'
                        },
                        {
                            xtype: 'button',
                            text: 'Open Result'
                        },
                        {
                            xtype: 'button',
                            text: 'Close',
                            itemId: 'previewclosebutton'
                        }
                    ]
                }
            ]
        }
    ],

    initComponent: function () {
        this.callParent(arguments);
        Savanna.controller.Factory.getController('Savanna.search.controller.ResultsComponent');
    },
    populate: function () {
        console.log('test')
    }

});