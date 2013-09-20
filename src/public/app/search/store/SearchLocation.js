/**
 * Created with IntelliJ IDEA.
 * User: swatson
 * Date: 8/15/13
 * Time: 8:20 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.store.SearchLocation', {
    extend: 'Ext.data.JsonStore',

    requires: [
        'Savanna.Config',
        'Savanna.search.model.SearchLocation',
        'Savanna.proxy.Cors'
    ],

    storeId: 'findLocation',

    model: 'Savanna.search.model.SearchLocation',

    //THIS NEED TO BE TAKEN OUT WHEN WE START HITTING REAL SERVICES AND THE PLACE WE ARE SEARCHING FOR
    //NEEDS TO BE SENT AS A PARAMETER
    autoLoad: true,

    constructor: function () {
        this.callParent(arguments);

        this.setProxy({
            type: 'savanna-cors',

            // the follow url will replace the url in use once we have a service running
            //url: Savanna.Config.buildSavannaUrl('locationSearch'),
            url: 'app/assets/data/testSearchLocationSearch.json',
            addSessionId: false, // this needs to be left in until using correct url or Ted adds node fix

            reader: {
                type: 'json',
                root: 'data'
            }
        });
    }
});