/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 8/8/13
 * Time: 1:19 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsPanelGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.search_resultspanelgrid',
    bubbleEvents: [
        'search:grid:itemdblclick',
        'search:grid:itemclick',
        'search:grid:itemmouseenter',
        'search:grid:itemmouseleave'
    ],
    controller: 'Savanna.search.controller.resultsComponent.ResultsPanelGridController',

    requires: [
        'Savanna.search.controller.resultsComponent.ResultsPanelGridController',
        'Ext.grid.column.Template',
        'Ext.XTemplate'
    ],

    mixins: {
        storeable: 'Savanna.mixin.Storeable'
    },

    sortableColumns: false,

    columns: [
        {
            text: ' ',
            xtype: 'templatecolumn',
            tpl: new Ext.XTemplate(

                '<div style="position: relative" >',
                '<div id="hoverDiv" style="visibility: hidden; right: 0;  top: 5; position: absolute;" ><button class="openButtonClass">Open</button></div>',
                '<table>',
                '<tr><td colspan="2" class="grid-cell-title"><strong>{title}</strong></td></tr>',
                '<td><img src="{documentSource}" width="80px" height="60px" /></td>',
                '<td>({composite}) - {[this.parseDate(new Date(values.publishedDate))]} - {documentFileName}<br />{previewString}</td>',
                '</table>',
                '</div>',
                {
                    parseDate: function (v) {
                        return Ext.Date.format(new Date(v), 'F d, Y');
                    }
                }
            )
        }
    ],

    header: false,
    forceFit: true,

    initComponent: function () {
        this.callParent(arguments);
    },

    onStoreLoad: function () {

        var controller = Savanna.controller.Factory.getController('Savanna.search.controller.ResultsComponent'),
            component = this.findParentByType('search_resultscomponent'),
            metadataArray = [];

        if (component.currentResultSet) {

            Ext.each(component.currentResultSet.store.data.items, function (record) {
                metadataArray.push(record.get('uri'));
            });

            controller.getDocumentMetadata(component.currentResultSet, metadataArray);
        }
    }
});