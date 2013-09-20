/* global Ext: false */
Ext.define('Savanna.crumbnet.view.part.Overview', {
    extend: 'Ext.Component',
    alias: 'widget.go-graph_overview',

    overview: null,
    diagram: null,

    setDiagram: function(val) {
        this.diagram = val;

        if (this.overview) {
            this.overview.observed = val;
        }
    },

    onRender: function() {
        this.callParent(arguments);

        if (this.diagram) {
            var domElem = Ext.DomHelper.insertHtml('afterBegin', this.getEl().dom, '<div class="go-graph-overview" ' +
                'style="background-color: ' +
                'white; border-style:solid; ' +
                'border-width:1px; ' +
                'width: 200px; ' +
                'height: 200px; ' +
                'position: absolute; ' +
                'top: 0; left: 0; opacity: 1.0;' +
                'z-index: 10"></div>');

            this.overview = new go.Overview(domElem);
            this.overview.observed = this.diagram;
        }
    }
});