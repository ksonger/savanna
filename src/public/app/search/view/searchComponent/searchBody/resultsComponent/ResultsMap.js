/**
 * Created with IntelliJ IDEA.
 * User: sseely
 * Date: 10/1/13
 * Time: 1:50 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsMap', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.search_resultsmap',

    requires: [
        'Savanna.controller.Factory',
        'Savanna.search.view.searchComponent.searchBody.searchMap.Canvas',
        'Savanna.search.view.searchComponent.searchBody.searchMap.FeaturePopUp'
    ],

    region: 'center',
    header: false,
    layout: 'absolute',

    items: [
        {
            xtype: 'search_map_canvas',
            height: '100%',
            width: '100%',
            itemId: 'resultMapCanvas',
            flex: 1
        },
        {
            xtype: 'search_featurepopup',
            itemId: 'featurePopUp'
        }
    ],


    initComponent: function () {
        //Savanna.controller.Factory.getController('Savanna.search.controller.ResultsComponent');
        this.callParent(arguments);
    }
});
