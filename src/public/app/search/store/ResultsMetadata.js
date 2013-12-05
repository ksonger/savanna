/* global Ext: false, SavannaConfig: false */
/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 8/19/13
 * Time: 9:41 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.store.ResultsMetadata', {
    extend: 'Ext.data.JsonStore',

    requires: [
        'Savanna.search.model.ResultMetadata',
        'Savanna.proxy.Cors'
    ],

    storeId: 'searchResultsMetadata',

    model: 'Savanna.search.model.ResultMetadata',

    autoLoad: false,

    pageSize: 20,

    constructor: function () {

        var ReaderClass = null;

        this.callParent(arguments);

        ReaderClass = Ext.extend(Ext.data.JsonReader, {
            type:'json',
            root: 'results',
            readRecords: function(data) {
                return this.callParent([{'results':data}]);
            }
        });

        this.setProxy({
            type: 'savanna-cors',
            url: SavannaConfig.searchMetadataUrl,
            reader: new ReaderClass(),

            modifyRequest:function(request) {
                Ext.apply(request, {
                    jsonData: this.jsonData,
                    method:'POST'
                });

                return request;
            }
        });
    }
});
