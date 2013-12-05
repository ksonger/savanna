/* global Ext: false, Savanna: false */
/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 8/19/13
 * Time: 9:41 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.store.SearchResults', {
    extend: 'Ext.data.JsonStore',

    requires: [
        'Savanna.search.model.SearchResult',
        'Savanna.proxy.Cors'
    ],

    storeId: 'searchResults',

    model: 'Savanna.search.model.SearchResult',

    autoLoad: false,

    pageSize: 20,

    facetValueSummaries:null,

    facetFilterCriteria:[],

    dateTimeRanges:[],

    constructor: function () {

        var ReaderClass = null,
            me = this;

        this.callParent(arguments);


        /*
        Must set totalProperty on the reader for our paging toolbar to work.  Because
        base elements are all on the same level in a json object with no key, the only way
        appears to be to modify the json object in readRecords to have a key value,
        which is set to 'data' in this case.  Allows then for 'data.totalResults', etc...
         */
        ReaderClass = Ext.extend(Ext.data.JsonReader, {
            type:'json',
            root: 'results',
            totalProperty:'totalResults',
            readRecords: function(data) {
                me.facetValueSummaries = data.facetValueSummaries;
                //TODO - Should this really come from the server
                //The thumbnail url needs to be set
                var i = 0, records = data.results, l = records.length;
                for (i; i < l; i++){
                    records[i].documentSource = SavannaConfig.documentUrl + encodeURI(records[i].uri) + '/thumbnail?maxWidth=113&maxHeight=76';
                }
                return this.callParent([data]);
            }

        });

        this.setProxy({
            type: 'savanna-cors',
            url: SavannaConfig.searchUrl,
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
