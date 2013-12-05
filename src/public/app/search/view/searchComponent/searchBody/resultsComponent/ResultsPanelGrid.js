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
    controller: 'Savanna.search.controller.resultsComponent.ResultsPanelGridController',

    requires: [
        'Savanna.search.controller.resultsComponent.ResultsPanelGridController',
        'Ext.grid.plugin.DragDrop',
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
            hideable: false,
            xtype: 'templatecolumn',
            tpl: new Ext.XTemplate(
                '<div style="position: relative" >',
                '<div class="resultDiv">',

                '{[this.getImgDiv(values)]}',
                '<div class="grid-cell-title"><strong class="openClass">{title}</strong></div>',
                '<div class="contentDiv">({composite}) - {[this.parseDate(new Date(values.publishedDate))]} - {documentFileName}<br />{previewString}</div>',
                '</div>',
                '</div>',
                {
                    parseDate: function (v) {
                        return Ext.Date.format(new Date(v), 'F d, Y');
                    },
                    getImgDiv: function (record) {
                        var result = '';
                        if (record.contentType === 'Image') {
                            result = '<div class="sourceDiv" ><img src="' + record.documentSource + '"/></div>';
                        }
                        return result;
                    }
                }
            )
        }
    ],

    viewConfig: {
        plugins: {
            dragGroup: 'SEARCH-ITEMS',
            ptype: 'gridviewdragdrop',
            enableDrop: false,
            enableDrag: true
        }
    },
    hideHeaders: true,
    header: false,
    forceFit: true

});