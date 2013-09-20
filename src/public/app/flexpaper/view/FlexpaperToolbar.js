/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 6/27/13
 * Time: 9:11 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define("Savanna.flexpaper.view.FlexpaperToolbar", {
    extend:"Ext.panel.Panel",
    alias:"widget.flexpaper_flexpapertoolbar",
    requires:   [
        "Ext.toolbar.Toolbar"
    ],
    border:false,
    initComponent:function(){
        this.callParent();
    },
    items:  [
        {
            xtype: "toolbar",
            itemId:"tools",
            hideMode:"display",
            items: [
                {
                    text: "hand",
                    itemId:"handtool"
                },
                {
                    text: "highlight",
                    itemId:"selecttool"
                },
                {
                    text: "pencil",
                    itemId:"penciltool"
                },
                {
                    text: "comment",
                    itemId:"commenttool"
                },
                {
                    text: "entity",
                    itemId:"entitytool"
                },
                {
                    text: "zoom in",
                    itemId:"zoomintool"
                },
                {
                    text: "zoom out",
                    itemId:"zoomouttool"
                },
                {
                    text: "zoom fit",
                    itemId:"zoomfittool"
                },
                {
                    text: "view V",
                    itemId:"toolmenu",
                    menu: [
                        {
                            text: "single page",
                            itemId:"singlepageview"
                        },
                        {
                            text: "two page",
                            itemId:"twopageview"
                        },
                        {
                            text: "thumbnails",
                            itemId:"thumbview"
                        },
                        {
                            text: "entities",
                            itemId:"entitiesview"
                        },
                        {
                            text: "my highlights and comments",
                            itemId:"mycommentsview"
                        },
                        {
                            text: "other highlights and comments",
                            itemId:"othercommentsview"
                        },
                        {
                            text: "entity legend",
                            itemId:"legendview"
                        }
                    ]

                }
            ]
        }
    ]
});