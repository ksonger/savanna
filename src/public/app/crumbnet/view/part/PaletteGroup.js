/* global Ext: false, go: false, Savanna: false, go: false */
Ext.define('Savanna.crumbnet.view.part.PaletteGroup', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.crumbnet_part_palette-group',

    requires: [
        'Savanna.crumbnet.utils.ViewTemplates'
    ],

    model: null,
    palette: null,

    initComponent: function() {
        this.title = this.model.get('title');

        this.callParent(arguments);

        this.mon(this, 'expand', function() { this.requestPaletteUpdate(); }, this);
    },

    onRender: function() {
        this.callParent(arguments);

        // NOTE: UiKit people, I assume we do not want hard-coded style attributes, but I put them in for the time being
        var domElem = Ext.DomHelper.insertHtml('afterBegin', this.body.dom, '<div class="go-graph-palette" id="palette-' + Ext.id() + '" style="width: 100%; height: 100%;"></div>');

        this.palette = new go.Palette(domElem);
        this.palette.initialAutoScale = go.Diagram.None;

        this.palette.nodeTemplate = Savanna.crumbnet.utils.ViewTemplates.generatePaletteNodeTemplate();

        this.palette.model.nodeDataArray = this.model.templatesAsJson();

        //palette extends diagram so it has many of the same tools enabled by default.
        //We don't want users to be able to pan or select multiple nodes in the palette.
        this.palette.toolManager.dragSelectingTool.isEnabled = false;
        this.palette.toolManager.panningTool.isEnabled = false;
        this.palette.maxSelectionCount = 1;

        this.palette.addDiagramListener('ChangedSelection', Ext.bind(this.selectionChanged, this));
    },

    selectionChanged: function(e) {
        this.fireEvent('nodePaletteSelectionChanged', e, this);
    },

    requestPaletteUpdate: function() {
        this.palette.requestUpdate();
    }
});