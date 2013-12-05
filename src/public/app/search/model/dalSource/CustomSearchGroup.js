/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 8/16/13
 * Time: 2:32 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.model.dalSource.CustomSearchGroup', {
    extend: 'Ext.data.Model',

    alternateClassName: 'DalCustomSearchGroup',

    requires: [
        'Savanna.search.model.dalSource.CustomSearchParameter'
    ],

    fields: [
        { name: 'id', type: 'string' },
        { name: 'displayLabel', type: 'string' }
    ],

    belongsTo: 'Savanna.search.model.DalSource',

    hasMany: [
        { model: 'Savanna.search.model.dalSource.CustomSearchParameter', name: 'customSearchParameters' }
    ]
});