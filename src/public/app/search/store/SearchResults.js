/* global Ext: false, Savanna: false */
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
