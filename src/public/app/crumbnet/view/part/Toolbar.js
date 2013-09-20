/* global Ext: false, Savanna: false */
Ext.define('Savanna.crumbnet.view.part.Toolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.crumbnet_part_toolbar',

    requires: [
        'Savanna.Config',
        'Savanna.crumbnet.utils.ViewTemplates',
        'Ext.menu.ColorPicker'
    ],

    width: '100%',

    items: [],

    initComponent: function() {
        this.items = this.setupItems();
        this.callParent(arguments);
    },

    // CUSTOM METHODS

    setupItems: function() {
        /*
            A NOTE ABOUT "types"

            We've elected to use the "type" property to indicate the action a given button should implement, but it
            should be pointed out that "type" is formally defined as a parameter to control what kind of HTML <input>
            element is created by the browser.  However, since ExtJS appears to thoroughly disregard this, we should be
            okay with our current course.

            The reason for using "type" is that allows us to create component queries in the controller to listen to
            and filter events from the toolbar, identifying when a button is at the top-level of the toolbar and when
            it is in a submenu. The way this works is:

            top-level buttons - simply have a "type" property
            submenu buttons - have a type at the menu which indicates:
                                1) the name of the handler
                                2) that it is a submenu

            Examples:

            {
                type: 'topLevelButton', // the controller will look for a handleTopLevelButton method to dispatch events
                text: 'I am a top-level button'
            }
            {
                type: 'someMenu submenu', // the controller will look for a handleSomeMenuSubmenu method to dispatch events from all child buttons
                text: 'I have child buttons',
                menu: [
                    {
                        type: 'lowerLevelButton',
                        text: 'I am a submenu button'
                    }
                ]
            }
         */
        return [
            { text: 'Main Menu', menu: this.buildMainDropdown() },
            this.buildUndoMenuItem(),
            this.buildRedoMenuItem(),
            { glyph: 61718, ui: 'flat-toolbar-button', menu: this.buildCutCopyPasteMenu() },
            { type: 'layout submenu', glyph: 61775, tooltip: 'Layout', ui: 'flat-toolbar-button', menu: this.buildLayoutMenuItems() },

            { xtype: 'tbfill' }, // could also be '->'

            { xtype: 'textfield', itemId: 'crumbnetSearchText' },
            { itemId: 'search', glyph: 61808, ui: 'flat-toolbar-button' },

            { xtype: 'tbseparator' }, // could also be '-'

            { glyph: 61786, ui: 'flat-toolbar-button', menu: this.buildSaveMenu() },
            this.buildExportMenuItem(),
            this.buildPrintMenuItem()
        ];
    },

    buildMainDropdown: function() {
        var includeLabel = true;

        return [
            {
                text: 'File',
                menu: this.buildFileMenuItems(includeLabel)
            },
            {
                text: 'Edit',
                menu: this.buildEditMenuItems(includeLabel)
            },
            {
                text: 'View',
                menu: this.buildViewMenuItems(includeLabel)
            },
            {
                text: 'Format',
                menu: this.buildFormatMenuItems()
            },
            {
                text: 'Object',
                menu: this.buildObjectMenuItems()
            }
        ];
    },

    // "File" menu

    buildFileMenuItems: function(includeLabel) {
        var fileMenuItems = this.buildSaveMenu();
        fileMenuItems.push(this.buildExportMenuItem(includeLabel));
        fileMenuItems.push(this.buildPrintMenuItem(includeLabel));
        fileMenuItems.push({ type: 'close', text: 'Close' });

        return fileMenuItems;
    },

    buildSaveMenu: function() {
        return [
            { type: 'save', text: 'Save' },
            { type: 'saveAs', text: 'Save As'}
        ];
    },

    buildExportMenuItem: function(includeLabel) {
        return this.buildToolbarButton({
            type: 'export',
            glyph: 61727,
            tooltip: 'Export',
            includeLabel: includeLabel
        });
    },

    buildPrintMenuItem: function(includeLabel) {
        return this.buildToolbarButton({
            type: 'print',
            glyph: 61773,
            tooltip: 'Print',
            includeLabel: includeLabel
        });
    },

    // "Edit" menu

    buildEditMenuItems: function(includeLabel) {
        var editMenuItems = [
            this.buildUndoMenuItem(includeLabel),
            this.buildRedoMenuItem(includeLabel)
        ];

        Ext.Array.push(editMenuItems, this.buildCutCopyPasteMenu());

        // TODO: plugin to controller
        editMenuItems.push({ type: 'selectAll', text: 'Select All' });
        editMenuItems.push({ type: 'deselect', text: 'Deselect' });
        editMenuItems.push({ type: 'delete', text: 'Delete' });

        return editMenuItems;
    },

    buildUndoMenuItem: function(includeLabel) {
        return this.buildToolbarButton({
            type: 'undo',
            glyph: 61800,
            tooltip: 'Undo',
            includeLabel: includeLabel
        });
    },

    buildRedoMenuItem: function(includeLabel) {
        return this.buildToolbarButton({
            type: 'redo',
            glyph: 61777,
            tooltip: 'Redo',
            includeLabel: includeLabel
        });
    },

    buildCutCopyPasteMenu: function() {
        return [
            { type: 'cut', glyph: 61718, text: 'Cut', ui: 'flat-toolbar-button' },
            { type: 'copy', glyph: 61769, text: 'Copy', ui: 'flat-toolbar-button' },
            { type: 'paste', glyph: 61716, text: 'Paste', ui: 'flat-toolbar-button' }
        ];
    },

    // "View" menu

    buildViewMenuItems: function(includeLabel) {
        var viewMenuItems = [];

        viewMenuItems.push(this.buildZoomInItem(includeLabel));
        viewMenuItems.push(this.buildZoomOutItem(includeLabel));
        viewMenuItems.push(this.buildZoomToFitItem(includeLabel));
        viewMenuItems.push({ type: 'layout submenu', text: 'Layout', menu: this.buildLayoutMenuItems() });
        viewMenuItems.push({ text: 'Show', menu: this.buildShowMenuItems() });

        return viewMenuItems;
    },

    buildZoomInItem: function(includeLabel) {
        return this.buildToolbarButton({
            type: 'zoomIn',
            glyph: 61806,
            tooltip: 'Zoom In',
            includeLabel: includeLabel
        });
    },

    buildZoomOutItem: function(includeLabel) {
        return this.buildToolbarButton({
            type: 'zoomOut',
            glyph: 61807,
            tooltip: 'Zoom Out',
            includeLabel: includeLabel
        });
    },

    buildZoomToFitItem: function(includeLabel) {
        return this.buildToolbarButton({
            type: 'zoomToFit',
            glyph: 61789,
            tooltip: 'Fit in Window',
            includeLabel: includeLabel
        });
    },

    buildLayoutMenuItems: function() {
        return [
            { type: 'grid', text: 'Grid' },
            { type: 'tree', text: 'Tree' },
            { type: 'force', text: 'Force' },
            { type: 'layeredDigraph', text: 'Layered Digraph' },
            { type: 'circular', text: 'Circular' }
        ];
    },

    buildShowMenuItems: function() {
        return [
            { type: 'toggleGrid', glyph: 61739, text: 'Grid', ui: 'flat-toolbar-button' },
            { type: 'toggleOverview', glyph: 61736, text: 'Overview', ui: 'flat-toolbar-button' },
            { type: 'toggleLinkType', text: 'Link Type' },
            { type: 'toggleNodeType', text: 'Node Type' },
            { type: 'toggleNodeDescriptions', text: 'Node Description' },
            { type: 'snapToGrid', text: 'Snap to Grid' },
            { type: 'gridSettings', text: 'Grid Settings' },
            { type: 'expandAllNodes', text: 'Expand All Nodes' }
        ];
    },

    // "Format" menu

    buildFormatMenuItems: function() {
        var linkTemplateNames, linkStyleMenuChoices, linkRelationshipTypes, linkTypeMenuChoices;

        linkTemplateNames = Savanna.crumbnet.utils.ViewTemplates.getLinkTemplateNames();
        linkStyleMenuChoices = Ext.Array.map(linkTemplateNames, function maplLinkTemplateNames(item) {
            return { type: item, text: item };
        });

        linkRelationshipTypes = Savanna.crumbnet.utils.ViewTemplates.linkRelationshipTypes;
        linkTypeMenuChoices = Ext.Array.map(linkRelationshipTypes, function mapLinkRelationshipTypes(item) {
            return { type: item, text: item };
        });

        return [
            {
                type: 'alignment submenu',
                text: 'Alignment',
                menu: [
                    { type: 'right', text: 'Align Right' },
                    { type: 'left', text: 'Align Left' },
                    { type: 'top', text: 'Align Top' },
                    { type: 'bottom', text: 'Align Bottom' },
                    { type: 'center', text: 'Align Center' }
                ]
            },
            {
                type: 'nodeColor submenu',
                text: 'Node Color',
                menu: { xtype: 'colormenu', itemId: 'nodeColorPicker' }
            },
            {
                type: 'linkStyle submenu',
                text: 'Link Style',
                menu: linkStyleMenuChoices
            },
            {
                type: 'linkType submenu',
                text: 'Link Type',
                menu: linkTypeMenuChoices
            }
        ];
    },

    // "Object" menu

    buildObjectMenuItems: function() {
        var objectMenuItems = [
            { type: 'flag', text: 'Flag' },
            { type: 'tag', text: 'Tag' },
            { type: 'link', text: 'Link' },
            { type: 'comment', text: 'Comment' }
        ];

        return objectMenuItems;
    },

    // helpers

    buildToolbarButton: function(options) {
        var includeLabel = options.includeLabel,
            buttonOptions;

        delete options.includeLabel;

        buttonOptions = Ext.apply({}, options, {
           ui: 'flat-toolbar-button'
        });

        if (includeLabel) {
            buttonOptions.text = buttonOptions.tooltip;
        }

        return buttonOptions;
    }
});