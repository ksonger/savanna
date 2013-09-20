/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 6/27/13
 * Time: 10:41 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define("Savanna.flexpaper.view.FlexpaperComponent", {
    extend: "Ext.panel.Panel",
    alias: "widget.flexpaper_flexpapercomponent",
    layout:"vbox",
    border:false,
    currentTool: null,
    pdfFile:null,
    docViewId:null, //TODO - can we just store the reference to the flexpaper component instead of the id
    requires: [
        "Savanna.flexpaper.view.FlexpaperToolbar",
        "Savanna.flexpaper.view.FlexpaperBody"
    ],
    initComponent:function()    {
        Savanna.controller.Factory.getController('Savanna.flexpaper.controller.FlexpaperComponent');
        this.callParent(arguments);
    },
    afterRender: function() {
        this.callParent(arguments);

        //This div needs an explicit id
        this.docViewId = Ext.id();
        var domElement = Ext.DomHelper.insertHtml("afterBegin", this.down('#fpbody').getEl().dom, "<div id='" + this.docViewId + "' class='flexpaper_viewer' style='width: 100%; height: 100%;'></div>");

        jQuery(domElement).FlexPaperViewer(
            {
                config: {
                    PDFFile: this.pdfFile,
                    Scale: 0.6,
                    key : "@86cf4d402afdbe0b389$f6de2e67f473111c51e",
                    ZoomTransition: 'easeOut',
                    ZoomTime: 0.5,
                    ZoomInterval: 0.2,
                    FitPageOnLoad: false,
                    FitWidthOnLoad: true,
                    FullScreenAsMaxWindow: true,
                    ProgressiveLoading: false,
                    MinZoomSize: 0.2,
                    MaxZoomSize: 5,
                    SearchMatchAll: false,
                    BottomToolbar: 'none',
                    InitViewMode: 'Portrait',
                    RenderingOrder: 'html5',
                    StartAtPage: '',
                    WMode: 'window',
                    localeChain: 'en_US',
                    localeDirectory: 'resources/flexpaper/locale/'
                }
            }
        );
    },
    items:  [
        {
            xtype:"flexpaper_flexpaperbody",
            itemId:"fpbody",
            width: '100%',
            flex: 1
        }
    ],
    dockedItems:    [
        {
            xtype:"flexpaper_flexpapertoolbar",
            itemId:"fptoolbar"
        }
    ]
});
