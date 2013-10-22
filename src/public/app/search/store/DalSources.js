/* global Ext: false, Savanna: false */
Ext.define('Savanna.search.store.DalSources', {
    extend: 'Ext.data.JsonStore',

    requires: [
        'Ext.data.proxy.Rest',
        'Savanna.proxy.Cors'
    ],

    model: 'Savanna.search.model.DalSource',

    storeId: 'dalSources',

    pageSize: 50,

    autoLoad: true,

    constructor: function() {
        var me = this,
            ReaderClass;

        this.callParent(arguments);

        // NOTE: we have to create a custom instance of the Json Reader in order to be able
        //       to parse the defaultId from the returned data since it is outside of the root...
        ReaderClass = Ext.extend(Ext.data.JsonReader, {
            root: 'sources',
            readRecords: function(data) {
                me.defaultId = data.defaultId || data.sources[0].id;
                return this.callParent([data]);
            }
        });

        this.setProxy({
            type: 'savanna-cors',
            url: SavannaConfig.dalSourcesUrl,
            // Turn off the paging params...
            startParam: undefined,
            limitParam: undefined,
            pageParam: undefined,

            reader: new ReaderClass(),

            writer: {
                type: 'json'
            }
        });
    }
});