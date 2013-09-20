/* global Ext: false, go: false, Savanna: false */
Ext.define('Savanna.crumbnet.view.part.Canvas', {
    extend: 'Ext.Component',
    alias: 'widget.go-graph_canvas',

    requires: [
        'Savanna.crumbnet.utils.ViewTemplates'
    ],

    mixins: {
        storeable: 'Savanna.mixin.Storeable'
    },

    store: 'Savanna.crumbnet.store.Graph',

    diagram: null,

    initComponent: function() {
        this.callParent(arguments);

        Savanna.controller.Factory.getController('Savanna.crumbnet.controller.CrumbnetController');

        // NOTE: borrowed from Ext.panel.Table (abbreviated version of how it uses a store for it's data backend)
        this.mixins.storeable.initStore.call(this);
    },

    onRender: function() {
        var domElem;

        this.callParent(arguments);

        domElem = Ext.DomHelper.insertHtml('afterBegin', this.getEl().dom, '<div class="go-graph" style="width: 100%; height: 100%; position: absolute;"></div>');

        this.diagram = new go.Diagram(domElem);
        this.diagram.nodeTemplateMap = Savanna.crumbnet.utils.ViewTemplates.generateNodeTemplateMap();
        this.diagram.linkTemplateMap = Savanna.crumbnet.utils.ViewTemplates.generateLinkTemplateMap();

        // have mouse wheel events zoom in and out instead of scroll up and down
        this.diagram.toolManager.mouseWheelBehavior = go.ToolManager.WheelZoom;
        this.diagram.allowDrop = true;
        this.diagram.initialContentAlignment = go.Spot.Center;

        if (this.store.getCount() > 0) {
            this.onStoreLoad(this.store);
        }

        this.on('resize', Ext.bind(function() { this.diagram.requestUpdate(); }, this));
        this.on('show', Ext.bind(function() { this.diagram.requestUpdate(); }, this));

        this.diagram.layout = go.GraphObject.make(go.ForceDirectedLayout, { isOngoing: false });

        this.diagram.toolManager.linkingTool.archetypeLinkData = {
            category: Savanna.crumbnet.utils.ViewTemplates.defaultLinkTemplate,
            text: Savanna.crumbnet.utils.ViewTemplates.linkRelationshipTypes[Savanna.crumbnet.utils.ViewTemplates.linkRelationshipTypes.length - 1]
        };

        this.diagram.toolManager.linkingTool.direction = go.LinkingTool.ForwardsOnly;
        this.diagram.toolManager.linkingTool.portGravity = 10;

        this.diagram.model.undoManager.isEnabled = true;

        //TODO - Move this to the controller
        this.diagram.addDiagramListener('PartResized', Ext.bind(this.partResized, this));
        this.diagram.addDiagramListener('ExternalObjectsDropped', Ext.bind(this.externalObjectsDropped, this));
        this.diagram.addDiagramListener('TextEdited', Ext.bind(this.textEdited, this));

        this.diagram.toolManager.linkingTool.findLinkablePort = this.findPort;
    },

    // CUSTOM METHODS

    textEdited: function() {
        // reset our textarea selection so that we do not have anything selected yet
        this.diagram.toolManager.textEditingTool.currentTextEditor.setSelectionRange(0,0);
    },

    partResized: function(diagramEvent) {
        if (diagramEvent.subject instanceof go.TextBlock){
            var textBlock = diagramEvent.subject;
            textBlock.height = textBlock.lineCount * 15; //TODO - need to do this a better way - super brittle
        }
    },

    externalObjectsDropped: function(diagramEvent) {
        var addedNode = diagramEvent.subject.first();

        Savanna.crumbnet.utils.ViewTemplates.setupTextEditor(this.diagram, addedNode.findObject('title'));
    },

    findPort: function() {
        var diagram = this.diagram,
            obj;

        if (diagram === null) {
            return null;
        }

        obj = diagram.findObjectAt(diagram.firstInput.documentPoint, null, null);

        if (obj === null) {
            return null;
        }

        var node = obj.part;

        if (!(node instanceof go.Node)) {
            return null;
        }

        // return the node, not the obj
        if (obj.fromLinkable === true) {
            return node;
        }

        return null;
    },

    onStoreLoad: function(store) {
        if (this.diagram) {
            //TODO - this is just getting the first array in the store - we need to figure out how we really want to use the stores
            var graphRecord = store.getAt(0);

            this.diagram.model = go.GraphObject.make(go.GraphLinksModel, {
                nodeDataArray: graphRecord.get('nodeDataArray'),
                linkDataArray: graphRecord.get('linkDataArray')
            });
        }
    }
});