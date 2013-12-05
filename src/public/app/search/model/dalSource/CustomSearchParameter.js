/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 8/16/13
 * Time: 2:32 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.model.dalSource.CustomSearchParameter', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'id', type: 'string' },
        { name: 'displayLabel', type: 'string' },
        { name: 'defaultValue' },
        { name: 'date' },
        { name: 'parameterType', type: 'string' },

        // NOTE: could possibly be hasMany relationships...
        { name: 'list' },
        { name: 'radioOptions' }
    ],

    belongsTo: 'Savanna.search.model.dalSource.CustomSearchGroup'
});