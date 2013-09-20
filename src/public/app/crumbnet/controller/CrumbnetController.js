/* global Ext: false, go: false, Savanna: false */
Ext.define('Savanna.crumbnet.controller.CrumbnetController', {
    extend: 'Ext.app.Controller',

    views: [
        'Savanna.crumbnet.view.CrumbnetComponent',
        'Savanna.crumbnet.view.part.PaletteMenu',
        'Savanna.crumbnet.view.part.Canvas',
        'Savanna.view.PrintModal'
    ],

    stores: [
        'Savanna.crumbnet.store.Graph',
        'Savanna.crumbnet.store.Templates'
    ],

    refs: [
        {
            ref: 'canvas',
            selector: 'go-graph_canvas'
        }
    ],

    init: function() {
        this.control({
            'go-graph_canvas': {
                afterrender: this.setupImageDrop
            },

            // set up an event listener for any toolbar element with a "type" that does not contain "submenu"
            'go-graph crumbnet_part_toolbar [type]:not([type~=submenu])': {
                click: this.dispatchHandler
            },

            // set up an event listener for buttons in any "submenu"
            'go-graph crumbnet_part_toolbar [type~=submenu] menu': {
                click: this.submenuDispatchHandler
            },

            'go-graph #search': {
                click: this.handleCrumbnetSearch
            },
            'crumbnet_part_palette-group': {
                'nodePaletteSelectionChanged': this.handlePaletteSelectionChange
            }
        });
    },

    // CUSTOM METHODS/CONFIGURATION

    setupImageDrop: function(canvasView) {
        if (typeof window.FileReader !== 'undefined') {
            var dropArea = canvasView.getEl().dom;

            dropArea.ondragover = function () {
                //TODO - check the type of thing dragged in to determine if it can be dropped
                //Note that false means it can be dropped
                return false;
            };

            dropArea.ondrop = Ext.bind(this.imageDropHandler, null, [canvasView.diagram], true);
        }
    },

    imageDropHandler: function(e, diagram) {
        e.preventDefault();
        //this context is the canvasView as defined in the listener above
        var file = e.dataTransfer.files[0],
            reader = new FileReader();

        reader.onload = function (event) {
            var screenPoint = new go.Point(e.layerX, e.layerY);
            var docPoint = diagram.transformViewToDoc(screenPoint);
            var newNode = {
                text: 'new image',
                category: 'image',
                key: Ext.id(), percent: 10,
                loc: docPoint.x + ' ' + docPoint.y,
                imageData: event.target.result
            };

            var model = diagram.model;
            diagram.startTransaction('addImage');
            model.addNodeData(newNode);
            diagram.commitTransaction('addImage');
        };

        reader.readAsDataURL(file);

        return false;
    },

    // event handlers

    submenuDispatchHandler: function(menu, item, event) {
        var actualMenu = this.getParentItem(menu),
            typeParts = Ext.String.splitWords(actualMenu.type),
            handler = 'handle';

        typeParts.forEach(function(word) {
            handler += Ext.String.capitalize(word);
        });

        this._dispatch(handler, menu, item, event);
    },

    dispatchHandler: function(button, event) {
        // Unfortunately, I was unable to figure out a query that would prevent calling this method for submenu buttons
        // So...we instead have to filter them out.
        if (this.isSubmenu(button)) {
            return;
        }

        var handler = 'handle' + Ext.String.capitalize(button.type);

        if (button.type === 'button') {
            return; // disregard spurious button "type"
        }

        this._dispatch(handler, button, event);
    },

    _dispatch: function() {
        var args = [].splice.call(arguments, 0),
            handler = args.shift();

        if (typeof this[handler] === 'function') {
            this[handler].apply(this, args);
        }
        else {
            Ext.Error.raise('Cannot find "' + handler + '" handler');
        }
    },

    handleSave: function(button) {
        this.showTODOmodal('Implement handleSave for menu.type "' + button.type + '"');
    },

    handleSaveAs: function(button) {
        this.showTODOmodal('Implement handleSaveAs for button.type "' + button.type + '"');
    },

    handleClose: function(button) {
        this.showTODOmodal('Implement handleClose for button.type "' + button.type + '"');
    },

    handleExport: function(button) {
        this.showTODOmodal('Implement handleExport for button.type "' + button.type + '"');
    },

    handlePrint: function(button) {
        var diagram = this.getDiagramForComponent(button);

        Ext.create('Savanna.view.PrintModal', {
            html: diagram.makeImage({ scale: 0.5 })
        }).show();
    },

    handleUndo: function(button) {
        var diagram = this.getDiagramForComponent(button);
        diagram.undoManager.undo();
    },

    handleRedo: function(button) {
        var diagram = this.getDiagramForComponent(button);
        diagram.undoManager.redo();
    },

    handleZoomIn: function(button) {
        var diagram = this.getDiagramForComponent(button);
        this.zoomTo(diagram, 0.9);
    },

    handleZoomOut: function(button) {
        var diagram = this.getDiagramForComponent(button);
        this.zoomTo(diagram, 1.1);
    },

    handleZoomToFit: function(button) {
        var diagram = this.getDiagramForComponent(button);
        diagram.zoomToFit();
    },

    zoomTo: function(diagram, zoomRatio) {
        var viewBounds = diagram.viewportBounds.copy();
        var centerPoint = viewBounds.center.copy();

        viewBounds.width *= zoomRatio;
        viewBounds.height *= zoomRatio;
        viewBounds.center = centerPoint;

        diagram.zoomToRect(viewBounds);
    },

    handleLayoutSubmenu: function(menu, item) {
        var diagram = this.getDiagramForComponent(menu),
            layout = null;

        switch (item.type) {
            case 'tree':
                layout = go.GraphObject.make(go.TreeLayout,{ isOngoing: false });
                break;
            case 'grid':
                layout = go.GraphObject.make(go.GridLayout, { comparer: go.GridLayout.smartComparer, isOngoing: false });
                break;
            case 'force':
                layout = go.GraphObject.make(go.ForceDirectedLayout, { isOngoing: false });
                break;
            case 'circular':
                layout = go.GraphObject.make(go.CircularLayout, { isOngoing: false });
                break;
            case 'layeredDigraph':
                layout = go.GraphObject.make(go.LayeredDigraphLayout, { isOngoing: false, layerSpacing: 50 });
                break;
            default:
                Ext.Error.raise('unknown type (' + item.type + ')');
                break;
        }

        if (layout) {
            diagram.startTransaction('ChangeLayout');
            diagram.layout = layout;
            diagram.commitTransaction('ChangeLayout');
        }
    },

    handleToggleGrid: function(button) {
        var diagram = this.getDiagramForComponent(button),
            newSetting = !diagram.grid.visible;

        diagram.grid.visible = newSetting;
        diagram.toolManager.draggingTool.isGridSnapEnabled = newSetting;
        diagram.toolManager.resizingTool.isGridSnapEnabled = newSetting;
    },

    handleToggleOverview: function(button) {
        var mainCrumbnetViewport = button.up('go-graph'),
            overview = mainCrumbnetViewport.down('go-graph_overview'),
            diagram = mainCrumbnetViewport.down('go-graph_canvas').diagram;

        if (overview) {
            mainCrumbnetViewport.remove(overview);
        }
        else {
            overview = Ext.create('Savanna.crumbnet.view.part.Overview', {});
            overview.setDiagram(diagram);
            mainCrumbnetViewport.add(overview);
        }
    },

    handleToggleLinkType: function(button) {
        this.showTODOmodal('Implement handleToggleLinkType for button.type "' + button.type + '"');
    },

    handleToggleNodeType: function(button) {
        this.showTODOmodal('Implement handleToggleNodeType for button.type "' + button.type + '"');
    },

    handleToggleNodeDescriptions: function(button) {
        this.showTODOmodal('Implement handleToggleNodeDescriptions for button.type "' + button.type + '"');
    },

    handleSnapToGrid: function(button) {
        this.showTODOmodal('Implement handleSnapToGrid for button.type "' + button.type + '"');
    },

    handleGridSettings: function(button) {
        this.showTODOmodal('Implement handleGridSettings for button.type "' + button.type + '"');
    },

    handleExpandAllNodes: function(button) {
        this.showTODOmodal('Implement handleExpandAllNodes for button.type "' + button.type + '"');
    },

    handleAlignNodes: function(button) {
        this.showTODOmodal('Implement handleAlignNodes for "' + button.type + '"');
    },

    handleCut: function(button) {
        this.getCommandHandlerForComponent(button).cutSelection();
    },

    handleCopy: function(button) {
        this.getCommandHandlerForComponent(button).copySelection();
    },

    handlePaste: function(button) {
        var diagram = this.getDiagramForComponent(button),
            commandHandler = diagram.commandHandler;

        diagram.startTransaction('menuPaste');
        commandHandler.pasteFromClipboard();
        diagram.commitTransaction('menuPaste');
    },

    handleSelectAll: function(button) {
        this.showTODOmodal('Implement handleSelectAll for button.type "' + button.type + '"');
    },

    handleDeselect: function(button) {
        this.showTODOmodal('Implement handleDeselect for button.type "' + button.type + '"');
    },

    handleDelete: function(button) {
        this.showTODOmodal('Implement handleDelete for button.type "' + button.type + '"');
    },

    handleAlignmentSubmenu: function(menu, item) {
        var diagram = this.getDiagramForComponent(menu),
            align = null;

        switch (item.type) {
            case 'right':
                align = go.Spot.Right;
                break;
            case 'left':
                align = go.Spot.Left;
                break;
            case 'top':
                align = go.Spot.Top;
                break;
            case 'bottom':
                align = go.Spot.Bottom;
                break;
            case 'center':
                align = go.Spot.Center;
                break;
            default:
                Ext.Error.raise('unknown type (' + item.type + ')');
                break;
        }

        if (align) {
            diagram.startTransaction('ChangeAlignment');
            diagram.contentAlignment = align;
            diagram.contentAlignment = go.Spot.Default;
            diagram.commitTransaction('ChangeAlignment');
        }
    },

    handleLinkStyleSubmenu: function(menu, item) {
        var linkTemplateNames = Savanna.crumbnet.utils.ViewTemplates.getLinkTemplateNames();

        if (Ext.Array.contains(linkTemplateNames, item.type)) {
            var diagram = this.getDiagramForComponent(menu);
            var selectedNodeSet = diagram.selection;
            var iterator = selectedNodeSet.iterator;

            // TODO: some interaction details to iron out
            //        1) if no links are selected, should all link styles be changed?
            //        2) if there are nodes selected, should anything change?
            //        3) if nothing will happen, does anything need to be communicated to the user?
            diagram.startTransaction('changeLinkStyle');
            while (iterator.next()) {
                if (iterator.value instanceof go.Link) {
                    diagram.model.setDataProperty(iterator.value, 'category', item.type);
                }
            }
            // TODO: should this be rollbackTransaction if nothing is changed?
            diagram.commitTransaction('changeLinkStyle');
        }
        else {
            Ext.Error.raise('Unknown link style "' + item.type + '"');
        }
    },

    handleLinkTypeSubmenu: function(menu, item) {
        var linkRelationshipTypes = Savanna.crumbnet.utils.ViewTemplates.linkRelationshipTypes,
            diagram,
            selectionSet,
            iterator;

        if (Ext.Array.contains(linkRelationshipTypes, item.type)) {
            diagram = this.getDiagramForComponent(menu);
            selectionSet = diagram.selection;
            iterator = selectionSet.iterator;

            diagram.startTransaction('changeLinkType');
            while (iterator.next()) {
                if (iterator.value instanceof go.Link) {
                    diagram.model.setDataProperty(iterator.value.data, 'text', item.type);
                }
            }
            // TODO: should this be rollbackTransaction if nothing is changed?
            diagram.commitTransaction('changeLinkType');
        }
        else {
            Ext.Error.raise('Unknown link type "' + item.type + '"');
        }
    },

    handleCrumbnetSearch: function(button) {
        this.showTODOmodal('Add functionality to search the crumbnet for "' + button.up('go-graph').down('#crumbnetSearchText').value + '"');
    },

    handleNodeColorSubmenu: function(picker, selColor){
        var diagram = this.getDiagramForComponent(picker);
        var selectionSet = diagram.selection;
        var iterator = selectionSet.iterator;

        diagram.startTransaction('changeNodeColor');

        while (iterator.next()) {
            if (iterator.value instanceof go.Node) {
                diagram.model.setDataProperty(iterator.value.data, 'color', '#' + selColor);
            }
        }

        diagram.commitTransaction('changeNodeColor');
    },

    handleFlag: function(button) {
        this.showTODOmodal('Implement handleFlag for button.type "' + button.type + '"');
    },

    handleTag: function(button) {
        this.showTODOmodal('Implement handleTag for button.type "' + button.type + '"');
    },

    handleLink: function(button) {
        this.showTODOmodal('Implement handleLink for button.type "' + button.type + '"');
    },

    handleComment: function(button) {
        this.showTODOmodal('Implement handleComment for button.type "' + button.type + '"');
    },

    handlePaletteSelectionChange: function(e, selPalette){
        var iterator = e.diagram.selection.iterator;

        //There should only ever be one selected node in the palette
        iterator.next();

        if (iterator.value){
            var mainView = selPalette.up('go-graph');
            var diagram = mainView.down('go-graph_canvas').diagram;

            diagram.toolManager.clickCreatingTool.archetypeNodeData = iterator.value.data;

            var palettes = mainView.query('crumbnet_part_palette-group');

            palettes.forEach(function(paletteView){
                if (selPalette !== paletteView){
                    paletteView.palette.clearSelection();
                }
            });
        }
    },

    // Helper methods

    getDiagramForComponent: function(component) {
        var crumbnet = component.up('go-graph');

        if (crumbnet) {
            return crumbnet.down('go-graph_canvas').diagram;
        }
        else if (component.xtype === 'go-graph_canvas') {
            return component.diagram;
        }
        else {
            Ext.Error.raise({ msg: 'Unable to retrieve diagram'});
        }
    },

    getCommandHandlerForComponent: function(component) {
        return this.getDiagramForComponent(component).commandHandler;
    },

    showTODOmodal: function(msg) {
        Ext.create('Ext.window.Window', {
            modal: true,
            width: 500,
            height: 100,
            html: 'TODO: ' + msg
        }).show();
    },

    getParentItem: function(elem) {
        return elem.parentItem || elem.ownerButton;
    },

    isSubmenu: function(elem) {
        var parentMenu = elem.parentMenu;

        if (parentMenu) {
            var parentItem = this.getParentItem(parentMenu);

            if (parentItem) {
                return parentItem.type && parentItem.type.match(/submenu/);
            }
        }

        return false;
    }
});