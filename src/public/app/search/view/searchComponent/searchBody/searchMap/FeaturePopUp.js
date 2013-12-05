/**
 * Created with IntelliJ IDEA.
 * User: sseely
 * Date: 10/14/13
 * Time: 3:31 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.view.searchComponent.searchBody.searchMap.FeaturePopUp', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.search_featurepopup',

    height: 175,
    width: 375,
    style: {
        'overflow': "visible"
    },
    store: [],
    layout: 'vbox',
    currentIndex: null,
    data: {},
    scroll: 'vertical',
    toFrontOnShow: false,
    hidden: true,
    header: false,
    defaults: {
        // applied to each contained panel
        border: false
    },

    tbar: {
        itemId:'popup-top-toolbar',
        height: 35,
        width: '100%',
        items: [
            {
                xtype: 'label',
                itemId: 'popup-index-count',
                padding: '0 0 0 5',
                width: 240,
                cls: 'map popup content'
            },
            '->',
            {
                xtype: 'button',
                itemId: 'mapResultPrev',
                text: '<',
                direction: 'prev',
                disabled: true
            },
            {
                xtype: 'button',
                itemId: 'mapResultNext',
                direction: 'next',
                text: '>',
                disabled: true
            }

        ]
    },

    dockedItems: [
        {
            dock: 'bottom',
            xtype: 'toolbar',
            itemId: 'popup-preview-toolbar',
            items: [
                '->',
                {
                    xtype: 'button',
                    itemId: 'openDocButton',
                    text: 'Open'

                }]
        }
    ],

    items: [
        {
            xtype: 'text',
            itemId: 'popup-title',
            padding: '0 0 5 5',
            cls: 'map-popup-title'
        },
        {
            xtype: 'text',
            itemId: 'popup-location-text',
            padding: '0 0 0 5',
            width: '100%',
            cls: 'map popup content'
        },
        {
            xtype: 'label',
            itemId: 'popup-preview-text',
            padding: '0 5 0 5',
            width: '100%',
            cls: 'map popup content'
        }


    ],

    refresh:function(){
        var renderSelector = Ext.query('button.popUpPreview');
        for(var i in renderSelector){
            Ext.create('Ext.button.Button',{
                renderTo:renderSelector[i]
            });
        }

    },

    onRender: function() {
        this.callParent(arguments);
        Ext.DomHelper.append(this.getEl().dom, '<div class="popUpAnchor"></div>');


    }
});


