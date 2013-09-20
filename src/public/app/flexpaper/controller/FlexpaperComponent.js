/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 6/27/13
 * Time: 10:43 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define("Savanna.flexpaper.controller.FlexpaperComponent", {
    extend: "Ext.app.Controller",
    views: [
        "Savanna.flexpaper.view.FlexpaperComponent",
        "Savanna.flexpaper.view.FlexpaperBody",
        "Savanna.flexpaper.view.FlexpaperToolbar",
        "Savanna.flexpaper.view.FlexpaperEntityWindow"
    ],

    onToolSelect:function (btn, evt) {
        var viewerId = btn.up("flexpaper_flexpapercomponent").docViewId;
        if (btn.itemId == "toolmenu")   {
            Ext.each(btn.menu.items.items, function (item)
            {
                try {
                    item.on("click", function (e)   {
                        this["onToolSelect_" + btn.itemId](viewerId);
                    });
                }   catch(e)    {
                    console.log("FlexpaperComponent.js, error calling method: " + btn.itemId)
                }
            });
        } else {
            try {
                this["onToolSelect_" + btn.itemId](viewerId);
            }   catch(e)    {
                console.log("FlexpaperComponent, error calling method: " + btn.itemId, e)
            }
        }
    },
    init: function (app) {
        this.control({
            "flexpaper_flexpapertoolbar > #tools button": {
                click: this.onToolSelect
            }
        });
    },

    /*
     Tool selection handlers
     */

    onToolSelect_handtool:function(viewerId) {
        // coming soon
    },
    onToolSelect_selecttool:function(viewerId)   {
        $FlexPaper(viewerId).enableHighlighter();
        this.currentTool = "select";
    },
    onToolSelect_penciltool:function(viewerId)   {
        $FlexPaper(viewerId).enableDrawMode();
        this.currentTool = "pencil";
    },
    onToolSelect_commenttool:function(viewerId)  {
        $FlexPaper(viewerId).addNote();
        this.currentTool = "comment";
    },
    onToolSelect_entitytool:function(viewerId)   {
        $FlexPaper(viewerId).enableStrikeout();
        this.currentTool = "entity";
    },
    onToolSelect_zoomintool:function(viewerId)   {
        $FlexPaper(viewerId).setZoom($FlexPaper(viewer).scale + .2);
    },
    onToolSelect_zoomouttool:function(viewerId)  {
        $FlexPaper(viewerId).setZoom($FlexPaper(viewer).scale - .2);
    },
    onToolSelect_zoomfittool:function(viewerId)  {
        $FlexPaper(viewerId).fitHeight();
    },
    onToolSelect_singlepageview:function(viewerId)   {
        $FlexPaper(viewerId).switchMode("Portrait");
    },
    onToolSelect_twopageview:function(viewerId)  {
        $FlexPaper(viewerId).switchMode("TwoPage");
    },
    onToolSelect_thumbview:function(viewerId)    {
        $FlexPaper(viewerId).switchMode("Tile");
    },
    onToolSelect_entitiesview:function(viewerId)   {
        // coming soon
    },
    onToolSelect_mycommentsview:function(viewerId)   {
        // coming soon
    },
    onToolSelect_othercommentsview:function(viewerId)    {
        // coming soon
    },
    onToolSelect_legendview:function(viewerId)   {
        // coming soon
    }
});